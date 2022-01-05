const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        button_theorder: 0,
        userinfo: "",
        order_info1: [],
        order_info2: [],
        config: {
            orderid: "",
            pages: 1, //当前页面的分页数量
            pageIndex: 1, //当前分页
            total: 0

        }, //页面显示配置
    },
    to_lines(e) {
        wx.navigateTo({
            url: '/pages/yangzhihu/books'
        })
    },
    to_user: function (e) {
        let _this = this;
        wx.navigateTo({
            url: '/pages/user/user',
        })
    },
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
    //接收订单
    theorder_allot(e) {
        let that = this
        let id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index
        console.log(index);
        wx.showModal({
            title: '提示',
            content: '确定接收订单吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.config.baseURL + '/appapi/b2b/update/shop/order2/by',
                        data: {
                            orderid2: id,
                            oldState: that.data.order_info1[index].state,
                            newState: 6,


                        },
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'openid': app.globalData.wx_config.openid,
                            'authorities': app.globalData.token
                        },
                        success: function (res) {
                            console.log(res);
                            let data = res.data
                            if (data.code == 1) {
                                wx.showToast({
                                    title: "接收成功",
                                    icon: 'none',
                                    duration: 1000,
                                    mark: true,
                                    success: function () {
                                        setTimeout(function () {
                                            that.getorderinfo(1, app.globalData.type[0].id)

                                        }, 1000)
                                    }
                                })

                            } else if (data.code == 401) {
                                // app.error_showToast()
                            } else {
                                wx.showToast({
                                    title: "接收失败",
                                    icon: 'none',
                                    duration: 1000,
                                    mark: true,
                                })
                            }

                        }
                    })

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    //取消订单
    cancel: function (e) {
        let that = this
        let id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index
        wx.showModal({
            title: '提示',
            content: '确定取消订单吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.config.baseURL + '/appapi/b2b/update/shop/order2/by',
                        data: {
                            orderid1: "",
                            orderid2: id,
                            oldState: that.data.order_info1[index].state,
                            newState: app.globalData.states[7].id,
                            actualQuantity: "",
                            actualWeight: "",
                            actualUnitprice: "",
                        },
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'openid': app.globalData.wx_config.openid,
                            'authorities': app.globalData.token
                        },
                        success: function (res) {
                            console.log(res);
                            let data = res.data
                            if (data.code == 1) {
                                wx.showToast({
                                    title: "取消成功",
                                    icon: 'none',
                                    duration: 1000,
                                    mark: true,
                                    success: function () {
                                        setTimeout(function () {
                                            that.getorderinfo(1, app.globalData.type[0].id)
                                        }, 1000)
                                    }
                                })

                            } else if (data.code == 401) {
                                // app.error_showToast()
                            } else {
                                wx.showToast({
                                    title: "接收失败",
                                    icon: 'none',
                                    duration: 1000,
                                    mark: true,
                                })
                            }

                        }
                    })



                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },

    financing(e) {
        let that = this
        wx.showModal({
            title: '提示',
            content: '确认融资吗？',
            success(res) {
                if (res.confirm) {
                    that.hideModal(e)
                    that.setData({
                        button_theorder: 1
                    })
                } else if (res.cancel) {
                }
            }
        })
    },

    //供货
    supply(e) {
        let that = this
        wx.showModal({
            title: '提示',
            content: '确定供货吗？',
            success(res) {
                if (res.confirm) {
                    that.setData({
                        theorder: false
                    })
                } else if (res.cancel) {
                }
            }
        })

    },

    //收货
    the_goods(e) {
        let that = this
        let id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index
        wx.showModal({
            title: '提示',
            content: '确定收到货了吗？',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.config.baseURL + '/appapi/b2b/order/patch/state',
                        data: {
                            orderid: id,
                            oldState: that.data.order_info2[index].state,
                            newState: 9,


                        },
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'openid': app.globalData.wx_config.openid,
                            'authorities': app.globalData.token
                        },
                        success: function (res) {
                            console.log(res);
                            let data = res.data
                            if (data.code == 1) {
                                wx.showToast({
                                    title: "收货成功",
                                    icon: 'none',
                                    duration: 1000,
                                    mark: true,
                                    success: function () {
                                        setTimeout(function () {
                                            //收货成功后的操作
                                            that.getorderinfo(7, app.globalData.type[1].id)

                                        }, 1000)
                                    }
                                })

                            } else if (data.code == 401) {
                                // app.error_showToast()
                            } else {
                                wx.showToast({
                                    title: "收货失败",
                                    icon: 'none',
                                    duration: 1000,
                                    mark: true,
                                })
                            }

                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    to_detail(e) {
        let type = e.currentTarget.dataset.type
        wx.navigateTo({
            url: '/pages/yangzhihu/detail?type=' + type
        })
    },

    to_message(e) {
        let type = e.currentTarget.dataset.type
        wx.navigateTo({
            url: '/pages/message/message?type=' + type
        })
    },


    //获取订单列表
    getorderinfo(index, type) {
        let that = this
        if (type == app.globalData.type[0].id) {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/b2b/order/gets',
                data: {
                    sellerId: app.globalData.user_data.sid,
                    type: type,
                    state: index,

                    pid: that.data.config.pageIndex - 1,
                    pcount: app.globalData.config.PageSize,
                    total: that.data.config.total
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'openid': app.globalData.wx_config.openid,
                    'authorities': app.globalData.token
                },
                success: function (res) {
                    let data = res.data
                    console.log(data);
                    if (data.code == 1) {
                        for (let i = 0; i < data.list.length; i++) {
                            data.list[i].allunitprice = app.accMul(data.list[i].unitprice, data.list[i].quantity)
                        }
                        that.setData({
                            order_info1: data.list
                        })

                    } else if (data.code == 401) {
                        // app.error_showToast()
                    } else {

                    }
                    console.log(that.data);

                }
            })

        } else {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/b2b/order/gets',
                data: {
                    consigneeId: app.globalData.user_data.sid,
                    type: type,
                    state: index,

                    pid: that.data.config.pageIndex - 1,
                    pcount: app.globalData.config.PageSize,
                    total: that.data.config.total
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'openid': app.globalData.wx_config.openid,
                    'authorities': app.globalData.token
                },
                success: function (res) {
                    let data = res.data
                    console.log(data);
                    for (let i = 0; i < data.list.length; i++) {
                        data.list[i].allunitprice = app.accMul(data.list[i].unitprice, data.list[i].quantity)
                    }
                    if (data.code == 1) {
                        that.setData({
                            order_info2: data.list
                        })
                    } else if (data.code == 401) {
                        // app.error_showToast()
                    } else {

                    }
                    console.log(that.data);

                }
            })
        }


    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideTabBar() // 隐藏tabbar
        let userinfo = app.globalData.userInfo
        this.setData({
            userinfo: userinfo,
            states: app.globalData.states
        })
        this.getorderinfo(1, app.globalData.type[0].id)
        this.getorderinfo(7, app.globalData.type[1].id)

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
        wx.showNavigationBarLoading();
        this.getorderinfo(1, app.globalData.type[0].id)
        this.getorderinfo(7, app.globalData.type[1].id)
        setTimeout(function () {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        }, 1000);

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