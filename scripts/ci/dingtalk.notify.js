const dayjs = require('dayjs');
const DingTalkRobot = require('./DingTalkRobot');

const KEY_WORLD = '微信小程序（CI）';
const robot = new DingTalkRobot({
  baseUrl: 'https://oapi.dingtalk.com/robot/send',
  accessToken: '',
});

/**
 * @param data {
 *     platform, // 当前构建的小程序平台
 *     qrCodeLocalPath, // 预览码本地路径
 *     qrCodeContent, // 预览码内容
 *     version, // 插件传递的预览版本号
 *     desc, // 插件传递的描述文本
 *     projectPath, // 预览或上传的目录路径
 * }
 */
module.exports = async function dingtalkNotify(data) {
  const { version, desc } = data;
  const now = dayjs().format('YYYY-MM-DD HH点mm分');
  const textContent = `${KEY_WORLD}\n
  \n
  * [版本]：${version}\n
  * [更新内容]：${desc}\n
  * [发布时间]：${now}\n
  `;

  const mark_content = {
    msgtype: 'markdown',
    markdown: {
      title: KEY_WORLD,
      text: textContent,
    },
    at: {
      isAtAll: false,
    },
  };
  const res = await robot.send(mark_content);
};
