const find = require('../../utils/fundIndex.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page_title: "语文",//考试科目
        exam_time: "59:59",//考试剩余时间
        wxTimerList: {},//计时器
        exam_details: null,//考试详情
        subject_id: 1,//题目排序
        subject_index: 1, //题目下标(js使用与展示页面无关)
        sn: [],
        select_option: null,//用户单题答案
        answer: [],//用户答案
        isRight: null,
        is_show: [],//判断答案对错并且显示class
        checkbox: [],//多项选择临时答案
        subject: []

    },
    //单项选择
    radio_click: function (e) {
        let _this = this, radio = [];
        let subject_i = this.data.subject_id - 1;
        let that = this.data.subject[subject_i].btQuestion.btAnswerItemList;
        let index = e.currentTarget.dataset.name;
        for (let i = 0; i < that.length; i++) {
            if (that[i].sn == index) {
                let topindex = "subject[" + subject_i + "].btQuestion.btAnswerItemList[" + i + "].topIndex";
                _this.setData({
                    [topindex]: 1,
                })
                let isRight = find.findIndex(_this.data.subject[subject_i].btQuestion.btAnswerItemList, "isRight", 1)
                if (isRight == i + 1) {
                    _this.setData({
                        isRight: 1,
                        select_option: _this.data.subject[subject_i].btQuestion.btAnswerItemList[i].id
                    })
                    radio = {
                        question: _this.data.subject[subject_i].id,
                        selectOption: index,
                        sn: _this.data.subject[subject_i].sn,
                        select_option: _this.data.select_option,
                        is_right: _this.data.isRight,
                        rightAnswer: isRight,
                        score: _this.data.subject[subject_i].questionScore
                    }
                } else {
                    _this.setData({
                        isRight: 0,
                        select_option: _this.data.subject[subject_i].btQuestion.btAnswerItemList[i].id,
                    })
                    radio = {
                        question: _this.data.subject[subject_i].id,
                        selectOption: index,
                        sn: _this.data.subject[subject_i].sn,
                        select_option: _this.data.select_option,
                        is_right: _this.data.isRight,
                        rightAnswer: isRight,
                        score: 0.00
                    }
                }
            } else {
                let topindex = "subject[" + subject_i + "].btQuestion.btAnswerItemList[" + i + "].topIndex";
                _this.setData({
                    [topindex]: 0,
                })
            }
        }

        let answer = _this.data.answer.concat(radio).sort(find.compare("sn", true));
        if (find.findIndex2(_this.data.answer, "question", radio.question) === -1) {
            _this.setData({
                answer: answer
            })
        } else {
            let answer_is = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].is_right"
            let answer_right = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].rightAnswer"
            let answer_selectOption = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].selectOption"
            let answer_sn = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].sn"
            let answer_select = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].select_option"
            let answer_score = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].score"
            _this.setData({
                [answer_is]: radio.is_right,
                [answer_right]: radio.rightAnswer,
                [answer_sn]: radio.sn,
                [answer_selectOption]: radio.selectOption,
                [answer_select]: radio.select_option,
                [answer_score]: radio.score
            })
        }
        console.log(_this.data);
    },
    //多项选择
    checkbox_click: function (e) {
        let _this = this, radio = [];
        let subject_i = this.data.subject_id - 1;
        let that = this.data.subject[subject_i].btQuestion.btAnswerItemList;
        let index = e.currentTarget.dataset.name;
        for (let i = 0; i < that.length; i++) {
            if (that[i].sn == index) {
                let topindex = "subject[" + subject_i + "].btQuestion.btAnswerItemList[" + i + "].topIndex";
                if (that[i].topIndex == 1) {
                    find.remove(_this.data.checkbox, _this.data.subject[subject_i].btQuestion.btAnswerItemList[i].id);
                    _this.setData({
                        [topindex]: 0,
                    })
                } else {
                    let topindex = "subject[" + subject_i + "].btQuestion.btAnswerItemList[" + i + "].topIndex";
                    _this.data.checkbox.push(_this.data.subject[subject_i].btQuestion.btAnswerItemList[i].id);
                    _this.setData({
                        [topindex]: 1,
                    })
                }
            }
        }
        let isRight = find.findIndex4(_this.data.subject[subject_i].btQuestion.btAnswerItemList, "isRight", 1, "id")
        if (isRight.sort().toString() == _this.data.checkbox.sort().toString()) {
            _this.setData({
                isRight: 1,
                select_option: _this.data.checkbox
            })
            radio = {
                question: _this.data.subject[subject_i].id,
                sn: _this.data.subject[subject_i].sn,
                select_option: _this.data.select_option,
                is_right: _this.data.isRight,
                score: _this.data.subject[subject_i].score
            }
        } else {
            _this.setData({
                select_option: _this.data.checkbox,
                isRight: 0
            })
            radio = {
                question: _this.data.subject[subject_i].id,
                sn: _this.data.subject[subject_i].sn,
                select_option: _this.data.select_option,
                is_right: _this.data.isRight,
                score: 0.00
            }
        }

        let answer = _this.data.answer.concat(radio);
        if (find.findIndex2(_this.data.answer, "question", radio.question) === -1) {
            _this.setData({
                answer: answer
            })
        } else {
            let answer_id = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].is_right"
            let select = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].select_option"
            let sn = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].sn"
            let question = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].question"
            let answer_score = "answer[" + find.findIndex2(_this.data.answer, "question", radio.question) + "].score"
            _this.setData({
                [question]: radio.question,
                [sn]: radio.sn,
                [select]: radio.select_option,
                [answer_id]: radio.is_right,
                [answer_score]: radio.score
            })
        }

        console.log(_this.data);
    },
    //切换题目
    subject_switch: function (e) {
        let type = e.currentTarget.dataset.type;
        let _this = this;
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
                    duration: 1000,
                })
            }
        }
    },
    browse: function (e) {
        let _this = this;
        wx.navigateTo({
            url: 'exam_all',
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromA', { data: _this.data })
            }
        })
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
        let _this = this
        wx.setNavigationBarTitle({
            title: "练习题"
        })

        //获取数据
        _this.loading_data_index()



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

    },
    loading_data_index: function () {
        let _this = this, elems = [], answers = [], all_sn = [];
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/searchBtStudentQuestionInfoByUser',
            data: {
                papers: 260
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
                        all_sn = _this.data.sn.concat(data[i].sn);
                        _this.setData({
                            sn: all_sn,
                            subject: data
                        })
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
                        showCancel:false,
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