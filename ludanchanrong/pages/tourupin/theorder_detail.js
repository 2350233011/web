// pages/yangzhihu/theorder_detail.js
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

    },

    //供货
    supply(e) {
        let that = this
        wx.showModal({
            title: '提示',
            content: '确定发货吗？',
            success(res) {
                if (res.confirm) {
                    that.setData({
                        theorder: false
                    })
                } else if (res.cancel) {
                }
            }
        })

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
        console.log(that.data);
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