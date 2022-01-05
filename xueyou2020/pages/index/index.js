// pages/me/me.js
const parserEmoji = require("../../components/parser/libs/emoji.js")
const utils = require('../../utils/util.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Topindex: 0,
        modalName: null,
        elements: [
            {
                title: "错题本",
                key:1,
                type: "cuoti",
                color: "blue"
            },
            // {
            //     title: "学习记录",
            //     key:2,
            //     type: "jilu",
            //     color: "blue"
            // }

        ],
        element: [],
        element2: [],
        exam: [],
        complete_exam: []


    },

    tixing: function (e) {
        wx.showToast({
            title: '正在开发中',
            icon: 'none',
            mask: 'true',
            duration: 1000
        })
    },

    //练习
    Jump_btn: function (e) {
        let type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: '../library/library_details?key=' + type,
        });
    },
    //学习记录
    Jump_btn_record: function (e) {
        let type = e.currentTarget.dataset.type
        if (type == 1) {
            wx.navigateTo({
                url: '../record/error?key=' + type,
            });
        } else {
            wx.navigateTo({
                url: '../record/record?key=' + type,
            });
        }
    },
    //辅导
    Jump_btn2: function (e) {
        let type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: '../coach/coach_details?key=' + type,
        });
    },
    //考试
    conduct_exam: function (e) {
        let _this = this, index = e.currentTarget.dataset.target
        wx.navigateTo({
            url: '../exam/exam_details',
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromA', { data: _this.data.exam[index] })
            }
        })
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
    to_ranking: function (e) {
        let _this = this
        _this.setData({
            modalName: null
        })
        wx.navigateTo({
            url: 'Ranking',
            // success: function (res) {
            //     // 通过eventChannel向被打开页面传送数据
            //     res.eventChannel.emit('acceptDataFromA', { data: _this.data })
            // }
        })


    },



    // getPhoneNumber (e) {
    //     console.log(e.detail.errMsg)
    //     console.log(e.detail.iv)
    //     console.log(e.detail.encryptedData)
    //   },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this, datas = [], data2 = [], exams = [], complete_exam = [];
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/sysDic/searchDicGroup',
            data: {
                dicGroup: '科目'
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                let data = res.data.data;
                if (res.data.code == 1) {
                    for (let i = 0; i < data.length; i++) {
                        let elem = {};
                        elem.title = data[i].dicvalue;
                        elem.type = data[i].uuid;
                        elem.key = data[i].dickey;
                        elem.color = "blue";
                        datas = _this.data.element.concat(elem)
                        data2 = _this.data.element2.concat(elem)
                        _this.setData({
                            element2: data2,
                            element: datas
                        })
                    }
                } else if (res.data.code == -3000) {
                    console.log("没有数据");
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
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btStudentPapers/searchBtStudentPapers',
            data: {
                PageNum: 1,
                PageSize: 20 //查询条数
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                let data = res.data.data;
                if (res.data.code == 1) {
                    for (let i = 0; i < data.length; i++) {
                        let exam = data[i].btPapers
                        let times = exam.startTime
                        exam.time = utils.timeFormat(times);
                        exam.color = "blue";
                        exam.state = data[i].state
                        if (data[i].state == 0) {
                            exams = _this.data.exam.concat(exam)
                        } else {
                            complete_exam = _this.data.complete_exam.concat(exam)
                        }
                        _this.setData({
                            exam: exams,
                            complete_exam: complete_exam
                        })
                    }
                } else if (res.data.code == -3000) {
                    console.log("没有数据");
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




        //显示排行榜
        // this.setData({
        //     modalName: "Image"
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
    //刷新
    onRefresh: function () {
        //在当前页面显示导航条加载动画
        wx.showNavigationBarLoading();
        this.getData();
    },
    //网络请求，获取数据
    getData: function () {
        let _this = this, datas = [], data2 = [], exams = [], complete_exam = [];
        _this.setData({
            element2: [],
            element: [],
            exam: [],
            complete_exam: []
        })

        wx.request({
            url: app.globalData.config.baseURL + '/webapi/sysDic/searchDicGroup',
            data: {
                dicGroup: '科目'
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                let data = res.data.data;
                if (res.data.code == 1) {
                    for (let i = 0; i < data.length; i++) {
                        let elem = {};
                        elem.title = data[i].dicvalue;
                        elem.type = data[i].uuid;
                        elem.key = data[i].dickey;
                        elem.color = "blue";
                        datas = _this.data.element.concat(elem)
                        data2 = _this.data.element2.concat(elem)
                        _this.setData({
                            element2: data2,
                            element: datas
                        })
                    }
                } else if (res.data.code == -3000) {
                    console.log("没有数据");
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
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btStudentPapers/searchBtStudentPapers',
            data: {
                PageNum: 1,
                PageSize: 20 //查询条数
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                let data = res.data.data;
                if (res.data.code == 1) {
                    for (let i = 0; i < data.length; i++) {
                        let exam = data[i].btPapers
                        let times = exam.startTime
                        exam.time = utils.timeFormat(times);
                        exam.color = "blue";
                        exam.state = data[i].state
                        if (data[i].state == 0) {
                            exams = _this.data.exam.concat(exam)
                        } else {
                            complete_exam = _this.data.complete_exam.concat(exam)
                        }
                        _this.setData({
                            exam: exams,
                            complete_exam: complete_exam
                        })
                        console.log(_this.data.exam);
                    }
                } else if (res.data.code == -3000) {
                    console.log("没有数据");
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    filterViewMove: function () {

    }
})