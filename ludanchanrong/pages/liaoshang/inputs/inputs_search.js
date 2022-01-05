const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue: "", //搜索内容
        topNum: 0, //回到顶部
        inputs_info: "", //产品列表
        shop_info: "", //产品列表
        topNum: 0, //回到顶部
        config: {
            shops_id: "",
            category_id: 0,
            pageIndex: 1, //当前分页

        }, //页面显示配置


        list: [],
        inputValue: null,
        resultList: [],
        show_collection: false,//店铺是否收藏

        type_show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
        type_selectData: ["商品", "店铺"],//下拉列表的数据
        type_index: 0,//选择的下拉列表下标  0搜索商品，1搜索商店

        inputs_show: false,//是否有产品
        shop_show: false,//是否有产品

        loading: "loading"
    },

    /**
     * 公共函数
     */

    // 点击下拉显示框
    selectTap() {
        this.setData({
            type_show: !this.data.type_show
        });
    },
    // 点击下拉列表
    optionTap(e) {
        let Index = e.currentTarget.dataset.index//获取点击的下拉列表的下标
        let config = {
            shops_id: "",
            category_id: 0,
            pageIndex: 1, //当前分页

        } //页面显示配置
        this.setData({
            type_index: Index,
            type_show: !this.data.type_show,
            loading: "loading",
            config: config, //页面显示配置
        });
        this.search()

    },


    //搜索框内容
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
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

    //商品详情页面
    to_inputs_detail: function (e) {
        console.log(e.currentTarget.dataset.skuid);
        wx.navigateTo({
            url: '/pages/liaoshang/inputs/inputs_detail?skuId=' + e.currentTarget.dataset.skuid + '&itemId=' + e.currentTarget.dataset.itemid
        })
    },

    //店铺详情页面
    to_shop(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: 'inputs_shop?id=' + id
        })
    },

    //搜索
    search(e) {
        let that = this
        if (that.data.type_index == 0) {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/b2b/search/goods/list',
                data: {
                    keyword: that.data.inputValue,
                    payType: 0,
                    brandId: 0,
                    attributes: "",
                    cid: 0,
                    itemId: 0,
                    orderSort: 0,
                    page: that.data.config.pageIndex
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'openid': app.globalData.wx_config.openid,
                    'authorities': app.globalData.token
                },
                success: function (res) {
                    var data = JSON.parse(app.unescapeHTML(res.data.data))
                    var inputs = data.result.skuDTOList
                    if (inputs.length > 0) {
                        for (let i = 0; i < inputs.length; i++) {
                            inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                        }
                        that.setData({
                            inputs_info: inputs,
                            Loading: true
                        })
                    } else {
                        that.setData({
                            inputs_show: true
                        })
                        wx.showToast({
                            title: "暂无产品",
                            icon: 'none',
                            duration: 1000,
                            mark: true
                        })
                    }
                }
            })
        } else {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/b2b/search/shop',
                data: {
                    keyword: that.data.inputValue,
                    payType: 0,
                    brandId: 0,
                    attributes: "",
                    cid: 0,
                    itemId: 0,
                    orderSort: 0,
                    page: that.data.config.pageIndex
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'openid': app.globalData.wx_config.openid,
                    'authorities': app.globalData.token
                },
                success: function (res) {
                    var data = JSON.parse(app.unescapeHTML(res.data.data))

                    var inputs = data.result
                    if (inputs.length > 0) {
                        for (let i = 0; i < inputs.length; i++) {
                            inputs[i].shopLogoUrl = app.globalData.config.ossUrl + inputs[i].shopLogoUrl
                        }
                        that.setData({
                            shop_info: inputs,
                            Loading: true
                        })
                    } else {
                        that.setData({
                            shop_show: true
                        })
                        wx.showToast({
                            title: "暂无店铺",
                            icon: 'none',
                            duration: 1000,
                            mark: true
                        })
                    }


                    // if (data.code == 200) {

                    // } else if (data.code == 401) {
                    //     // app.error_showToast()
                    // } else {

                    // }

                }
            })
        }

    },

    //收藏店铺
    collection(e) {
        let that = this
        if (that.data.show_collection == false) {
            that.setData({
                show_collection: true
            })
            wx.showToast({
                title: "收藏成功",
                icon: 'none',
                duration: 1000,
                mark: true
            })
            // wx.request({
            //     url: app.globalData.config.baseURL + '/appapi/b2b/goods/favorite',
            //     data: {
            //         sellerId: that.data.inputs_info.shopDTO.sellerId,
            //         shopId: that.data.inputs_info.shopDTO.shopId,
            //         itemId: that.data.itemId,
            //         skuId: that.data.skuId,
            //         itemName: that.data.inputs_info.itemName,
            //         unityuserid: "P754453506"
            //     },
            //     method: 'POST',
            //     header: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //           'openid': app.globalData.wx_config.openid,
            //         'authorities': app.globalData.token
            //     },
            //     success: function (res) {
            //         let data = JSON.parse(res.data)
            //         console.log(data);
            //         if (data.code == 200) {
            //             that.setData({
            //                 show_collection: true
            //             })
            //             wx.showToast({
            //                 title: "收藏成功",
            //                 icon: 'none',
            //                 duration: 1000,
            //                 mark: true
            //             })
            //         } else if (data.code == 401) {
            //             // app.error_showToast()
            //         } else {

            //         }

            //     }
            // })
        } else {
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

    loading(e) {
        let that = this
        if (that.data.type_index == 0) {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/b2b/search/goods/list',
                data: {
                    keyword: that.data.inputValue,
                    payType: 0,
                    brandId: 0,
                    attributes: "",
                    cid: 0,
                    itemId: 0,
                    orderSort: 0,
                    page: that.data.config.pageIndex
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'openid': app.globalData.wx_config.openid,
                    'authorities': app.globalData.token
                },
                success: function (res) {
                    var data = JSON.parse(app.unescapeHTML(res.data.data))
                    var inputs = data.result.skuDTOList
                    if (inputs.length > 0) {
                        for (let i = 0; i < inputs.length; i++) {
                            inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                        }
                        let pageIndex = "config.pageIndex"
                        that.setData({
                            inputs_info: that.data.inputs_info.concat(inputs),
                            Loading: true,
                            [pageIndex]: that.data.config.pageIndex + 1
                        })
                    } else {
                        that.setData({
                            loading: true
                        })
                        wx.showToast({
                            title: "暂无更多",
                            icon: 'none',
                            duration: 1000,
                            mark: true
                        })
                    }
                }
            })
        } else {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/b2b/search/shop',
                data: {
                    keyword: that.data.inputValue,
                    payType: 0,
                    brandId: 0,
                    attributes: "",
                    cid: 0,
                    itemId: 0,
                    orderSort: 0,
                    page: that.data.config.pageIndex + 1
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'openid': app.globalData.wx_config.openid,
                    'authorities': app.globalData.token
                },
                success: function (res) {
                    var data = JSON.parse(app.unescapeHTML(res.data.data))

                    var inputs = data.result
                    if (inputs.length > 0) {
                        for (let i = 0; i < inputs.length; i++) {
                            inputs[i].shopLogoUrl = app.globalData.config.ossUrl + inputs[i].shopLogoUrl
                        }
                        let pageIndex = "config.pageIndex"
                        that.setData({
                            shop_info: that.data.shop_info.concat(inputs),
                            Loading: true,
                            [pageIndex]: that.data.config.pageIndex + 1
                        })
                    } else {
                        that.setData({
                            loading: true
                        })
                        wx.showToast({
                            title: "暂无更多",
                            icon: 'none',
                            duration: 1000,
                            mark: true
                        })
                    }


                    // if (data.code == 200) {

                    // } else if (data.code == 401) {
                    //     // app.error_showToast()
                    // } else {

                    // }

                }
            })
        }
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '搜索'
        });
        this.setData({
            Loading: false,
            inputValue: options.keyword,
            type_index: options.type_index
        })
        this.search()


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