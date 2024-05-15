const dingTalkEvent = require("./dingtalk.notify");

module.exports = function (ctx) {
  ctx.register({
    name: "onPreviewComplete",
    fn: ({ success, data, error }) => {
      if (success) {
        dingTalkEvent(data);
      }
    },
  });

  ctx.register({
    name: "onUploadComplete",
    fn: ({ success, data, error }) => {
      if (success) {
        dingTalkEvent(data);
      }
    },
  });
};
