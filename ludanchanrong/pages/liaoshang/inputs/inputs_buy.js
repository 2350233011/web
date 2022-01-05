// pages/liaoshang/theorder/theorder_details.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods_info: [],//收货地址
        isdefault: [],//默认收货地址/当前选择的收货地址
        slave_info: [],//下属养殖户
        slave_checkbox: [],//选择的养殖户
        inputs_info: [],
        config: {
            pages: 1, //当前页面的分页数量
            pageIndex: 1, //当前分页

        }, //页面显示配置
        remind_error: false,//没有收货人时显示红色边框
        select_all: false,//是否全选
        slave_show: false,//下属是否为空
        isupload: true,//是否可以点击提交订单

    },

    /**
     * 公共函数
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

    //显示收货地址
    getgoods(e) {
        let that = this
        that.setData({
            remind_error: false
        })
        that.showModal(e)
    },

    //获取收货地址列表
    getGoodsInfo(e) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/test/get/address/list',
            data: {},
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
                    for (let i = 0; i < data.list.length; i++) {
                        if (data.list[i].isdefault == 1) {
                            that.setData({
                                isdefault: that.data.isdefault.concat(data.list[i])
                            })
                        }
                    }
                    that.setData({
                        goods_info: data.list
                    })
                } else if (data.code == 401) {
                    // app.error_showToast()
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 1000,
                        mark: true
                    })
                }
            }
        })
    },

    //获取下属列表
    getSlaveInfo(e) {
        let that = this
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
                console.log(res);
                let data = res.data

                if (data.code == 1) {
                    that.setData({
                        // isdefault: that.data.isdefault.concat(data.list[0]),
                        slave_info: data.list
                    })
                } else if (data.code == 401) {
                    // app.error_showToast()
                } else {
                    that.setData({
                        slave_show: true
                    })
                }
            }
        })
    },

    //选择收货地址
    // update_goods(e) {
    //     let index = e.currentTarget.dataset.index
    //     this.setData({
    //         isdefault: this.data.isdefault.concat(this.data.slave_info[index])
    //     })
    //     this.hideModal(e)
    // },
    checkboxChange(e) {
        let that = this, checkbox = e.detail.value
        this.data.slave_checkbox = checkbox
        if (this.data.slave_checkbox.length == this.data.slave_info.length) {
            that.setData({
                select_all: true,
            })
        } else {
            that.setData({
                select_all: false,
            })
        }
    },

    //全选与反全选
    selectall: function () {
        var that = this;
        for (let i = 0; i < that.data.slave_info.length; i++) {
            that.data.slave_info[i].checked = (!that.data.select_all)
        }
        that.setData({
            slave_info: that.data.slave_info,
            select_all: (!that.data.select_all),
        })
        if (that.data.select_all == true) {
            let slave = []
            for (let i = 0; i < that.data.slave_info.length; i++) {
                slave.push(i)
            }
            that.setData({
                slave_checkbox: slave
            })
        } else {
            that.setData({
                slave_checkbox: []
            })
        }
    },

    //寻找数组中指定key = value的对象的str元素值
    toFind(arr, key, value, str) {
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][key] == value) {
                    return arr[i][str]
                }
            }
        }
    },


    //添加收货
    addGoods(e) {
        let that = this, slave_checkbox = that.data.slave_checkbox
        let isdefault = []
        for (let i = 0; i < slave_checkbox.length; i++) {
            let list = that.data.slave_info[slave_checkbox[i]]
            isdefault = isdefault.concat(list)
        }
        that.setData({
            isdefault: isdefault
            // isdefault: that.data.isdefault.concat(isdefault)
        })
        this.hideModal(e)

    },

    //删除收货
    del_slace(e) {
        let that = this, index = e.currentTarget.dataset.index
        that.data.isdefault.splice(index, 1)
        that.setData({
            isdefault: that.data.isdefault
        })

    },

    //提交订单
    succeed(e) {
        let that = this
        let date = app.gettime("-")
        if (that.data.isdefault.length <= 0) {
            that.setData({
                remind_error: true
            })
            wx.showToast({
                title: "请先添加收货人",
                icon: 'none',
                duration: 1000,
                mark: true
            })
        } else {
            if (that.data.isupload) {
                for (let i = 0; i < that.data.isdefault.length; i++) {
                    let order = {}
                    order.skuId = that.data.inputs_info.skuDTOList[that.data.skudto_index].getSkuPriceResponse.skuId
                    order.shopId = that.data.inputs_info.shopDTO.shopId
                    order.itemId = that.data.inputs_info.itemId
                    order.sellerId = that.data.inputs_info.shopDTO.sellerId
                    order.sellerName = that.data.inputs_info.shopDTO.shopName
                    order.shopName = that.data.inputs_info.shopDTO.shopName
                    order.parent = "" //是否为子订单
                    order.type = app.globalData.type[1].id
                    order.itemName = that.data.inputs_info.itemName
                    order.itemPic = that.data.inputs_info.skuDTOList[that.data.skudto_index].picUrl
                    order.skuName = that.toFind(that.data.inputs_info.attributeDTOList[0].attributeValueDTOList, "valueId", that.data.attrValueId, "valueName")

                    order.buyerId = app.globalData.user_data.sid
                    order.buyerName = app.globalData.user_data.name

                    order.consigneeId = that.data.isdefault[i].sid
                    order.consigneeName = that.data.isdefault[i].name
                    order.consigneeAddress = that.data.isdefault[i].address
                    order.consigneeMobile = that.data.isdefault[i].code

                    order.quantity = that.data.inputs_num
                    order.actualQuantity = 0
                    order.weight = 0
                    order.actualWeight = 0
                    order.unitprice = that.data.inputs_quantity
                    order.actualUnitprice = 0

                    order.paymentMethod = ""
                    order.paymentVoucher = ""
                    order.actualTotalPrice = 0


                    order.state = 6



                    wx.showLoading({
                        title: '加载中',
                        mask: true
                    })
                    that.setData({
                        isupload: false
                    })
                    if (i == that.data.isdefault.length - 1) {
                        that.upload(order, true)
                    } else {
                        that.upload(order, false)
                    }
                }
            }
        }
    },

    upload(order, end) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/order/submit/mobile',
            data: order,
            method: 'POST',
            dataType: 'json',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                if (res.data.code == 1) {
                    if (end == true) {
                        wx.hideLoading()
                        wx.showToast({
                            title: '下单成功',
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
                        title: '下单失败',
                        icon: 'none',
                        duration: 1000,
                        mark: true,
                    })
                    that.setData({
                        isupload: true
                    })
                }
            }
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '确认订单'
        });
        let that = this, eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromB', { data: 'BBBB' });
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromA', function (data) {
            that.setData({
                date: data.data.date,
                inputs_quantity: data.data.inputs_quantity,
                inputs_num: data.data.inputs_num,
                input_allnum: data.data.input_allnum,
                input_weight: data.data.input_weight,
                inputs_info: data.data.inputs_info,
                itemId: data.data.itemId,
                skuId: data.data.skuId,
                skudto_index: data.data.skudto_index,
                attrValueId: data.data.attrValueId
            })
        }, function (e) {
            // data.data.exam_details.id
        })

        that.getSlaveInfo()
        console.log(that.data)
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
