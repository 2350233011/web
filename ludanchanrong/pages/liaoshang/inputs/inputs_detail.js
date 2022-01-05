// pages/inputs/inputs_detail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardCur: 0,
        inputs_num: 0,
        input_allnum: 0,
        // skudto_index: "",
        skudto_index: 0,
        attrValueId: "",
        date: "",
        inputs_info: "",
        swiperList: [],
        show_collection: false,//是否收藏
    },




    /**
     * 公共函数
     */

    // previewImage(e) {
    //     console.log(1);
    //     var src = e.currentTarget.dataset.src;//获取data-src
    //     // var imgList = e.currentTarget.dataset.list;//获取data-list
    //     var list = [src]
    //     //图片预览
    //     wx.previewImage({
    //         current: src, // 当前显示图片的http链接
    //         urls: list // 需要预览的图片http链接列表
    //     })
    // },

    //切换规格
    skudto_switch(e) {
        let index = e.currentTarget.dataset.index, valueid = e.currentTarget.dataset.valueid

        this.setData({
            skudto_index: index,
            attrValueId: valueid
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

    DateChange(e) {
        this.setData({
            date: e.detail.value
        })
    },

    getinput_num(e) {
        this.data.inputs_num = Number(e.detail.value)
        let all = app.accMul(this.data.inputs_num, this.data.inputs_info.skuDTOList[this.data.skudto_index].getSkuPriceResponse.price)
        this.setData({
            error_color: false,
            input_allnum: all,
            inputs_quantity: this.data.inputs_info.skuDTOList[this.data.skudto_index].getSkuPriceResponse.price,
        })
    },

    error_color(e) {
        this.setData({
            error_color: false,
        })
    },

    //收藏商品
    collection(e) {
        let that = this
        if (that.data.show_collection == false) {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/b2b/goods/favorite',
                data: {
                    sellerId: that.data.inputs_info.shopDTO.sellerId,
                    shopId: that.data.inputs_info.shopDTO.shopId,
                    itemId: that.data.itemId,
                    skuId: that.data.skuId,
                    itemName: that.data.inputs_info.itemName,
                    // unityuserid: app.globalData.user_data.id
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'openid': app.globalData.wx_config.openid,
                    'authorities': app.globalData.token
                },
                success: function (res) {
                    let data = JSON.parse(res.data.data)
                    console.log(data);
                    if (res.data.code == 1) {
                        that.setData({
                            show_collection: true
                        })
                        wx.showToast({
                            title: "收藏成功",
                            icon: 'none',
                            duration: 1000,
                            mark: true
                        })
                    } else if (res.data.code == 401) {
                        // app.error_showToast()
                    } else {

                    }

                },
                fail: function() {
                    wx.showToast({
                        title: "收藏失败",
                        icon: 'none',
                        duration: 1000,
                        mark: true
                    })
                }
            })
        } else {
            console.log("取消收藏");
            that.setData({
                show_collection: false
            })
            wx.showToast({
                title: "取消收藏成功",
                icon: 'none',
                duration: 1000,
                mark: true
            })
        }

    },

    // 初始化towerSwiper
    towerSwiper(name) {
        let list = this.data[name];
        for (let i = 0; i < list.length; i++) {
            list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
            list[i].mLeft = i - parseInt(list.length / 2)
        }
        this.setData({
            swiperList: list
        })
    },

    //下单
    succeed(e) {
        let that = this
        // let date = app.gettime("-")
        if (that.data.inputs_num > 0) {
            wx.navigateTo({
                url: 'inputs_buy',
                success: function (res) {
                    res.eventChannel.emit('acceptDataFromA', { data: that.data })
                }
            })
        } else {
            that.setData({
                error_color: true
            })
            wx.showToast({
                title: "请先输入采购量",
                icon: 'none',
                duration: 1000,
            })
        }

    },

    to_shop(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: 'inputs_shop?id=' + id
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '商品详情'
        });
        let that = this,
            date = app.gettime("-"),
            skuId = options.skuId,
            itemId = options.itemId
        that.data.skuId = options.skuId
        that.data.itemId = options.itemId
        console.log(skuId, itemId);
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/get/detail',
            data: {
                itemId: itemId,
                skuId: skuId,
                // orderId: 0,
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                  'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                var data = JSON.parse(res.data.data)
                console.log(data)
                if (res.data.code == 1) {

                    data.result.afterService = app.unescapeHTML(data.result.afterService)
                    data.result.describeUrl = app.unescapeHTML(data.result.describeUrl)
                    data.result.packingList = app.unescapeHTML(data.result.packingList)


                    let imgList = [], list = data.result.itemPicUrls
                    // for (let i = 0; i < list.length; i++) {
                    //     let arr = {}
                    //     arr.id = i
                    //     arr.type = 'image'
                    //     arr.url = app.globalData.config.ossUrl + list[i]
                    //     imgList = imgList.concat(arr)
                    // }
                    let joint_img = data.result.describeUrl.split('<img src="')
                    let img_url = joint_img[0]
                    for (let i = 1; i < joint_img.length; i++) {
                        img_url = img_url + '<img src="' + app.globalData.config.ossUrl + joint_img[i]
                    }
                    data.result.describeUrl = img_url

                    for (let i = 0; i < data.result.skuDTOList.length; i++) {
                        data.result.skuDTOList[i].picUrl = app.globalData.config.ossUrl + data.result.skuDTOList[i].picUrl
                        for (let j = 0; j < data.result.skuDTOList[i].skuPicUrls.length; j++) {
                            data.result.skuDTOList[i].skuPicUrls[j] = app.globalData.config.ossUrl + data.result.skuDTOList[i].skuPicUrls[j]
                        }
                        let arr = {}
                        arr.id = i
                        arr.type = 'image'
                        arr.url = data.result.skuDTOList[i].skuPicUrls[0]
                        imgList = imgList.concat(arr)

                    }


                    that.setData({
                        date: date,
                        swiperList: imgList,
                        attrValueId: data.result.attributeDTOList[0].attributeValueDTOList[0].valueId,
                        inputs_info: data.result,
                    })
                    console.log(that.data);

                } else if (res.data.code == 401) {
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

        this.towerSwiper('swiperList');
        // 初始化towerSwiper 传已有的数组名即可
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