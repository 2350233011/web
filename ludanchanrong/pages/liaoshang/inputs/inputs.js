// pages/inputs/inputs.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        TopIndex: 0, //分类
        shopsIndex: 0, //店铺
        inputValue: "", //搜索内容
        topNum: 0, //回到顶部
        kind: "", //分类列表
        inputs_info: "", //产品列表
        shops_list: "", //商店列表
        config: {
            shops_id: "",
            category_id: 0,
            pages: 1, //当前页面的分页数量
            pageIndex: 1, //当前分页

        }, //页面显示配置


        type_show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
        type_selectData: ["商品", "店铺"],//下拉列表的数据
        type_index: 0//选择的下拉列表下标

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
        let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
        this.setData({
            type_index: Index,
            type_show: !this.data.type_show
        });
    },

    //点击切换商店
    changstyle_shops(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let shops = e.currentTarget.dataset.shops
        let shops_id = "config.shops_id"
        that.setData({
            shopsIndex: index,
            TopIndex: 0,
            [shops_id]: shops
        })
        if (shops == "") {
            //获取推荐
            that.get_firstCategory()
            that.setData({
                inputs_info: ""
            })
        } else {
            that.get_categorys()
            that.get_threeClassifications(e)
        }
    },

    //点击切换分类
    changstyle: function (e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let cate = e.currentTarget.dataset.cate
        let category_id = "config.category_id"
        that.setData({
            TopIndex: index,
            [category_id]: cate
        })
        if (cate == "") {
            if (that.data.config.shops_id == "") {
                //获取推荐
                that.setData({
                    inputs_info: ""
                })
            } else {
                that.get_threeClassifications(e)
            }
        } else {
            that.get_inputs()
        }
    },

    //搜索框
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

    //跳转详情页面
    to_inputs_detail: function (e) {
        wx.navigateTo({
            url: '/pages/liaoshang/inputs/inputs_detail?skuId=' + e.currentTarget.dataset.skuid + '&itemId=' + e.currentTarget.dataset.itemid
        })
    },

    //一级分类
    get_firstCategory(e) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/get/first/category',
            data: {},
            method: 'POST',
            header: {
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                var data = JSON.parse(res.data.data)
                let category_id = "config.category_id"
                if (res.data.code == 1) {
                    let list = ["鸡苗鸭苗", "兽药", "饲料"]
                    let result = []
                    for (let i = 0; i < data.result.length; i++) {
                        for (let j = 0; j < list.length; j++) {
                            if (data.result[i].cname == list[j]) {
                                result.push(data.result[i])
                            }

                        }
                    }
                    that.setData({
                        kind: result,
                        [category_id]: result[0].cid
                    })
                    //产品列表
                    that.get_inputs()

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
    },

    //获取商店列表
    get_shop(e) {
        let that = this;
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/search/shop',
            data: {
                keyword: "",
                orderSort: "",
                page: 2,
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                var data = JSON.parse(res.data.data)
                if (res.data.code == 1) {
                    let list = ["潍坊鑫众养殖有限公司", "潍坊昌盛养殖有限公司", "潍坊利农养殖有限公司"]
                    let result = []
                    for (let i = 0; i < data.result.length; i++) {
                        for (let j = 0; j < list.length; j++) {
                            if (data.result[i].shopName == list[j]) {
                                result.push(data.result[i])
                            }

                        }
                    }
                    that.setData({
                        shops_list: result
                    })
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
                console.log(res);
                var data = JSON.parse(res.data.data)
                if (res.data.code == 1) {
                    that.setData({
                        kind: data.shopCategorySellerDTOs
                    })
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
    },

    //店铺推荐商品
    get_threeClassifications(e) {
        let that = this,
            type = e.currentTarget.dataset.type
        if (type == "add") {
            if (that.data.config.pageIndex < that.data.config.pages) {
                wx.request({
                    url: app.globalData.config.baseURL + '/appapi/b2b/three/classifications',
                    data: {
                        shopId: that.data.config.shops_id,
                        type: 2,
                        page: that.data.config.pageIndex + 1,
                        pageSize: app.globalData.config.PageSize
                    },
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'openid': app.globalData.wx_config.openid,
                        'authorities': app.globalData.token
                    },
                    success: function (res) {
                        var data = JSON.parse(res.data)
                        var inputs = data.listRecord
                        for (let i = 0; i < inputs.length; i++) {
                            inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                        }
                        let pageIndex = "config.pageIndex"
                        that.setData({
                            [pageIndex]: that.data.config.pageIndex + 1,
                            inputs_info: that.data.inputs_info.concat(inputs)
                        })
                        console.log(that.data);
                    }
                })
            } else {
                wx.showToast({
                    title: '暂无数据',
                    icon: 'none',
                    mask: 'true',
                    duration: 1000
                })
            }

        } else {
            wx.request({
                url: app.globalData.config.baseURL + '/appapi/b2b/three/classifications',
                data: {
                    shopId: that.data.config.shops_id,
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
                    var data = JSON.parse(res.data.data)
                    var inputs = data.listRecord
                    for (let i = 0; i < inputs.length; i++) {
                        inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                    }
                    let pages = "config.pages"
                    let pageNum = Math.ceil(data.itemCount / app.globalData.config.PageSize)
                    that.setData({
                        [pages]: pageNum,
                        inputs_info: inputs
                    })

                }
            })
        }
        console.log(this.data);
    },

    //根据分类获取商品
    get_inputs(e) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/search/item/by/category',
            data: {
                cid: that.data.config.category_id,
                // orderSort: "",
                page: that.data.config.pageIndex,
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
                var inputs = data.result.skuDTOList
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                }
                if (res.data.code == 1) {
                    that.setData({
                        inputs_info: inputs
                    })
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
        console.log(this.data);
    },

    //搜索
    search(e) {
        wx.navigateTo({
            url: 'inputs_search?keyword=' + this.data.inputValue + "&type_index=" + this.data.type_index
        })
        this.setData({
            inputValue: ""
        })
    },




    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '投入品购买'
        });
        let that = this

        //商店列表
        that.get_shop()
        //分类列表
        that.get_firstCategory()


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