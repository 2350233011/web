const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        body_show: "",
        TopIndex: 1,
        order_info: [],
        group_info: [{
            id: 1,
            name: '待接单',
            power: true
        }, {
            id: 6,
            name: '进行中',
            power: true
        }, {
            id: 8,
            name: '已收货',
            power: true
        }, {
            id: 9,
            name: '已完成',
            power: true
        }],
        group_info2: [
        //     {
        //     id: 6,
        //     name: '待发货',
        //     power: true
        // },
        {
            id: 7,
            name: '送货中',
            power: true
        }, {
            id: 9,
            name: '已完成',
            power: true
        }],
        config: {
            orderid: "",
            pages: 1, //当前页面的分页数量
            pageIndex: 1, //当前分页
            total: 0

        }, //页面显示配置

    },
    //点击切换页面
    changstyle: function (e) {
        let index = e.currentTarget.dataset.index;           /*定义index等于当前页面的dataset.index*/
        this.getorderinfo(index, app.globalData.type[0].id)
        this.setData({
            TopIndex: index      /*定义当前数据的TopIndex等于  index 等于dataset.index*/
        })
    },
    //点击切换页面
    changstyle2: function (e) {
        let index = e.currentTarget.dataset.index;           /*定义index等于当前页面的dataset.index*/
        this.getorderinfo(index, app.globalData.type[1].id)
        this.setData({
            TopIndex: index      /*定义当前数据的TopIndex等于  index 等于dataset.index*/
        })
    },

    onRefresh(e) {
        let type = e.currentTarget.dataset.type
        if (type == "inputs") {
            this.getorderinfo(this.data.TopIndex, app.globalData.type[1].id)
        } else {
            this.getorderinfo(this.data.TopIndex, app.globalData.type[0].id)
        }
        setTimeout(() => {
            this.setData({
                triggered: false,
            })
        }, 1500)
    },

    // 获取滚动条当前位置
    scrolltoupper: function (e) {
        if (e.detail.scrollTop > 100) {
            this.setData({
                cangotop: true,
                scroll: e.detail.scrollTop
            });
        } else {
            this.setData({
                cangotop: false
            });
        }
    },

    //回到顶部
    goTop: function (e) { // 一键回到顶部
        app.goTop(this, 50)

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
                            oldState: that.data.order_info[index].state,
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
                                            this.getorderinfo(index, app.globalData.type[0].id)
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

    //确认订单
    receive2: function (e) {
        let that = this
        let id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index
        wx.showModal({
            title: '提示',
            content: '确定订单吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.config.baseURL + '/appapi/b2b/update/shop/order2/by',
                        data: {
                            orderid1: "",
                            orderid2: id,
                            oldState: that.data.order_info[index].state,
                            newState: that.data.group_info[3].id,
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
                                    title: "操作成功",
                                    icon: 'none',
                                    duration: 1000,
                                    mark: true,
                                    success: function () {
                                        setTimeout(function () {
                                            that.getorderinfo(that.data.group_info[3].id, app.globalData.type[0].id)
                                            that.setData({
                                                TopIndex: that.data.group_info[3].id
                                            })
                                        }, 1000)
                                    }
                                })
                            } else if (data.code == 401) {
                                // app.error_showToast()
                            } else {
                                wx.showToast({
                                    title: "操作失败",
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
                        TopIndex1: 1
                    })
                } else if (res.cancel) {
                }
            }
        })
    },
    supply(e) {
        let that = this
        wx.showModal({
            title: '提示',
            content: '确定供货了吗？',
            success(res) {
                if (res.confirm) {
                    that.setData({
                        TopIndex1: 2
                    })
                } else if (res.cancel) {
                }
            }
        })
    },
    the_goods(e) {
        let that = this
        wx.showModal({
            title: '提示',
            content: '确定收到货了吗？',
            success(res) {
                if (res.confirm) {
                    that.setData({
                        TopIndex2: 1
                    })
                } else if (res.cancel) {
                }
            }
        })
    },
    to_theorder_detail(e) {
        wx.navigateTo({
            url: '/pages/yangzhihu/theorder_detail'
        })
    },

    //获取订单列表
    getorderinfo(index, type) {
        let that = this
        if (type == app.globalData.type[1].id) {
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
                            order_info: data.list
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
                    for (let i = 0; i < data.list.length; i++) {
                        data.list[i].allunitprice = app.accMul(data.list[i].unitprice, data.list[i].quantity)
                    }
                    if (data.code == 1) {
                        that.setData({
                            order_info: data.list
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
        let type = options.type, that = this
        that.setData({
            states: app.globalData.states
        })
        switch (type) {
            case "theorder":
                wx.setNavigationBarTitle({
                    title: '我的订单'
                });
                that.setData({
                    body_show: 'theorder',
                    TopIndex: 1
                })
                that.getorderinfo(1, app.globalData.type[0].id)
                break;
            case "inputs":
                wx.setNavigationBarTitle({
                    title: '我的投入品'
                });
                that.setData({
                    body_show: 'inputs',
                    TopIndex: that.data.group_info2[0].id
                })
                that.getorderinfo(that.data.group_info2[0].id, app.globalData.type[1].id)
                break;
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