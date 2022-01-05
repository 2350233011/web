// pages/exam/exam_all.js
const find = require('../../utils/fundIndex.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        exam_time: "59:59",//考试剩余时间
        exam_details:null,
        answer: [],//用户答案
        checkbox: [],//多项选择临时答案
        sum:null,//总分
        subjects:[],
        subject: []

    },
    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },
    subject_submit: function (e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
        let _this = this;
        let score = find.find_value(_this.data.answer, "score")
        let sum = 0;
        for (let i = 0; i < score.length; i++) {
            sum += Number(score[i])
        }
        _this.setData({
            sum:sum
        })
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btStudentPapers/handPapers',
            data: {
                papers:_this.data.exam_details.id
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                console.log(res);
            }
        })
        wx.navigateTo({
            url: 'exam_result',
            // events: {
            //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            //   acceptDataFromB: function(data) {
            //     console.log(data)
            //   },
            // },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                let data = {}
                data.exam = _this.data.exam_details,
                data.sum = _this.data.sum
                res.eventChannel.emit('acceptDataFromA', { data: data })
            }
        })

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this, eventChannel = this.getOpenerEventChannel();
        wx.setNavigationBarTitle({
            title: "预览试卷"
        })
        // eventChannel.emit('acceptDataFromB', { data: 'BBBB' });
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromA', function (data) {
            _this.data.sn=data.data.sn
            _this.data.exam_details=data.data.exam_details
            _this.data.answer=data.data.answer
            _this.data.subjects=data.data.subject
            // let subject_data =
            _this.setData({
                subject: data.data.subject,
            })
        })

        // let array = _this.data.answer;
        // if (array.length) {
        //     for (let i = 0; i < array.length; i++) {
        //         let id = find.findIndex2(_this.data.subject, "id", array[i].question);
        //         let option = _this.data.subject[id].btQuestion.btAnswerItemList, select = array[i].select_option.toString().split(',');
        //         for (let q = 0; q < select.length; q++) {
        //             for (let j = 0; j < option.length; j++) {
        //                 if (select[q] == option[j].id) {
        //                     let topIndex = "subject[" + id + "].btQuestion.btAnswerItemList[" + j + "].topIndex"
        //                     _this.setData({
        //                         [topIndex]: 1,
        //                     })
        //                 }
        //             }
        //         }
        //     }
        // }

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