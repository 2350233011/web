// pages/liaoshang/inputs/inputs_shop_class.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputs_info: [],
        kind: [],
        config: {
            category_id: "",
            shops_id: "",
            pages: 1, //当前页面的分页数量
            pageIndex: 1, //当前分页

        }, //页面显示配置

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
        app.goTop(this, 10)
    },


    //根据分类获取商品
    get_inputs(e) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/search/item/by/category',
            data: {
                cid: that.data.config.category_id,
                // orderSort: "",
                page: that.data.config.pageIndex
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                  'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                var data = JSON.parse(JSON.parse(res.data.data))
                var inputs = data.result.skuDTOList
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].picUrl = app.globalData.config.ossUrl + inputs[i].picUrl
                }
                if (data.code == 200) {
                    that.setData({
                        inputs_info: inputs
                    })
                } else if (data.code == 401) {
                    // app.error_showToast()
                } else {
                    // wx.showToast({
                    //     title: data.msg,
                    //     icon: 'none',
                    //     duration: 1000,
                    //     mark: true
                    // })
                }

            }
        })
        console.log(this.data);
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let data = JSON.parse(options.data), shopid = options.shopid
        this.data.kind = data
        this.data.config.category_id = data.cid
        this.data.config.shops_id = shopid
        wx.setNavigationBarTitle({
            title: data.cname
        });
        // this.get_threeClassifications()
        this.get_inputs()

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