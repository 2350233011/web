// pages/theorder/theorder.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        TopIndex: 1,
        date: "", //时间
        order_info: [],
        //订单状态
        group_info: [{
            id: 1,
            name: '待接单',
            power: true
        }, {
            id: 5,
            name: '待分配',
            power: true
        }, {
            id: 6,
            name: '进行中',
            power: true
        }, {
            id: 7,
            name: '送货中',
            power: true
        }, {
            id: 8,
            name: '已收货',
            power: false
        }, {
            id: 9,
            name: '已完成',
            power: true
        }, {
            id: 10,
            name: '已付款',
            power: false
        }, {
            id: 2,
            name: '已取消',
            power: false
        }, {
            id: 3,
            name: '已删除',
            power: false
        }],
        config: {
            orderid: "",
            pages: 1, //当前页面的分页数量
            pageIndex: 1, //当前分页
            total: 0

        }, //页面显示配置
        states: [],


        number: "",
        weight: "",
        price: "",
    },

    /**
     * 公共函数
     */
    //点击切换页面
    changstyle: function (e) {
        let index = e.currentTarget.dataset.index; /*定义index等于当前页面的dataset.index*/
        this.getorderinfo(index)
        this.setData({
            TopIndex: index /*定义当前数据的TopIndex等于  index 等于dataset.index*/
        })
    },

    onRefresh() {
        this.getorderinfo(this.data.TopIndex)
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

    subordinate(e) {
        let that = this, index = e.currentTarget.dataset.index
        let subordinate = "order_info[" + index + "].subordinate"
        console.log(that.data.order_info[index].subordinate);
        if (that.data.order_info[index].subordinate == true) {
            that.setData({
                [subordinate]: false
            })
        } else {
            that.setData({
                [subordinate]: true
            })
        }
        console.log(that.data);

    },

    getNumber(e) {
        let value = e.detail.value
        this.setData({
            number: value
        })
    },
    getWeight(e) {
        let value = e.detail.value
        this.setData({
            weight: value
        })
    },
    getPrice(e) {
        let value = e.detail.value
        this.setData({
            price: value
        })
    },

    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },

    hideModal(e) {
        this.setData({
            price: "",
            weight: "",
            number: "",
            old_number: "",
            modalName: null,
        })
    },

    //时间
    DateChange(e) {
        this.setData({
            date: e.detail.value
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
                        url: app.globalData.config.baseURL + '/appapi/b2b/update/shop/order1/by',
                        data: {
                            orderid1: id,
                            orderid2: "",
                            oldState: that.data.order_info[index].state,
                            newState: that.data.group_info[7].id,
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
                                            that.getorderinfo(that.data.group_info[0].id)
                                            that.setData({
                                                TopIndex: that.data.group_info[0].id
                                            })
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

    //接收订单
    receive1: function (e) {
        let that = this
        let id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index
        wx.showModal({
            title: '提示',
            content: '确定接收订单吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.config.baseURL + '/appapi/b2b/update/shop/order1/by',
                        data: {
                            orderid1: id,
                            orderid2: "",
                            oldState: that.data.order_info[index].state,
                            newState: that.data.group_info[1].id,
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
                                    title: "接收成功",
                                    icon: 'none',
                                    duration: 1000,
                                    mark: true,
                                    success: function () {
                                        setTimeout(function () {
                                            that.getorderinfo(that.data.group_info[1].id)
                                            that.setData({
                                                TopIndex: that.data.group_info[1].id
                                            })
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

    //分配订单页面
    theorder_allot: function (e) {
        let index = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '/pages/liaoshang/theorder/theorder_allot?data=' + JSON.stringify(this.data.order_info[index])
        })
    },

    //收货/发货
    the_goods: function (e) {
        this.data.config.orderid = e.currentTarget.dataset.id
        this.data.config.index = e.currentTarget.dataset.index
        this.data.config.indexs = e.currentTarget.dataset.indexs
        this.data.order_type = e.currentTarget.dataset.type
        let that = this,
            index = this.data.config.index,
            indexs = this.data.config.indexs
        if (e.currentTarget.dataset.type == "fahuo") {
            wx.showModal({
                title: '提示',
                content: '确定发货吗',
                success(res) {
                    if (res.confirm) {
                        wx.request({
                            url: app.globalData.config.baseURL + '/appapi/b2b/update/shop/order1/by',
                            data: {
                                orderid1: that.data.config.orderid,
                                orderid2: "",
                                oldState: that.data.order_info[index].state,
                                newState: 7,
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
                                        title: "发货成功",
                                        icon: 'none',
                                        duration: 1000,
                                        mark: true,
                                        success: function () {
                                            setTimeout(() => {
                                                that.getorderinfo(that.data.group_info[3].id)
                                                that.setData({
                                                    TopIndex: that.data.group_info[3].id
                                                })
                                                that.hideModal(e)

                                            }, 1500);
                                        }
                                    })

                                } else if (data.code == 401) {
                                    // app.error_showToast()
                                } else {
                                    // wx.showToast({
                                    //     title: data.msg,
                                    //     icon: 'none',
                                    //     duration: 1000,
                                    //     mark: true
                                    // })
                                }

                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        } else {
            this.showModal(e)
            this.setData({
                old_number: this.data.order_info[e.currentTarget.dataset.index].b2BOrderList[e.currentTarget.dataset.indexs].quantity,
                price:this.data.order_info[e.currentTarget.dataset.index].b2BOrderList[e.currentTarget.dataset.indexs].unitprice
            })
        }

    },
    //确认收货/发货
    deliver_goods: function (e) {
        let that = this,
            number = this.data.number,
            weight = this.data.weight,
            price = this.data.price,
            index = this.data.config.index,
            indexs = this.data.config.indexs

        if (number == "") {
            wx.showToast({
                title: "请先填写数量",
                icon: 'none',
                duration: 1000,
                mark: true,
            })
            return
        }
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/update/shop/order1/by',
            data: {
                orderid1: "",
                orderid2: that.data.config.orderid,
                oldState: that.data.order_info[index].b2BOrderList[indexs].state,
                newState: 8,
                actualQuantity: number,
                actualWeight: weight,
                actualUnitprice: price,
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
                            setTimeout(() => {
                                that.getorderinfo(that.data.group_info[2].id)
                                that.setData({
                                    TopIndex: that.data.group_info[2].id
                                })
                                that.hideModal(e)
                            }, 1500);
                        }
                    })

                } else if (data.code == 401) {
                    // app.error_showToast()
                } else {
                    wx.showToast({
                        title: "收货失败",
                        icon: 'none',
                        duration: 1000,
                        mark: true
                    })
                }

            }
        })
        // if (this.data.order_type == "fahuo") {


        // } else {

        // }



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
                        url: app.globalData.config.baseURL + '/appapi/b2b/update/shop/order1/by',
                        data: {
                            orderid1: id,
                            orderid2: "",
                            oldState: that.data.order_info[index].state,
                            newState: that.data.group_info[5].id,
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
                                            that.getorderinfo(that.data.group_info[5].id)
                                            that.setData({
                                                TopIndex: that.data.group_info[5].id
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

    //详情页面
    toOrderDetail(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: 'theorder_details?id=' + id
        })
    },

    //明细页面
    to_theorder_detail: function (e) {
        // wx.navigateTo({
        //     url: '/pages/liaoshang/theorder/theorder_detail?id=' + e.currentTarget.dataset.orderid
        // })
    },

    //获取订单列表
    getorderinfo(index) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/order/gets',
            data: {
                // buyerId: "",
                sellerId: app.globalData.user_data.sid,
                // parent: "",
                // shopId: "",
                type: app.globalData.type[0].id,
                state: index,
                // source:"unityuser",

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
                for (let i = 0; i < data.list.length; i++) {
                    data.list[i].allunitprice = app.accMul(data.list[i].unitprice, data.list[i].quantity)
                    data.list[i].subordinate = true
                    for (let j = 0; j < data.list[i].b2BOrderList.length; j++) {
                        data.list[i].b2BOrderList[j].allunitprice = app.accMul(data.list[i].b2BOrderList[j].unitprice, data.list[i].b2BOrderList[j].quantity)
                        data.list[i].allactualQuantity = app.accMul(data.list[i].actualQuantity, data.list[i].actualUnitprice)
                    }
                }
                if (data.code == 1) {
                    if (index == 7) {
                        that.getorderinfo(that.data.group_info[4].id)
                        that.setData({
                            order_info: data.list
                        })
                    } else if (index == 8) {
                        that.setData({
                            order_info: that.data.order_info.concat(data.list)
                        })
                    } else {
                        that.setData({
                            order_info: data.list
                        })
                    }
                } else if (data.code == 401) {
                    // app.error_showToast()
                } else {

                }
                console.log(that.data);
            }
        })

    },

    //更改状态
    receive(id, oldstate, newstate) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/update/shop/order1/by',
            data: {
                orderid1: id,
                orderid2: "",
                oldState: oldstate,
                newState: newstate,
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
                // if (data.code == 1) {


                // } else if (data.code == 401) {
                //     // app.error_showToast()
                // } else {

                // }

            }
        })

    },






    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let index = this.data.group_info[0].id
        let TopIndex = options.TopIndex ? options.TopIndex : index,
            date = app.gettime("-").slice(0, 10)
        wx.setNavigationBarTitle({
            title: '养殖订单'
        })
        this.setData({
            TopIndex: TopIndex,
            date: date,
            states: app.globalData.states
        })

        this.getorderinfo(this.data.group_info[0].id)


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