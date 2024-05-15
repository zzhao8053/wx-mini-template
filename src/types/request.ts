export enum Method {
  OPTIONS = 'OPTIONS',
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  TRACE = 'TRACE',
  CONNECT = 'CONNECT',
  PATCH = 'PATCH',
}

/**
 * "silent": "不显示",
 * "warn": "显示警告",
 * "error": "显示错误",
 * "notification": "显示提示",
 * "redirect": "页面跳转"
 */
export type IResponseShowType =
  | 'silent'
  | 'warn'
  | 'error'
  | 'notification'
  | 'redirect';

export interface IResponse<T> {
  success?: boolean;
  message: string;
  code?: number;
  data?: T;
  showType?: IResponseShowType;
  errorMessage?: string;
  file?: string;
  line?: number;
}

// 列表数据结构
export interface IListDataType<T> {
  list: T[];
  total: number;
  pageSize: number;
  current: number;
}

export type IListResponse<T> = IListDataType<T>;
