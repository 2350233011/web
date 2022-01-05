// pages/user/user_change.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sexshow: null,
        goodsShow: false,
        goods_info: [],
        usemessage: [],//新增的收货地址
        title: "",
        placeholder: "",
        textareaBValue: "",
        currentWordNumber: "",
        index: 1,
        picker: ['女', '男'],
        min: 2,//最少字数
        max: 20, //最多字数

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

    addGoods(e) {
        let that = this, index = e.currentTarget.dataset.index, data = []
        if (index > -1) {
            data = JSON.stringify(that.data.goods_info[index])
            wx.navigateTo({
                url: 'goods_add?data=' + data
            })
        } else {
            wx.chooseAddress({
                success: function (res) {
                    console.log(res)
                    var usemessage = res;
                    that.setData({
                        usemessage: usemessage
                    })
                    wx.request({
                        url: app.globalData.config.baseURL + '/appapi/b2b/test/save/addr',
                        data: {
                            platformid: 2,
                            address: usemessage.provinceName + usemessage.cityName + usemessage.countyName,
                            fulladdress: usemessage.provinceName + usemessage.cityName + usemessage.countyName + usemessage.detailInfo,
                            contactperson: usemessage.userName,
                            contactphone: usemessage.telNumber
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
                                })
                            }

                        }
                    })
                }
            })

        }




    },

    delGoods(e) {
        let id = e.currentTarget.dataset.id
        wx.showModal({
            title: '提示',
            content: '确定要删除此地址吗',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.config.baseURL + '/appapi/b2b/test/del/addr',
                        data: {
                            userAddressId: id
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


    radioChange: function (e) {
        var that = this;
        console.log(e);

    },

    textareaBInput(e) {
        // 获取输入框的内容
        var value = e.detail.value;
        // 获取输入框内容的长度
        var len = parseInt(value.length);
        //最少字数限制
        if (len <= this.data.min) {

        } else if (len > this.data.min) {

        }
        //最多字数限制
        if (len > this.data.max) {
            return;// 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
        }
        this.setData({
            currentWordNumber: len //当前字数
        });
        this.setData({
            textareaBValue: e.detail.value
        })
    },
    PickerChange(e) {
        this.setData({
            index: e.detail.value
        })
    },

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

    updateIsdefault(e) {

    },







    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '我的收货地址'
        });
        let that = this, type = options.type, data = options.data;
        console.log(type);
        switch (type) {
            case "nicheng":
                that.setData({
                    sexshow: false,
                    title: "昵称:",
                    placeholder: data,
                })
                break;
            case "qianming":
                that.setData({
                    sexshow: false,
                    title: "签名:",
                    placeholder: data,
                })
                break;
            case "xingbie":
                that.setData({
                    sexshow: true,
                    title: "性别",
                    index: data,
                })
                break;
            case "goods":
                that.getGoodsInfo()
                that.setData({
                    goodsShow: true,
                })
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