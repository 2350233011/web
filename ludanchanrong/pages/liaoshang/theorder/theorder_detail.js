// pages/theorder/theorder_detail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },



    //获取订单详情
    getOrderInfo(id) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/test/query/order/info',
            data: {
                orderId: id
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
                        order_info: data.list[0],
                        isdefault: data.list[0].addressInfoDTO
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



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '订单明细'
        });
        let id = options.id
        this.getOrderInfo(id)

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