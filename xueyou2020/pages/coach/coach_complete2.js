// pages/coach/coach_details2.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: null,
        subject: [
            { name: "../../images/coach/knowledge/2.png" },
            { name: "../../images/coach/knowledge/2.png" },
            { name: "../../images/coach/knowledge/2.png" },
            { name: "../../images/coach/knowledge/2.png" },
        ],
        index: null

    },
    //点击进入正在进行的页面
    conduct_exam: function (e) {
        wx.navigateTo({
            url: 'coach_example'
        })
    },
    knowledge_exam: function (e) {
        wx.navigateBack()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let _this = this, type = JSON.parse(options.index);
        // _this.setData({
        //     type: type,
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