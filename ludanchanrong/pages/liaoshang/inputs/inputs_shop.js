// pages/liaoshang/inputs/inputs_shop.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        TopIndex: 1,
        shopsIndex: 2, //店铺菜单
        kind: [],
        kind2: [],
        inputs_info: [],
        data: [],
        config: {
            shops_id: "",
            pages: 1, //当前页面的分页数量
            pageIndex: 1, //当前分页

        }, //页面显示配置

        show_collection:false,//店铺是否收藏

    },

    //点击切换商店菜单
    changstyle_shops(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let type = e.currentTarget.dataset.type
        switch (type) {
            case "index":

                break;
            case "all":
                this.get_allInputs()
                break;
            case "class":
                this.get_categorys()
                break;
        }
        that.setData({
            shopsIndex: index,
        })

    },

    //点击进入分类
    changstyle: function (e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let cid = e.currentTarget.dataset.cid
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/get/child/category',
            data: {
                cid: 1448,
                page: 1,
                orderSort: "",
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                  'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                // console.log(res);
                var data = JSON.parse(res.data)
                console.log(data.result);
                that.setData({
                    TopIndex: index + 1,
                    kind2: data.result
                })

            }
        })


    },

    to_changstyle(e) {
        let index = e.currentTarget.dataset.index
        let shopid = this.data.config.shops_id
        wx.navigateTo({
            url: 'inputs_shop_class?data=' + JSON.stringify(this.data.kind[index]) + "&shopid=" + shopid
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

    //店铺推荐商品
    get_threeClassifications(e) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/three/classifications',
            data: {
                shopId: that.data.config.shops_id,
                // shopId: "2000036224",
                type: 2,
                page: that.data.config.pageIndex,
                pageSize: app.globalData.config.PageSize
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                  'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                console.log(res);
                var data = JSON.parse(res.data)
                var inputs = data.listRecord
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                }
                that.setData({
                    inputs_info: inputs
                })
                console.log(that.data);
            }
        })
        // if (that.data.config.pageIndex < that.data.config.pages) {
        // let pages = "config.pages"
        // let pageNum = Math.ceil(data.itemCount / app.globalData.config.PageSize)
        // [pages]: pageNum,
        // } else {
        //     setTimeout(function () {
        //         wx.showToast({
        //             title: '暂无数据',
        //             icon: 'none',
        //             mask: 'true',
        //             duration: 1000
        //         })
        //     }, 1000)
        // }
        console.log(this.data);
    },

    //店铺全部商品
    get_allInputs(e) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/index/item',
            data: {
                shopId: that.data.config.shops_id,
                // shopId: "2000036224",
                type: 3,
                page: that.data.config.pageIndex,
                pageSize: app.globalData.config.PageSize
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                  'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                // console.log(res);
                var data = JSON.parse(res.data.data)
                console.log(data);
                var inputs = data.result.searchItemSkuOutDTO.itemSkus.rows
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                }
                that.setData({
                    inputs_info: inputs
                })
                console.log(that.data);
            }
        })
        // if (that.data.config.pageIndex < that.data.config.pages) {
        // let pages = "config.pages"
        // let pageNum = Math.ceil(data.itemCount / app.globalData.config.PageSize)
        // [pages]: pageNum,
        // } else {
        //     setTimeout(function () {
        //         wx.showToast({
        //             title: '暂无数据',
        //             icon: 'none',
        //             mask: 'true',
        //             duration: 1000
        //         })
        //     }, 1000)
        // }
        console.log(this.data);
    },

    //获取店铺中的分类
    get_categorys(e) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/shop/category',
            data: {
                shopId: that.data.config.shops_id,
                page: that.data.config.pageIndex,
                pageSize: app.globalData.config.PageSize,
                type: 2
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                  'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                var data = JSON.parse(res.data.data)
                that.setData({
                    kind: data.shopCategorySellerDTOs
                })

            }
        })
    },

    //获取店铺首页
    get_shop_index(e) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/shop/new/to/index',
            data: {
                shopId: that.data.config.shops_id,
                page: that.data.config.pageIndex,
                pageSize: app.globalData.config.PageSize,
                type: 1
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                  'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                var data = JSON.parse(res.data)
                console.log(data);
                data.logoUrl = app.globalData.config.ossUrl + data.logoUrl
                // var inputs = data.allItems
                // for (let i = 0; i < inputs.length; i++) {
                //     inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                // }
                that.setData({
                    data: data,
                    // inputs_info: inputs,
                    // kind: data.shopCategorySellerDTOs
                })

            }
        })

    },

    //跳转详情页面
    to_inputs_detail: function (e) {
        wx.navigateTo({
            url: '/pages/liaoshang/inputs/inputs_detail?skuId=' + e.currentTarget.dataset.skuid + '&itemId=' + e.currentTarget.dataset.itemid
        })
    },

    //获取店铺详情
    get_shops(e) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/shop/info',
            data: {
                shopId: that.data.config.shops_id,
                orderSort: "",
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                  'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                var data = JSON.parse(res.data.data)
                data.result.shopLogoUrl = app.globalData.config.ossUrl + data.result.shopLogoUrl
                console.log(data);
                that.setData({
                    data: data.result
                })

            }
        })
    },

    //店铺收藏
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





    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let Id = options.id
        let shopid = "config.shops_id"
        this.setData({
            [shopid]: Id
        })
        this.get_shops()
        this.get_allInputs()
        // this.get_threeClassifications()


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