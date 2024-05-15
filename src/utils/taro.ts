import Taro from '@tarojs/taro';

export function pxToRpx(number: number) {
  return Taro.pxTransform(number);
}


