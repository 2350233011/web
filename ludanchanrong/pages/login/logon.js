// var app = require('../../utils/util.js');
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        phone: '',//手机号
        pass: '',//密码
        code: '',//验证码
        iscode: null,//用于存放验证码接口里获取到的code
        show: false,
        showView: false,
        codename: '获取验证码',

    },

    showModal(e) {
        this.setData({
            modalName: "DialogModal1"
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },

    theorder_allot(e) {
        this.showModal(e)
    },

    financing(e) {
        this.hideModal(e)
    },


    //获取input输入框的值
    getPhoneValue: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    getPassValue: function (e) {
        this.setData({
            pass: e.detail.value
        })
    },
    getCodeValue: function (e) {
        this.setData({
            code: e.detail.value
        })
    },

    radioChange: function (e) {
        var that = this;
        that.setData({
            showView: true
        })
    },

    //提交表单信息
    save: function () {
        let _this = this
        var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
        if (this.data.showView == false) {
            wx.showToast({
                title: '请先阅读并勾选',
                icon: 'none',
                duration: 1500
            });
            return false;
        } else {
            _this.login();
            // if (_this.data.phone == "" || _this.data.pass == "") {
            //     wx.showToast({
            //         title: '账号或密码不能为空',
            //         icon: 'none',
            //         duration: 1000
            //     })
            //     return false;
            // } else if (!myreg.test(this.data.phone)) {
            //     wx.showToast({
            //         title: '请输入正确的手机号',
            //         icon: 'none',
            //         duration: 1000
            //     })
            //     return false;
            // } else {
            //     _this.login();
            // }
        }
    },
    login: function (e) {
        let that = this;
        wx.navigateTo({
            url: '/pages/login/message?type='+that.data.phone,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this
        wx.setNavigationBarTitle({
            title: '注册'
        });
        _this.setData({
            show: true
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