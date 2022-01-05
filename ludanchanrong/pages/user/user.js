// pages/user/user.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        more_role: false,
        region: [],

        user_data: "",
        userinfo: "",
        // region: ['山东省', '济南市', '历下区'],

    },
    RegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
    },

    change_user: function (e) {
        let that = this, type = e.currentTarget.dataset.type, data = e.currentTarget.dataset.data
        wx.navigateTo({
            url: '/pages/user/user_change?type=' + type + '&data=' + data
        })
    },


    //选择图片
    // ChooseImage() {
    //     let that = this
    //     wx.chooseImage({
    //         count: 1, //默认9
    //         sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    //         sourceType: ['album'], //从相册选择
    //         success: (res) => {
    //             that.setData({
    //                 imgList: res.tempFilePaths
    //             })
    //             console.log(res.tempFilePaths);
    //         }
    //     });
    // },
    switch(e) {
        wx.reLaunch({
            url: '/pages/login/identity'
        })
    },

    logout(e) {
        try {
            // wx.clearStorageSync()
            wx.removeStorageSync('token')
            wx.removeStorageSync('user_data')
            wx.removeStorageSync('wx_config')
            wx.reLaunch({
                url: '/pages/login/login'
            })
        } catch (e) {
            // Do something when catch error
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.globalData.user_data = wx.getStorageSync('user_data')
        app.globalData.userInfo = wx.getStorageSync('userInfo')
        console.log(app.globalData.user_data.address_show);
        this.setData({
            more_role: app.globalData.user_data.more_role,
            address_show: app.globalData.user_data.address_show,
            userinfo: app.globalData.userInfo,
            user_data: app.globalData.user_data
        })
        console.log(this.data);
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