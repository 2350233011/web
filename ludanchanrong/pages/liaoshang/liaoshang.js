// pages/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo: "",
        inputs_info: [],
        order_info: [],
        config: {
            pages: 1, //当前页面的分页数量
            pageIndex: 1, //当前分页
            total: 0

        }, //页面显示配置

        unread: [
            {
                num: 0,
                type: "养殖订单"
            },
            {
                num: 0,
                type: "投入品订单"
            }
        ],

        payTotal: "计算中"


    },


    /**
     * 公共函数
     */
    to_theorder_inputs: function (e) {
        wx.navigateTo({
            url: '/pages/liaoshang/theorder/theorder_input'
        })
    },
    to_breed: function (e) {
        wx.navigateTo({
            url: '/pages/liaoshang/theorder/theorder_breed'
        })
    },
    to_inputs: function (e) {
        wx.navigateTo({
            url: '/pages/liaoshang/inputs/inputs'
        })
    },
    to_user: function (e) {
        let _this = this;
        wx.navigateTo({
            url: '/pages/user/user',
        })
    },

    to_lines: function (e) {
        let that = this
        wx.navigateTo({
            url: '/pages/liaoshang/detail/detail'
        })
    },
    to_inputs_detail: function (e) {
        wx.navigateTo({
            url: '/pages/liaoshang/inputs/inputs_detail?skuId=' + e.currentTarget.dataset.skuid + '&itemId=' + e.currentTarget.dataset.itemid
        })
    },
    to_inputsall(e) {
        wx.navigateTo({
            url: '/pages/liaoshang/inputs_all'
        })
    },
    to_message(e) {
        let type = e.currentTarget.dataset.type
        wx.navigateTo({
            url: '/pages/message/message?type=' + type
        })
    },
    //详情页面
    toOrderDetail(e) {
        let that = this, id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index
        wx.navigateTo({
            url: 'theorder/theorder_details?id=' + id,
            success: function (res) {
                res.eventChannel.emit('acceptDataFromA', { data: that.data.order_info[index] })
            }
        })
    },

    //获取商品
    get_inputs(num) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/three/classifications',
            data: {
                shopId: "2000036254",
                type: 2,
                page: 1,
                pageSize: app.globalData.config.PageSize
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                var data = JSON.parse(res.data.data)
                var inputs = data.listRecord
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                }

                that.setData({
                    inputs_info: inputs.slice(0, num)
                })

            }
        })
    },

    //获取订单
    getorderinfo(index, type, num) {
        let that = this
        if (type == app.globalData.type[1].id) {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/b2b/order/gets',
                data: {
                    buyerId: app.globalData.user_data.sid,
                    // parent: 0,
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
                    let payTotal = 0
                    for (let i = 0; i < data.list.length; i++) {
                        data.list[i].allunitprice = app.accMul(data.list[i].unitprice, data.list[i].quantity)
                        payTotal += data.list[i].allunitprice
                    }
                    if (data.code == 1) {
                        let unread = "unread[1].num"
                        that.setData({
                            order_info: data.list.slice(0, num),
                            [unread]: data.list.length,
                        })
                        that.data.payTotal = payTotal
                        that.computingTime()
                    } else if (data.code == 401) {
                        // app.error_showToast()
                    } else {
                    }


                    console.log(that.data);

                }
            })
        } else if (type == app.globalData.type[0].id) {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/b2b/order/gets',
                data: {
                    sellerId: app.globalData.user_data.sid,
                    // parent: 0,
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
                    if (data.code == 1) {
                        let unread = "unread[0].num"
                        if (data.list.length >= 99) {
                            that.setData({
                                [unread]: "99+"
                            })
                        } else {
                            that.setData({
                                [unread]: data.list.length
                            })
                        }

                    } else if (data.code == 401) {
                        // app.error_showToast()
                    } else {

                    }


                    console.log(that.data);

                }
            })


        }
    },

    //计算投入品订单总数
    computingTime(e) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/order/gets',
            data: {
                buyerId: app.globalData.user_data.sid,
                // parent: 0,
                type: 2,
                state: 9,

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
                let payTotal = that.data.payTotal
                for (let i = 0; i < data.list.length; i++) {
                    payTotal += app.accMul(data.list[i].unitprice, data.list[i].quantity)
                }
                if (data.code == 1) {
                    that.setData({
                        payTotal: payTotal
                    })
                } else if (data.code == 401) {
                    // app.error_showToast()
                } else {
                }


                console.log(that.data);

            }
        })
    },




    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideTabBar() // 隐藏tabbar
        let that = this, userinfo = app.globalData.userInfo
        this.setData({
            userinfo: userinfo,
            states: app.globalData.states
        })
        that.get_inputs(3)
        that.getorderinfo(6, app.globalData.type[1].id, 3)
        that.getorderinfo(1, app.globalData.type[0].id)
        console.log(app.globalData)



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
        wx.showNavigationBarLoading();
        this.get_inputs(3)
        this.getorderinfo(6, app.globalData.type[1].id, 3)
        this.getorderinfo(1, app.globalData.type[0].id)
        setTimeout(function () {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        }, 1000);

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
        this.get_inputs(3)
        this.getorderinfo(6, app.globalData.type[1].id, 3)
        this.getorderinfo(1, app.globalData.type[0].id)
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