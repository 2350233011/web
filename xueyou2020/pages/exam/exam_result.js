// pages/exam/exam_result.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sum: null,
        exam_details: null

    },
    to_situation: function (e) {
        let _this = this;
        wx.navigateTo({
            url: 'exam_situation',
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromA', { data: _this.data })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this, eventChannel = this.getOpenerEventChannel();
        // eventChannel.emit('acceptDataFromB', { data: 'BBBB' });
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromA', function (data) {
            console.log(data);
            _this.data.exam_details = data.data.exam
            _this.setData({
                sum: data.data.sum,
            })
        }, function (e) {
            // data.data.exam_details.id
        })
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
        wx.switchTab({
            url: '/pages/exam/exam',
        });

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