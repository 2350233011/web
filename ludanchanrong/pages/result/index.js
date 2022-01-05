const BaseJs = require('../../static/project/base.js')
const app = getApp()
Page({
  data: {
    title: '验证中...',
    src: "../../images/login/loading.gif"
  },
  onLoad() {
    var data = BaseJs.globalData.successInfo.data, globalData = BaseJs.globalData, that = this
    var faceImg = data.faceImg

    setTimeout(function () {
      setTimeout(function () {
        wx.switchTab({ url: '/pages/liaoshang/liaoshang' })
      }, 1500)

      that.setData({
        title:"验证成功",
        src: "../../images/login/chenggong.png"
      })
    }, 1500)
  },
})
