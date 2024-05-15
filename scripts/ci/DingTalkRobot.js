"use strict";

const axios = require("axios");
const crypto = require("crypto");

function sign(secret, content) {
  const str = crypto
    .createHmac("sha256", secret)
    .update(content)
    .digest()
    .toString("base64");
  return encodeURIComponent(str);
}

class DingTalkRobot {
  /**
   * 机器人工厂，所有的消息推送项目都会调用 this.webhook 接口进行发送
   *
   * @param {String} options.webhook 完整的接口地址
   * @param {String} options.baseUrl 接口地址
   * @param {String} options.accessToken accessToken
   * @param {String} options.secret secret
   * @param {*} options.httpclient 例如 urllib / axios
   */
  constructor(options) {
    options = options || {};
    if (!options.webhook && !(options.accessToken && options.baseUrl)) {
      throw new Error("Lack for arguments!");
    }
    this.httpclient = options.httpclient || axios;
    this.webhook =
      options.webhook ||
      `${options.baseUrl}?access_token=${options.accessToken}`;
    this.secret = options.secret;
  }

  /**
   * 发送钉钉消息
   */
  send(content) {
    const { httpclient } = this;
    let signStr = "";
    if (this.secret) {
      const timestamp = Date.now();
      signStr =
        "&timestamp=" +
        timestamp +
        "&sign=" +
        sign(this.secret, timestamp + "\n" + this.secret);
    }
    return httpclient.request(this.webhook + signStr, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(content),
    });
  }

  /**
   * 发送Markdown消息
   *
   * @param {String} title 标题
   * @param {String} text 消息内容(支持Markdown)
   * @return {Promise}
   */
  markdown(title, text, at) {
    at = at || {};
    return this.send({
      msgtype: "markdown",
      markdown: {
        title,
        text,
      },
      at,
    });
  }
}

module.exports = DingTalkRobot;
