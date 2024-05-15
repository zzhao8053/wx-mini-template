import Taro from "@tarojs/taro";
import {
  backNavigate,
  navigateToPackagesAuthLogin,
  redirectNavigate,
} from "@/navigate";
import { isWebUrl } from "@/utils/utils";
import { HTTP_STATUS } from "./config";
import type { IResponse, IResponseShowType, Method } from "@/types/request";
import BaseUrl from "@/utils/baseUrl";
import { RedirectPath } from "@/navigate/redirect.navigate";
import { decrypt } from "@/utils/e";

interface RequestParams<T = any> extends Taro.request.Option<T, any> {
  [propName: string]: any;
}

interface Chain {
  index: number;
  requestParams: RequestParams;

  proceed(requestParams: RequestParams): Promise<any>;
}

interface InterceptorResponse<T = any> {
  cookies: any[];
  data: T;
  errMsg: string;
  header: any;
  statusCode: number;
}

interface GeneralParams {
  token?: string;
  autoLoading?: boolean;
  message?: string;
}

interface GetParams extends GeneralParams {
  url: string;
  query?: any;
}

interface PostParams extends GeneralParams {
  url: string;
  data?: any;
}

interface PutParams extends GeneralParams {
  url: string;
  data?: any;
}

class Header {
  private readonly contentType: string = "application/json";

  private readonly authorization!: string;

  constructor(token?: string, contentType?: string) {
    if (token) {
      this.authorization = token;
    }
    if (contentType) {
      this.contentType = contentType;
    }
  }

  getHeader() {
    if (this.authorization) {
      return {
        "content-type": this.contentType,
        Authorization: `Bearer ${this.authorization}`,
      };
    }
    return { "content-type": this.contentType };
  }
}

class Request {
  interceptors: any[] = [];
  baseUrl: string = BaseUrl.getInstance().getBaseUrl();
  errorMessage: string = "请求失败,请检查网络";
  private exclude: string[] = [];

  constructor() {
    this.interceptors = [
      this.responseChainWithDataCodeOrSuccess,
      this.responseTypeModal,
      this.responseChainWithStatusCode,
      this.responseDecrypt,
    ];
    if (process.env.NODE_ENV === "development") {
      // this.interceptors.push(Taro.interceptors.logInterceptor);
    }
    this.interceptors.forEach((interceptorItem) =>
      Taro.addInterceptor(interceptorItem)
    );
  }

  responseChainWithDataCodeOrSuccess = (chain: Chain) => {
    return chain.proceed(chain.requestParams).then((res: IResponse<any>) => {
      if (res?.code === HTTP_STATUS.SUCCESS) {
        return res.data;
      }
      if (res?.success) {
        return res?.data ? res.data : res.success;
      }
      return this.responseErrorHandle({
        showType: "error",
        message: res.message,
      });
    });
  };

  responseTypeModal = (chain: Chain) => {
    return chain.proceed(chain.requestParams).then((res: IResponse<any>) => {
      this.responseShowTypeModal(
        chain.requestParams.url,
        res.showType as IResponseShowType,
        res.message,
        false
      );
      return res;
    });
  };

  responseChainWithStatusCode = (chain: Chain) => {
    return chain
      .proceed(chain.requestParams)
      .then((res: InterceptorResponse) => {
        if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
          navigateToPackagesAuthLogin();
          return this.responseErrorHandle({
            showType: "error",
            message: "登录失效，请重新登录",
          });
        }
        return res.statusCode === HTTP_STATUS.SUCCESS
          ? res.data
          : this.responseErrorHandle({
              showType: "error",
              message: res.data?.message,
            });
      });
  };

  responseDecrypt = (chain: Chain) => {
    return chain.proceed(chain.requestParams).then((res: IResponse<any>) => {
      if (res.data && res.data.success && res.data.encrypt === "Y") {
        res.data.data = decrypt(res.data.data);
      }
      return res;
    });
  };

  responseErrorHandle(config: {
    showType: IResponseShowType;
    message?: string | string[];
  }) {
    config.message = Array.isArray(config.message)
      ? config.message.join("\n")
      : config.message;
    return Promise.reject({
      ...config,
      errorMessage: config.message || this.errorMessage,
    });
  }

  responseShowTypeModal(
    url: string,
    showType: IResponseShowType,
    message: string | string[],
    isForce: boolean
  ) {
    const task = () => {
      message = Array.isArray(message) ? message.join("\n") : message;
      switch (showType) {
        case "notification":
          Taro.showModal({
            title: message,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                backNavigate();
              }
            },
          });
          break;
        case "warn":
          setTimeout(() => {
            Taro.showToast({
              title: message as string,
              icon: "error",
              duration: 3000,
            });
          });
          break;
        case "error":
          setTimeout(() => {
            Taro.showToast({
              title: message as string,
              icon: "none",
              duration: 3000,
            });
          });
          break;
        case "redirect":
          redirectNavigate(message as RedirectPath);
      }
    };
    if (isForce) {
      task();
    } else {
      if (!this.exclude.includes(url)) {
        task();
      }
    }
  }

  showLoading(type: "show" | "hide", loading?: boolean, message?: string) {
    if (type === "show" && loading) {
      Taro.showLoading({
        title: message || "",
        mask: true,
      });
      return;
    }
    if (type === "hide") {
      Taro.hideLoading();
    }
  }

  baseRequest<T = any>(
    params: any,
    method: keyof Method,
    token?: string,
    autoLoading?: boolean,
    message?: string
  ) {
    let { url, data } = params;
    const headers = new Header(token, params.contentType).getHeader();
    const options = {
      url: isWebUrl(url) ? url : this.baseUrl + url,
      data: data,
      method: method,
      header: headers,
    };
    this.showLoading("show", autoLoading, message);
    return Taro.request<IResponse<T>>({ ...options })
      .catch((err) => {
        this.responseShowTypeModal(url, err.showType, err.errorMessage, true);
        return new Error(err.errorMessage);
      })
      .finally(() => {
        this.showLoading("hide");
      });
  }

  get<T>(
    params: string,
    query?: any,
    token?: string,
    autoLoading?: boolean,
    message?: string
  ): Promise<T>;
  get<T>(params: GetParams): Promise<T>;
  get<T>(
    params: string | GetParams,
    query?: any,
    token?: string,
    autoLoading?: boolean,
    message?: string
  ) {
    const options: GetParams = { url: "" };
    if (typeof params === "string") {
      options.url = params;
      options.query = query;
      options.token = token;
      options.autoLoading = autoLoading;
      options.message = message;
    } else {
      const { url, query, token, message, autoLoading } = params;
      options.url = url;
      options.query = query;
      options.token = token;
      options.autoLoading = autoLoading;
      options.message = message;
    }

    return this.baseRequest<T>(
      { url: options.url, data: options.query },
      "GET",
      options.token,
      options.autoLoading,
      options.message
    );
  }

  post<T>(
    params: string,
    data?: any,
    token?: string,
    autoLoading?: boolean,
    message?: string
  ): Promise<T>;
  post<T>(params: PostParams): Promise<T>;
  post<T>(
    params: PostParams | string,
    data?: any,
    token?: string,
    autoLoading?: boolean,
    message?: string
  ) {
    const options: PostParams = { url: "" };
    if (typeof params === "string") {
      options.url = params;
      options.data = data;
      options.token = token;
      options.autoLoading = autoLoading;
      options.message = message;
    } else {
      const { url, data, token, message, autoLoading } = params;
      options.url = url;
      options.data = data;
      options.token = token;
      options.autoLoading = autoLoading;
      options.message = message;
    }
    return this.baseRequest<T>(
      { url: options.url, data: options.data },
      "POST",
      options.token,
      options.autoLoading,
      options.message
    );
  }

  put<T>(
    params: string,
    data?: any,
    token?: string,
    autoLoading?: boolean,
    message?: string
  ): Promise<false | T | Error>;
  put<T>(params: PutParams): Promise<false | T | Error>;
  put<T>(
    params: PutParams | string,
    data?: any,
    token?: string,
    autoLoading?: boolean,
    message?: string
  ) {
    const options: PutParams = { url: "" };
    if (typeof params === "string") {
      options.url = params;
      options.data = data;
      options.token = token;
      options.autoLoading = autoLoading;
      options.message = message;
    } else {
      const { url, data, token, message, autoLoading } = params;
      options.url = url;
      options.data = data;
      options.token = token;
      options.autoLoading = autoLoading;
      options.message = message;
    }
    return this.baseRequest<T>(
      { url: options.url, data: options.data },
      "PUT",
      options.token,
      options.autoLoading,
      options.message
    );
  }

  delete<T>(
    params: string,
    data?: any,
    token?: string,
    autoLoading?: boolean,
    message?: string
  ): Promise<false | T | Error>;
  delete<T>(params: PutParams): Promise<false | T | Error>;
  delete<T>(
    params: PutParams | string,
    data?: any,
    token?: string,
    autoLoading?: boolean,
    message?: string
  ) {
    const options: PutParams = { url: "" };
    if (typeof params === "string") {
      options.url = params;
      options.data = data;
      options.token = token;
      options.autoLoading = autoLoading;
      options.message = message;
    } else {
      const { url, data, token, message, autoLoading } = params;
      options.url = url;
      options.data = data;
      options.token = token;
      options.autoLoading = autoLoading;
      options.message = message;
    }
    return this.baseRequest<T>(
      { url: options.url, data: options.data },
      "DELETE",
      options.token,
      options.autoLoading,
      options.message
    );
  }

  setExcludeURl(path: string) {
    if (isWebUrl(path)) {
      this.exclude.push(path);
    } else {
      this.exclude.push(this.baseUrl + path);
    }
  }
}

const request = new Request();

// 忽略上传文件URL
request.setExcludeURl("/v1/auth/images");

export default request;
