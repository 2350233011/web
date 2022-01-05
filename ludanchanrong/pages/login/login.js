const BaseJs = require('../../static/project/base.js')
let plugin = requirePlugin('shargoodata')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pw_show: false,
        invite_show: false,
        showView: true,
        code_time: 60,
        but_val: "",
        but_show: true,
        show: false,
        phone: "",
        invite: "",
        code: "",

    },


    /**
     * 公共函数
     *
     */
    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },

    //已阅读并同意
    radioChange: function (e) {
        var that = this;
        that.setData({
            showView: !that.data.showView
        })
        console.log(that.data.showView);
    },

    //显示用户协议
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
    getinviteValue: function (e) {
        this.setData({
            invite: e.detail.value
        })
    },
    getCodeValue: function (e) {
        this.setData({
            code: e.detail.value
        })
    },

    // 其他登录
    //
    // pw_login(e) {
    //     this.setData({
    //         pw_show: true
    //     })
    // },
    // code_login(e) {
    //     this.setData({
    //         pw_show: false
    //     })
    // },
    // face_login(e) {
    //     this.verify()
    // },
    //人脸登录
    // verify(e) {
    //     let that = this
    //     //获取 access_token
    //     let option = {
    //         url: BaseJs.getTokenUrl(),
    //         method: 'POST',
    //         data: {
    //             platformNo: BaseJs.getPlatformNo(),
    //             secretKey: BaseJs.getSecretKey()
    //         }
    //     }
    //     BaseJs.ajaxRequest(option, resJson => {
    //         plugin.ocrStart({
    //             platformNo: BaseJs.getPlatformNo(),
    //             token: resJson.data,
    //             // urlType: 'tabBar', // 如果是跳转到tabBar页面，需填写此项，普通页面不需要填
    //             url: '/pages/result/index',
    //             extraInfo: {
    //                 isShowCamera: true
    //             },
    //             success: (res) => {
    //                 BaseJs.globalData.successInfo.data = JSON.parse(res)
    //             }
    //         })
    //         wx.navigateTo({
    //             url: 'plugin-private://' + BaseJs.getAppid() + '/pages/face/index'
    //         })

    //     })
    // },

    //获取验证码

    getcode(e) {
        let that = this, time = this.data.code_time
        console.log(app.globalData.wx_config.openid);
        if (that.data.phone == "") {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        } else {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/user/getVerificationCode',
                data: {
                    code: that.data.phone,
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'openid': app.globalData.wx_config.openid
                },
                success: function (res) {
                    let data = res.data
                    if (data.code == 1) {
                        that.setData({
                            but_val: time,
                            but_show: false
                        })
                        let timeClock = setInterval(function () {
                            time--;
                            that.setData({
                                but_val: time
                            })
                            if (time == 0) {
                                clearInterval(timeClock);
                                that.setData({
                                    but_show: true
                                })
                            }
                        }, 1000)

                    } else {
                        wx.showToast({
                            title: data.msg,
                            icon: 'none',
                            duration: 1500,
                            success: function () {

                            }
                        })
                    }

                }
            })
        }

    },

    //登录
    the_login(e) {
        let that = this
        if (that.data.showView) {
            console.log(app.globalData.wx_config.openid, that.data.phone, that.data.code);
            if (that.data.phone == "" || that.data.code == "") {
                wx.showToast({
                    title: '手机号或验证码不能为空',
                    icon: 'none',
                    duration: 1000
                })
                return false;
            } else {
                if (!wx.getStorageSync('userInfo')) {
                    if (wx.getUserProfile) {
                        wx.getUserProfile({
                            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                            success: (res) => {
                                app.globalData.userInfo = res.userInfo
                                wx.setStorageSync('userInfo', res.userInfo)
                                //后台登录
                                that.login_request()
                            },
                            fail: res => {
                                //拒绝授权
                                wx.showToast({
                                    title: '您拒绝了授权',
                                    icon: 'none'
                                })
                                return;
                            }
                        })
                    } else {
                        wx.getUserInfo({
                            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                            success: (res) => {
                                app.globalData.userInfo = res.userInfo
                                wx.setStorageSync('userInfo', res.userInfo)
                                //后台登录
                                that.login_request()
                            },
                            fail: res => {
                                //拒绝授权
                                wx.showToast({
                                    title: '您拒绝了授权',
                                    icon: 'none'
                                })
                                return;
                            }
                        })
                    }




                } else {
                    that.login_request()
                }
            }
        } else {
            wx.showToast({
                title: "请先阅读并勾选",
                icon: 'none',
                duration: 1500,
                success: function () {

                }
            })
        }


    },
    login_request() {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/user/login',
            data: {
                code: that.data.phone,
                verificationCode: that.data.code
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'openid': app.globalData.wx_config.openid,
            },
            success: function (res) {
                console.log(res);
                let data = res.data
                if (data.code == 1) {
                    data.data.more_role = false
                    data.data.address_show = false
                    app.globalData.token = data.msg
                    app.globalData.user_data = data.data
                    app.globalData.userInfo = wx.getStorageSync('userInfo')
                    wx.setStorageSync('token', data.msg)
                    // wx.setStorageSync('user_data', data.data)
                    if (data.data.state == 9) {
                        let rules_all = []
                        let rules = data.data.rules.split(',');
                        for (let i = 0; i < rules.length; i++) {
                            let rule = rules[i]
                            if (rule == "liaoshang" || rule == "yangzhihu" || rule == "tourupinshang") {
                                rules_all.push(rule)
                            }
                        }
                        if (rules_all.length > 1) {
                            data.data.more_role = true
                            app.globalData.user_data = data.data
                            wx.setStorageSync('user_data', data.data)
                            wx.navigateTo({
                                url: '/pages/login/identity'
                            })
                        } else if (rules_all.length == 1) {
                            if (rules_all[0] == "yangzhihu") {
                                app.globalData.user_data.address_show = true
                                wx.setStorageSync('user_data', app.globalData.user_data)
                            } else {
                                app.globalData.user_data.address_show = false
                                wx.setStorageSync('user_data', app.globalData.user_data)
                            }
                            wx.switchTab({
                                url: '/pages/' + rules_all[0] + '/' + rules_all[0]
                            })
                        } else {
                            wx.showToast({
                                title: '没有身份信息，请联系工作人员',
                                icon: 'none',
                                duration: 1500,
                                success: function () {

                                }
                            })
                        }
                    } else if (data.data.state == 6) {
                        wx.showToast({
                            title: '未激活，请先激活',
                            icon: 'none',
                            duration: 1500,
                            success: function () {
                                setTimeout(function () {
                                    that.setData({
                                        code: "",
                                        invite_show: true,
                                    })
                                }, 1500);
                            }
                        })
                    } else if (data.data.state == 2 || data.data.state == 3 || data.data.state == 5) {
                        wx.showToast({
                            title: data.msg,
                            icon: 'none',
                            duration: 1500,
                            success: function () {

                            }
                        })
                    }

                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 1500,
                        success: function () {

                        }
                    })
                }
            }
        })
    },
    //激活
    the_logon(e) {
        let that = this;
        console.log(that.data.phone, that.data.invite);
        if (that.data.phone == "" || that.data.invite == "") {
            wx.showToast({
                title: '手机号或邀请码不能为空',
                icon: 'none',
                duration: 1000
            })
            return false;
        } else {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/user/activate',
                data: {
                    code: that.data.phone,
                    invite: that.data.invite
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authorities': app.globalData.token,
                    'openid': app.globalData.wx_config.openid,
                },
                success: function (res) {
                    console.log(res);
                    if (res.data.code == 1) {
                        wx.navigateTo({
                            url: '/pages/login/message?type=' + that.data.phone,
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 1500,
                            success: function () {

                            }
                        })
                    }
                }
            })
        }



    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this

        wx.login({
            success: res => {
                let that = this
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: app.globalData.config.baseURL + '/appapi/wechat/getMiniprogramOpenId',
                    data: {
                        code: res.code
                    },
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    success: function (res) {
                        console.log(res);
                        let data = JSON.parse(res.data.data)
                        app.globalData.wx_config = data
                        wx.setStorageSync('wx_config', data)
                    }
                })
            }
        })

        //判断是否已经登录
        if (wx.getStorageSync('user_data') && wx.getStorageSync('user_data').state == 9) {
            app.globalData.token = wx.getStorageSync('token')
            app.globalData.user_data = wx.getStorageSync('user_data')
            app.globalData.wx_config = wx.getStorageSync('wx_config')
            app.globalData.userInfo = wx.getStorageSync('userInfo')
            //料商显示收货地址
            app.globalData.user_data.address_show = false
            // that.verify()
            let data = wx.getStorageSync('user_data'), rules_all = []

            if (data.isStates) {
                if (data.isStates == "yangzhihu") {
                    app.globalData.user_data.address_show = true
                    wx.setStorageSync('user_data', app.globalData.user_data)
                } else {
                    app.globalData.user_data.address_show = false
                    wx.setStorageSync('user_data', app.globalData.user_data)
                }
                wx.switchTab({
                    url: '/pages/' + data.isStates + '/' + data.isStates
                })

            } else {
                let rules = data.rules.split(',');
                for (let i = 0; i < rules.length; i++) {
                    let rule = rules[i]
                    if (rule == "liaoshang" || rule == "yangzhihu" || rule == "tourupinshang") {
                        rules_all.push(rule)
                    }
                }
                if (rules_all.length > 1) {
                    data.more_role = true
                    app.globalData.user_data = data
                    wx.setStorageSync('user_data', data)
                    wx.navigateTo({
                        url: '/pages/login/identity'
                    })
                } else if (rules_all.length == 1) {
                    if (rules_all[0] == "yangzhihu") {
                        app.globalData.user_data.address_show = true
                        wx.setStorageSync('user_data', app.globalData.user_data)
                    } else {
                        app.globalData.user_data.address_show = false
                        wx.setStorageSync('user_data', app.globalData.user_data)
                    }
                    wx.switchTab({
                        url: '/pages/' + rules_all[0] + '/' + rules_all[0]
                    })
                }
            }



            // that.setData({
            //     show: true
            // })
        } else {
            that.setData({
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