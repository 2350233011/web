// pages/exam/exam_ situation.js
const find = require('../../utils/fundIndex.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page_title: "语文",//考试科目
        exam_time: "59:59",//考试剩余时间
        exam_details: null,
        subject_id: 1,//题目排序
        answer: [],//用户答案
        sum: null,
        sn: [],
        checkbox: [],//多项选择临时答案
        subject: []
    },
    //切换题目
    subject_switch: function (e) {
        let _this = this, type = e.currentTarget.dataset.type;
        if (type == "top") {
            let index = _this.data.subject_id;
            if (index > 1) {
                _this.setData({
                    subject_id: index - 1,
                })
            } else {
                wx.showToast({
                    title: '已经是第一题了',
                    icon: 'none',
                    mask: 'true',
                })
            }

        } else {
            let index = _this.data.subject_id;
            if (index < _this.data.subject.length) {
                _this.setData({
                    subject_id: index + 1,
                })
            } else {
                wx.showToast({
                    title: '已经是最后一题了',
                    icon: 'none',
                    mask: 'true',
                })
            }
        }
    },
    //答题卡窗口
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
    browse: function (e) {
        let _this = this;
        console.log(_this.data);
        let data = JSON.stringify(_this.data)
        wx.navigateTo({
            url: 'exam_all2?data=' + encodeURIComponent(data),
        })
    },
    //答题卡跳转
    answer_btn: function (e) {
        let id = e.currentTarget.dataset.id;
        this.setData({
            modalName: null,
            subject_id: id,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this, eventChannel = this.getOpenerEventChannel(), index = options.index ? options.index : "";
        console.log(index);
        eventChannel.on('acceptDataFromA', function (data) {
            console.log(data);
            if (index !== "") {
                _this.setData({
                    exam_details: data.data
                }, function () {
                    //获取数据
                    _this.loading_data_index()
                })
            } else {
                _this.setData({
                    sum: data.data.sum,
                    exam_details: data.data.exam_details
                }, function () {
                    //获取数据
                    _this.loading_data_index()
                })
            }

        })

        // if (index !== "") {
        // } else {
        //     eventChannel.on('acceptDataFromA', function (data) {
        //         console.log(data);
        //         _this.setData({
        //             sn: data.data.sn,
        //             sum: data.data.sum,
        //             answer: data.data.answer,
        //             subject: data.data.subject,
        //         })
        //     })
        //     let array = _this.data.answer;
        //     if (array.length) {
        //         for (let i = 0; i < array.length; i++) {
        //             let id = find.findIndex2(_this.data.subject, "id", array[i].question);
        //             let option = _this.data.subject[id].btQuestion.btAnswerItemList, select = array[i].select_option.toString().split(',');
        //             for (let q = 0; q < select.length; q++) {
        //                 for (let j = 0; j < option.length; j++) {
        //                     if (select[q] == option[j].id) {
        //                         let topIndex = "subject[" + id + "].btQuestion.btAnswerItemList[" + j + "].topIndex"
        //                         _this.setData({
        //                             [topIndex]: 1,
        //                         })
        //                     }
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
        // var pages = getCurrentPages();
        // var beforePage = pages[pages.length - 2];
        // beforePage.loadData();
        // wx.navigateBack({
        //     delta: 1,
        // })
        wx.switchTab({
            url: '/pages/exam/exam',
            success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) {
                    return;
                } else {
                    page.onLoad();
                }
            }
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

    },
    loading_data_index: function (id) {
        let _this = this, elems = [], answers = [], all_sn = [];
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/searchBtStudentQuestionInfoByUser',
            data: {
                papers: _this.data.exam_details.id
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                let datas = res.data, data = datas.data;
                console.log(data);
                if (datas.code == 1) {
                    for (let i = 0; i < data.length; i++) {
                        all_sn = all_sn.concat(data[i].sn);
                    }
                    _this.setData({
                        sn: all_sn,
                        subject: data
                    })
                    let array = data;
                    if (array.length) {
                        for (let i = 0; i < array.length; i++) {
                            let option = data[i].btQuestion.btAnswerItemList, select = array[i].selectOption.toString().split(',');
                            for (let q = 0; q < select.length; q++) {
                                for (let j = 0; j < option.length; j++) {
                                    if (select[q] == option[j].id) {
                                        let topIndex = "subject[" + i + "].btQuestion.btAnswerItemList[" + j + "].topIndex"
                                        _this.setData({
                                            [topIndex]: 1,
                                        })
                                    }
                                }
                            }
                        }
                    }
                    console.log(_this.data);
                } else if (datas.code == -3000) {
                    wx.showToast({
                        title: '没有数据',
                        icon: 'none',
                        mask: 'true',
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
    },
})