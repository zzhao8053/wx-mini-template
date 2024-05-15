import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss';

const outputRoot = (() => {
  switch (process.env.TARO_ENV) {
    case 'weapp':
      return 'dist/weapp';
    case 'h5':
      return 'dist/h5';
    case 'rn':
      return 'dist/rn';
    case 'tt':
      return 'dist/tt';
    case 'quickapp':
      return 'dist/quickapp';
    case 'qq':
      return 'dist/qq';
    case 'jd':
      return 'dist/jd';
    case 'alipay':
      return 'dist/alipay';
    default:
      return 'dist';
  }
})();

const config = {
  projectName: 'red-cross-wx',
  date: '2024-5-13',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sourceRoot: 'src',
  outputRoot,
  plugins: [
    '@tarojs/plugin-html',
    'taro-plugin-compiler-optimization',

    // [
    //   'taro-plugin-dynamic-import-weapp',
    //   {
    //     // 指定一个子目录为动态加载的目录名称, 方便区分静态代码和动态代码, 默认 "dynamic-import"
    //     dynamicImportFolderName: 'dynamic-import',
    //     // 开发模式下启动的开发服务器端口, 默认自动分配端口
    //     port: 10000,
    //     // 指定动态加载链接 prefix, 默认 "http://127.0.0.1:默认端口/"
    //     publicPath: 'http://localhost:10000/',
    //   },
    // ],
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false },
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['nut-'],
        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
      htmltransform: {
        enable: true,
        // 设置成 false 表示 不去除 * 相关的选择器区块
        // 假如开启这个配置，它会把 tailwindcss 整个 css var 的区域块直接去除掉
        config: {
          removeCursorStyle: false,
        },
      },
    },
    webpackChain(chain) {
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [
              {
                appType: 'taro',
              },
            ],
          },
        },
      });
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    // esnextModules: ['nutui-react'],
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['nut-'],
        },
      },
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    webpackChain(chain) {
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [
              {
                appType: 'taro',
              },
            ],
          },
        },
      });
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
