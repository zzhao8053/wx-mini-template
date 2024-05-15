import Taro from '@tarojs/taro';

/**
 * 检查小程序的更新状态
 */
export function checkMiniUpdate() {
  const updateManager = Taro.getUpdateManager();
  updateManager.onCheckForUpdate((res) => {
    console.log('更新callback：', res);
  });

  updateManager.onUpdateReady(function () {
    Taro.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (res.confirm) {
          updateManager.applyUpdate();
        }
      },
    });
  });

  updateManager.onUpdateFailed(function () {});
}
