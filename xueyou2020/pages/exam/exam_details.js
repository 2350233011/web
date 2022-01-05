// pages/exam/cont.js
const util = require('../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        exam_style: "语文",
        exam_time1: "11-06 08:00",
        exam_time2: "11-06 10:00",
        exam_timeing: "120",
        showView: false,
        time:"",
        exam_details:[]

    },


    radioChange: function (e) {
        var that = this;
        that.setData({
            showView: true
        })

    },
    exam_btn: function (e) {
        let _this = this;

        if (this.data.showView == false) {
            wx.showToast({
                title: '请先勾选',
                icon: 'none',
                duration: 1500
            });
            return false;
        } else {
            //点击进入正在进行的页面
            wx.navigateTo({
                url: 'exam_complete',
                // events: {
                //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                //   acceptDataFromB: function(data) {
                //     console.log(data)
                //   },
                // },
                success: function(res) {
                  // 通过eventChannel向被打开页面传送数据
                  res.eventChannel.emit('acceptDataFromA', { data: _this.data.exam_details })
                }
            })
        }


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (option) {
        let _this = this;
        wx.setNavigationBarTitle({
            title: '考试'
        })
        var time = util.formatTime(new Date());
        _this.setData({
            time:time
        })
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        let eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromA', function (data) {
            _this.setData({
                exam_details:data.data
            })
        })
        console.log(_this.data);

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