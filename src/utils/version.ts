import Taro from "@tarojs/taro";

export type IEnvVersion = "develop" | "release" | "trial";

const envVersion = Taro.getAccountInfoSync().miniProgram
  .envVersion as IEnvVersion;
export default envVersion;
