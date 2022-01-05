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
        codename: '获取验证码'
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
    // getCode: function () {
    //   var a = this.data.phone;
    //   var _this = this;
    //   var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    //   if (this.data.phone == "") {
    //     wx.showToast({
    //       title: '手机号不能为空',
    //       icon: 'none',
    //       duration: 1000
    //     })
    //     return false;
    //   } else if (!myreg.test(this.data.phone)) {
    //     wx.showToast({
    //       title: '请输入正确的手机号',
    //       icon: 'none',
    //       duration: 1000
    //     })
    //     return false;
    //   } else {
    //     wx.request({
    //       data: {},
    //       'url': 接口地址,
    //       success(res) {
    //         console.log(res.data.data)
    //         _this.setData({
    //           iscode: res.data.data
    //         })
    //         var num = 61;
    //         var timer = setInterval(function () {
    //           num--;
    //           if (num <= 0) {
    //             clearInterval(timer);
    //             _this.setData({
    //               codename: '重新发送',
    //               disabled: false
    //             })

    //           } else {
    //             _this.setData({
    //               codename: num + "s"
    //             })
    //           }
    //         }, 1000)
    //       }
    //     })

    //   }
    // },
    //获取验证码
    // getVerificationCode() {
    //   this.getCode();
    //   var _this = this
    //   _this.setData({
    //     disabled: true
    //   })
    // },

    //提交表单信息
    save: function () {
        let _this = this
        var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
        if (_this.data.phone == "" || _this.data.pass == "") {
            wx.showToast({
                title: '账号或密码不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        }else {
            _this.login();
        }
        // else if (!myreg.test(this.data.phone)) {
        //     wx.showToast({
        //         title: '请输入正确的手机号',
        //         icon: 'none',
        //         duration: 1000
        //     })
        //     return false;
        // }
        // if (this.data.code == "") {
        //   wx.showToast({
        //     title: '验证码不能为空',
        //     icon: 'none',
        //     duration: 1000
        //   })
        //   return false;
        // }
        // else if (this.data.code != this.data.iscode) {
        //   wx.showToast({
        //     title: '验证码错误',
        //     icon: 'none',
        //     duration: 1000
        //   })
        //   return false;
        // }
    },
    login: function (e) {
        let _this = this;
        wx.request({
            url: app.globalData.config.baseURL + '/login/api/web/login',
            data: {
                userName: _this.data.phone,
                password: _this.data.pass
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                let data = res.data;
                if (data.code == 1) {
                    app.globalData.user_code = data.data[0];
                    app.globalData.token = data.msg;
                    wx.setStorageSync('token', data.msg);
                    wx.setStorageSync('phone', _this.data.phone);
                    wx.setStorageSync('pass', _this.data.pass);
                    wx.showToast({
                        title: '登录成功',
                        icon: 'none',
                        duration: 1500,
                        success: function () {
                            setTimeout(function () {
                                wx.switchTab({
                                    url: '/pages/index/index',
                                })
                            }, 1500);
                        }
                    })
                } else if (data.code == -3) {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 4000,
                    })
                } else if (data.code == -1) {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 2000,
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this
        wx.setNavigationBarTitle({
            title: '登录'
        });

        if (wx.getStorageSync('token')) {
            wx.request({
                url: app.globalData.config.baseURL + '/webapi/loading/loading',
                data: {
                    token: wx.getStorageSync('token'),
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // 'token': app.globalData.token
                },
                success: function (res) {
                    let data = res.data.data.webUserInfo;
                    if (data) {
                        app.globalData.token = wx.getStorageSync('token')
                        app.globalData.user_code = data;
                        wx.showToast({
                            title: '登录成功',
                            icon: 'none',
                            duration: 1500,
                            success: function () {
                                setTimeout(function () {
                                    wx.switchTab({
                                        url: '/pages/index/index',
                                    })
                                }, 1500);
                            }
                        })
                    } else {
                        wx.showToast({
                            title: '登录失效请先登录',
                            icon: 'none',
                            duration: 1500,
                            success: function () {
                                setTimeout(function () {
                                    _this.setData({
                                        show: true
                                    })
                                }, 1500);
                            }
                        })
                    }
                }
            })
        } else {
            _this.setData({
                show: true
            })
        }



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