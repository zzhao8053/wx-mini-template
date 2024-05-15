import { CSSProperties, ReactNode } from 'react';

export interface IMenuItem {
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  url?: (() => void) | string;
  bgUrl?: string;
  round?: boolean;
}

export type IGeneralKeyValue = {
  label: string;
  value: any;
  [key: string]: any;
};

export interface IClickable<T = any> {
  onClick: (value: T) => void;
}

// 字典
export interface IConfigDictionary {
  [key: string]: { [key: string]: IGeneralKeyValue[] };
}

export interface Classname {
  classname: string;
}

export interface Style {
  style: CSSProperties;
}

export interface IStyles extends Partial<Classname>, Partial<Style> {}

export interface IPaginationParam {
  page: number;
  pageSize: number;
}
