// pages/login/identity.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        identity: [
            {
                img: "../../images/login/liaoshang.jpg",
                val: "我是料商",
                type: "liaoshang"
            },
            {
                img: "../../images/login/yangzhihu.jpg",
                val: "我是养殖户",
                type: "yangzhihu"
            },
            {
                img: "../../images/login/yangzhihu.jpg",
                val: "我是投入品商",
                type: "tourupinshang"
            },

        ],
        isshow:[]
    },

    to_index(e) {
        let type = e.currentTarget.dataset.type
        if (type == "yangzhihu") {
            app.globalData.user_data.address_show = true
            wx.setStorageSync('user_data', app.globalData.user_data)
        } else {
            app.globalData.user_data.address_show = false
            wx.setStorageSync('user_data', app.globalData.user_data)
        }
        app.globalData.user_data.isStates = type
        wx.setStorageSync('user_data', app.globalData.user_data)
        wx.switchTab({
            url: '/pages/' + type + '/' + type
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            isshow:app.globalData.user_data.rules.split(",")
        })


    },

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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

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