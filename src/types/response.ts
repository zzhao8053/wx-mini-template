/**
 * 分页数据
 */
export interface IPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export enum HTTP_STATUS {
  /**
   * 服务器成功返回请求的数据
   */
  SUCCESS = 200,
  /**
   * 发出的请求有错误，服务器没有进行新建或修改数据的操作。
   */
  ERROR = 400,
  /**
   * 用户没有权限（令牌、用户名、密码错误）。
   */
  AUTHORIZED_ERROR = 401,
  /**
   * 发出的请求针对的是不存在的记录，服务器没有进行操作
   */
  NOT_FIND = 404,
  /**
   * 服务器发生错误，请检查服务器
   */
  SERVICE_ERROR = 500,
  /**
   * 网关超时
   */
  TIME_OUT = 504,
}

/**
 * 接口统一数据格式
 */
export interface IResponse<T> {
  code: HTTP_STATUS;
  data: T;
  message: string;
  pagination?: IPagination;
}
