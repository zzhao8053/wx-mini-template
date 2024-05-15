import { routesMain } from './router';

export default defineAppConfig({
  pages: routesMain,
  entryPagePath: routesMain.at(0),
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '荆楚志愿红',
    navigationBarTextStyle: 'black',
  },
  lazyCodeLoading: 'requiredComponents',
  networkTimeout: {
    request: 10000,
    uploadFile: 10000,
    downloadFile: 10000,
    connectSocket: 10000,
  },
  plugins: {},
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示',
    },
    'scope.userLocationBackground': {
      desc: '后台定位',
    },
  },
  requiredPrivateInfos: ['getLocation'],
  navigateToMiniProgramAppIdList: [],
  usingComponents: {
    'custom-wrapper': 'custom-wrapper',
  },
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        pagePath: 'pages/my/index',
        text: '我的',
      },
    ],
  },
});
