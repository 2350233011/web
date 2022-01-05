// pages/yangzhihu/detail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        body_show: "",
        TopIndex: 6,
        order_info: [],
        group_info: [{
            id: 6,
            name: '待发货',
            power: true
        }, {
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
        this.getorderinfo(index, app.globalData.type[1].id)
        this.setData({
            TopIndex: index      /*定义当前数据的TopIndex等于  index 等于dataset.index*/
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

    //供货
    supply(e) {
        let that = this
        let id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index
        wx.showModal({
            title: '提示',
            content: '确定发货吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.config.baseURL + '/appapi/b2b/order/patch/state',
                        data: {
                            orderid: id,
                            oldState: that.data.order_info[index].state,
                            newState: 7,


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
                                        setTimeout(function () {
                                            //成功后的操作
                                            that.getorderinfo(6, app.globalData.type[1].id)

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

    onRefresh(e) {
        this.getorderinfo(this.data.TopIndex, app.globalData.type[1].id)
        setTimeout(() => {
            this.setData({
                triggered: false,
            })
        }, 1500)
    },

    //详情页面
    toOrderDetail(e) {
        let that = this, id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index
        wx.navigateTo({
            url: 'theorder_detail?id=' + id,
            success: function (res) {
                res.eventChannel.emit('acceptDataFromA', { data: that.data.order_info[index] })
            }
        })
    },

    //获取订单
    getorderinfo(index, type) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/order/gets',
            data: {
                buyerId: "",
                sellerId: app.globalData.user_data.sellerId,
                consigneeId: "",
                parent: "",
                shopId: "",
                type: type,
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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        wx.setNavigationBarTitle({
            title: '我的订单'
        });
        this.setData({
            states: app.globalData.states,
        })
        this.getorderinfo(6, app.globalData.type[1].id)


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