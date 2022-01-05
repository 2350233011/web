// pages/liaoshang/theorder/theorder_details.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_info: [],
        goods_info: [],
        isdefault: [],//默认收货地址/当前选择的收货地址
        config: {
            pages: 1, //当前页面的分页数量
            pageIndex: 1, //当前分页

        }, //页面显示配置

        select_all: false,//是否全选
        slave_show: false,//下属是否为空

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



    //获取订单详情
    getOrderInfo(id) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/order/gets',
            data: {
                orderId: id,
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
                    that.setData({
                        order_info: data.list[0],
                        isdefault: data.list[0].addressInfoDTO
                    })
                } else if (data.code == 401) {
                    // app.error_showToast()
                } else {

                }


                // var data = JSON.parse(res.data)
                // console.log(data)
                // var inputs = data.listRecord
                // for (let i = 0; i < inputs.length; i++) {
                //     inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                // }
                // let pages = "config.pages"
                // let pageNum = Math.ceil(data.num / app.globalData.config.PageSize)
                // console.log(pageNum);
                // that.setData({
                //     [pages]: pageNum,
                //     inputs_info: inputs
                // })

            }
        })
    },

    // //添加收货地址
    // addGoods(e) {
    //     let that = this, index = e.currentTarget.dataset.index, data = []
    //     if (index > -1) {
    //         data = JSON.stringify(that.data.goods_info[index])
    //         wx.navigateTo({
    //             url: 'goods_add?data=' + data
    //         })
    //     } else {
    //         wx.chooseAddress({
    //             success: function (res) {
    //                 console.log(res)
    //                 var usemessage = res;
    //                 that.setData({
    //                     usemessage: usemessage
    //                 })
    //                 wx.request({
    //                     url: app.globalData.config.baseURL + '/appapi/b2b/test/save/addr',
    //                     data: {
    //                         platformid: 2,
    //                         address: usemessage.provinceName + usemessage.cityName + usemessage.countyName,
    //                         fulladdress: usemessage.provinceName + usemessage.cityName + usemessage.countyName + usemessage.detailInfo,
    //                         contactperson: usemessage.userName,
    //                         contactphone: usemessage.telNumber
    //                     },
    //                     method: 'POST',
    //                     header: {
    //                         'Content-Type': 'application/x-www-form-urlencoded',
    //                           'openid': app.globalData.wx_config.openid,
    //                         'authorities': app.globalData.token
    //                     },
    //                     success: function (res) {
    //                         console.log(res);
    //                         if (res.data.code == 1) {
    //                             wx.showToast({
    //                                 title: res.data.msg,
    //                                 icon: 'none',
    //                                 duration: 1500,
    //                             })
    //                         }

    //                     }
    //                 })
    //             }
    //         })

    //     }




    // },

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

    //显示收货地址
    getgoods(e) {
        let that = this
        that.setData({
            remind_error: false
        })
        that.showModal(e)
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
    update_goods(e){
        let that = this, index=e.currentTarget.dataset.index
        that.setData({
            isdefault:that.data.slave_info[index]
        })
        that.hideModal(e)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '订单详情'
        });
        let that = this, id = options.id
        let eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromB', { data: 'BBBB' });
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromA', function (data) {
            that.setData({
                order_info:data.data
            })
        })
        console.log(that.data)
        this.getSlaveInfo()
        // this.getOrderInfo(id)

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