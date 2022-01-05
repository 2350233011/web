// pages/exam/exam.js
const utils = require('../../utils/util.js')
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tips0: null,
        tips1: null,
        TopIndex: 0,
        exam: [],
        complete_exam: [],


        PageNum: 1,
        PageSize: 30,
        isLastPage: false,
        isLoadInterface: false,
    },
    //点击切换页面
    changstyle: function (e) {
        let index = e.currentTarget.dataset.index;           /*定义index等于当前页面的dataset.index*/
        this.setData({
            TopIndex: index      /*定义当前数据的TopIndex等于  index 等于dataset.index*/
        })
    },
    //点击进入正在进行的页面
    conduct_exam: function (e) {
        let _this = this, index = e.currentTarget.dataset.target
        wx.navigateTo({
            url: 'exam_details',
            // events: {
            //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            //   acceptDataFromB: function(data) {
            //     console.log(data)
            //   },
            // },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromA', { data: _this.data.exam[index] })
            }
        })
    },
    //已完成
    complete_exam: function (e) {
        let _this = this, index = e.currentTarget.dataset.target
        console.log(index);
        wx.navigateTo({
            url: 'exam_situation?index=' + index,
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromA', { data: _this.data.complete_exam[index] })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this, exams = [], complete_exam = [];
        wx.setNavigationBarTitle({
            title: '考试'
        })

        _this.data.exam = []
        _this.data.complete_exam = []
        let page = _this.data.PageNum;
        _this.getData(page);




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
        this.onRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let _this=this, page = this.data.PageNum + 1;
        //在当前页面显示导航条加载动画
        wx.showNavigationBarLoading();
        setTimeout(function () {
            _this.getData(page, true);
        }, 1000);

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    //刷新
    onRefresh: function () {
        //在当前页面显示导航条加载动画
        wx.showNavigationBarLoading();
        let page = this.data.PageNum;
        this.getData(page);
    },
    //网络请求，获取数据(下拉刷新)
    getData: function (PageNum, type) {
        let _this = this, exams = [], complete_exam = [], pageIndex = PageNum, PageSize = _this.data.PageSize;

        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btStudentPapers/searchBtStudentPapers',
            data: {
                PageNum: pageIndex,
                PageSize: PageSize //查询条数
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                let data = res.data.data;
                console.log(res);
                if (res.data.code == 1) {

                    _this.data.tips0 = null
                    _this.data.exam = []
                    _this.data.complete_exam = []

                    if (pageIndex > 1) {
                        for (let i = 0; i < data.length; i++) {
                            let exam = data[i].btPapers
                            let times = exam.startTime
                            exam.time = utils.timeFormat(times)
                            exam.userScore = data[i].score
                            exam.state = data[i].state
                            if (data[i].state == 0) {
                                exams = exams.concat(exam)
                            } else {
                                complete_exam = complete_exam.concat(exam)
                            }
                        }
                        _this.setData({
                            exam: exams,
                            complete_exam: complete_exam
                        })
                        if (type) {
                            _this.setData({
                                PageNum: pageIndex + 1
                            })
                        }
                    } else {
                        for (let i = 0; i < data.length; i++) {
                            let exam = data[i].btPapers
                            let times = exam.startTime
                            exam.time = utils.timeFormat(times);
                            exam.userScore = data[i].score
                            exam.state = data[i].state
                            if (data[i].state == 0) {
                                exams = exams.concat(exam)
                            } else {
                                complete_exam = complete_exam.concat(exam)
                            }
                        }
                        _this.setData({
                            exam: exams,
                            complete_exam: complete_exam
                        })
                        if (type) {
                            _this.setData({
                                PageNum: pageIndex + 1
                            })
                        }
                        if (exams == "") {
                            _this.setData({
                                tips0: "暂无数据",
                            })
                        } else if (complete_exam == "") {
                            _this.setData({
                                tips1: "暂无数据",
                            })
                        }
                    }
                } else if (res.data.code == -3000) {
                    if (type != true) {
                        _this.setData({
                            tips0: "暂无数据",
                            tips1: "暂无数据"
                        })
                    }

                    wx.showToast({
                        title: '暂无数据',
                        icon: 'none',
                        duration: 1000
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '当前账号登录已失效请重新登录',
                        success(res) {
                            try {
                                wx.clearStorageSync()
                            } catch (e) {
                                console.log(e);
                            }
                            wx.reLaunch({
                                url: '../login/login'
                            })
                        }
                    })
                }
            }

        })
        setTimeout(function () {
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        }, 600);
        console.log(_this.data);
    },


})