// pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: [],
    title: "好好生活,慢慢相遇"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  logout: function (e) {
    // wx.clearStorageSync()
    try {
      wx.clearStorageSync()
    } catch (e) {
      console.log(e);
    }
    wx.reLaunch({
      url: '../login/login'
    })
  },

  onLoad: function (options) {
    let _this = this;
    _this.setData({
      user: app.globalData.user_code
    })
    // wx.request({
    //   url: 'https://nmsl.shadiao.app/api.php?level=min&lang',
    //   success(e) {
    //     _this.xianshi(e);
    //   }
    // })

  },
  // xianshi: function (e) {
  //   this.setData({
  //     title: e.data
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  //刷新
  onRefresh: function () {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
    })
    this.getData();
  },
  //网络请求，获取数据
  getData: function () {
    wx.request({
      url: '',
      //网络请求执行完后将执行的动作
      complete(res) {
        //隐藏loading 提示框
        wx.hideLoading();
        //隐藏导航条加载动画
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})