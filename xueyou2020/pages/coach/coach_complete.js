// pages/coach/coach_complete.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: null,
        library: {},
        index: null
    },

    conduct_exam: function (e) {
        wx.navigateTo({
            url: 'coach_example'
        })

    },
    analysis_exam: function (e) {
        wx.navigateTo({
            url: 'coach_complete2'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this, eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromA', function (data) {
            _this.setData({
                library:data.data
            })
            console.log(_this.data.library);
        })

        // _this.setData({
        //     type:type
        // })


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