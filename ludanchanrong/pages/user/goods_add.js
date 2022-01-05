// pages/user/goods_add.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods_info: "",
        region: [],
        goodsName: "",
        goodsPhone: "",
        goodsFullAddress: "",
        goodsAddress: "",
    },

    RegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
        this.data.goodsAddress = this.data.region.toString().replace(/,/g, "")
    },

    getName: function (e) {
        this.setData({
            goodsName: e.detail.value
        })
    },

    getPhone: function (e) {
        this.setData({
            goodsPhone: e.detail.value
        })
    },

    getAddress: function (e) {
        this.setData({
            goodsFullAddress: e.detail.value
        })
    },




    save(e) {
        let that = this
        if (that.data.region.lenght == 0) {
            that.data.goodsAddress = that.data.goods_info.address
        }
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/test/modify/addr',
            data: {
                address: that.data.goodsAddress,
                fulladdress: that.data.goodsFullAddress,
                contactperson: that.data.goodsName,
                contactphone: that.data.goodsPhone
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                  'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                console.log(res);
                if (res.data.code == 1) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500,
                        success: function () {
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 1500);

                        }
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
            title: '添加收货地址'
        });
        let that = this, data = JSON.parse(options.data)
        console.log(data);
        if (data) {
            that.setData({
                goods_info: data,
                goodsName: data.contactperson,
                goodsPhone: data.contactphone,
                goodsAddress: data.address,
                goodsFullAddress: data.fulladdress

            })
        } else {

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