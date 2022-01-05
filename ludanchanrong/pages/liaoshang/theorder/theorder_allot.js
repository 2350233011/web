// pages/theorder/theorder_allot.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        picker_array: [],
        slave_info: [],
        slave_checkbox: [],
        order_info: [],
        numbers: [],
        numberPrice: [],
        number: 0,
        allNumber: 0,
        surplusnum: 0,
        isupload: true,//是否可以点击提交订单


    },

    /**
     * 公共函数
     */
    PickerChange(e) {
        let i = e.currentTarget.dataset.index;
        let index = "picker_array[" + i + "].index"
        this.setData({
            [index]: e.detail.value,
        })
        console.log(this.data.picker_array);
    },

    checkboxChange(e) {
        let checkbox = e.detail.value
        this.data.slave_checkbox = checkbox
        console.log('value值为：', checkbox)
    },

    getNumber(e) {
        let that = this, value = e.detail.value, index = e.currentTarget.dataset.index, num = Number(value), sum = 0
        that.data.numbers[index] = num
        for (var i = 0; i < that.data.numbers.length; i++) {
            sum += that.data.numbers[i]
        }
        sum = sum - num
        that.setData({
            number: sum,
            surplusnum: that.data.allNumber - sum
        })
        let surplusnum = that.data.allNumber - sum
        if (num > surplusnum) {
            wx.showToast({
                title: '数量最高为' + surplusnum,
                icon: 'success',
                duration: 1000
            })
            return value.replace(num, surplusnum)
        }
    },

    getSurplusNumber(e) {
        let that = this, value = e.detail.value, index = e.currentTarget.dataset.index, num = Number(value), sum = 0;
        that.data.numbers[index] = num
        for (var i = 0; i < that.data.numbers.length; i++) {
            sum += that.data.numbers[i];
        }
        that.setData({
            number: sum,
            surplusnum: that.data.allNumber - sum
        })
        console.log(that.data);
    },

    getSurplusPrice(e) {
        let that = this, value = e.detail.value, index = e.currentTarget.dataset.index, num = Number(value), sum = 0;
        that.data.numberPrice[index] = num
        for (var i = 0; i < that.data.numberPrice.length; i++) {
            sum += that.data.numberPrice[i];
        }
        console.log(that.data);
    },

    //提交订单
    confirm_allot: function (e) {
        let that = this, order = {}, b2bOrders = []
        if (that.data.slave_checkbox.length > 0) {
            if (that.data.surplusnum == 0) {
                for (let i = 0; i < that.data.slave_checkbox.length; i++) {
                    let b2bOrder = {}

                    b2bOrder.sid = that.data.slave_info[that.data.slave_checkbox[i]].sid
                    b2bOrder.name = that.data.slave_info[that.data.slave_checkbox[i]].name

                    b2bOrder.quantity = that.data.numbers[that.data.slave_checkbox[i]]
                    // b2bOrder.quantity = "30"
                    b2bOrder.unitprice = that.data.numberPrice[that.data.slave_checkbox[i]]

                    b2bOrders = b2bOrders.concat(b2bOrder)
                }
                order.targets = JSON.stringify(b2bOrders)
                order.orderId = that.data.order_info.id
                order.unityuserid = app.globalData.user_data.sid
                order.unityusername = app.globalData.user_data.name
                console.log(order);
                wx.showLoading({
                    title: '加载中',
                    mask: true
                })
                that.setData({
                    isupload: false
                })

                that.upload(order, true)



            } else {
                wx.showToast({
                    title: "尚未分配完成",
                    icon: 'none',
                    duration: 1000,
                    mark: true
                })
            }
        } else {
            wx.showToast({
                title: "请选择养殖户",
                icon: 'none',
                duration: 1000,
                mark: true
            })
        }

    },
    upload(order, end) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/order/submit/mobiles',
            data: order,
            method: 'POST',
            dataType: 'json',
            header: {
                // 'Content-Type': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                if (res.data.code == 1) {
                    if (end == true) {
                        that.receive(that.data.order_info.id, that.data.order_info.state, 6)
                        wx.hideLoading()
                        wx.showToast({
                            title: '分单成功',
                            icon: 'none',
                            duration: 1000,
                            mark: true,
                            complete: setTimeout(function () {
                                that.setData({
                                    isupload: true
                                })
                                wx.switchTab({
                                    url: '/pages/liaoshang/liaoshang'
                                })
                            }, 1000)
                        })
                    }
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: '分单失败',
                        icon: 'none',
                        duration: 1000,
                        mark: true,
                    })
                }
            },
            fail: function (res) {
                wx.hideLoading()
                wx.showToast({
                    title: '分单失败',
                    icon: 'none',
                    duration: 1000,
                    mark: true,
                })
            }

        })
    },

    //更改状态
    receive: function (id, oldstate, newstate) {
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
        wx.setNavigationBarTitle({
            title: '分配养殖户'
        });
        let that = this, order = JSON.parse(options.data), allNumber = 0, picker = []
        console.log(order);
        //获取下属
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/get/slave',
            data: {
                master: app.globalData.user_data.id,
                masterType: app.globalData.user_data.type
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
                    // for (let i = 0; i < order.itemInfoDTOS.length; i++) {
                    //     allNumber += order.itemInfoDTOS[i].number
                    //     picker.push(order.itemInfoDTOS[i].itemName)
                    // }
                    let pickers = {}
                    for (let i = 0; i < data.list.length; i++) {
                        pickers.index = 0
                        pickers.picker = picker
                        that.data.numbers.push(0)
                        that.data.picker_array = that.data.picker_array.concat(pickers)
                    }
                    allNumber = order.quantity
                    that.setData({
                        order_info: order,
                        allNumber: allNumber,
                        surplusnum: allNumber,
                        slave_info: data.list,
                        picker_array: that.data.picker_array
                    })
                } else if (data.code == 401) {
                    // app.error_showToast()
                } else {

                }
            }
        })

        console.log(that.data);
        console.log(app.globalData.user_data);
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