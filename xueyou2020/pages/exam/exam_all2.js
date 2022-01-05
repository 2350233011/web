// pages/exam/exam_all.js
const find = require('../../utils/fundIndex.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        answer: [],//用户答案
        checkbox: [],//多项选择临时答案
        sum: null,//总分
        subjects: [],
        subject: []

    },
    return(e) {
        wx.navigateBack()
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this, data = JSON.parse(decodeURIComponent(options.data));
        _this.data.sn = data.sn
        _this.data.answer = data.answer
        _this.data.subjects = data.subject
        _this.setData({
            subject: data.subject,
        })

        let array = _this.data.answer;
        if (array.length) {
            for (let i = 0; i < array.length; i++) {
                let id = find.findIndex2(_this.data.subject, "id", array[i].question);
                let option = _this.data.subject[id].btQuestion.btAnswerItemList, select = array[i].select_option.toString().split(',');
                for (let q = 0; q < select.length; q++) {
                    for (let j = 0; j < option.length; j++) {
                        if (select[q] == option[j].id) {
                            let topIndex = "subject[" + id + "].btQuestion.btAnswerItemList[" + j + "].topIndex"
                            _this.setData({
                                [topIndex]: 1,
                            })
                        }
                    }
                }
            }
        }

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