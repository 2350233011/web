const find = require('../../utils/fundIndex.js')
const app = getApp()
const timer = require('../../utils/wxTimer.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tips: null,
        // page_title: "语文",//考试科目
        exam_time: "59:59",//考试剩余时间
        wxTimerList: {},//计时器
        exam_details: null,//考试详情
        subject_kind: null,//考试分类
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
    //选择科目
    jump_subject: function (e) {
        let index = e.currentTarget.dataset.index, num = e.currentTarget.dataset.num, _this = this;
        let subject_nums = 0, kind = _this.data.subject_kind;
        for (let i = 0; i < kind.length; i++) {
            if (i < index) {
                subject_nums = subject_nums + Number(kind[i].num)
            }
        }
        _this.setData({
            subject_id:subject_nums+1
        })



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
                let id = find.findIndex2(_this.data.answer, "sn", _this.data.sn[index - 1])
                if (id > -1) {
                    _this.Submit(_this.data.answer[id].question, _this.data.answer[id].select_option, _this.data.answer[id].score, _this.data.answer[id].is_right)
                }
            } else {
                let id = find.findIndex2(_this.data.answer, "sn", _this.data.sn[index - 1])
                if (id > -1) {
                    _this.Submit(_this.data.answer[id].question, _this.data.answer[id].select_option, _this.data.answer[id].score, _this.data.answer[id].is_right)
                }
                wx.showToast({
                    title: '已经是最后一题了',
                    icon: 'none',
                    mask: 'true',
                    duration: 1500,
                    success: function () {
                        setTimeout(function () {
                            wx.navigateTo({
                                url: 'exam_all',
                                // events: {
                                //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                                //   acceptDataFromB: function(data) {
                                //     console.log(data)
                                //   },
                                // },
                                success: function (res) {
                                    // 通过eventChannel向被打开页面传送数据
                                    res.eventChannel.emit('acceptDataFromA', { data: _this.data })
                                }
                            })
                        }, 1000);
                    }
                })
            }
        }
    },

    //提交题目
    Submit: function (id, select, score, isRight) {
        console.log(id, select, score, isRight);
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/insertBtStudentQuestionInfoFormExam',
            data: {
                id: id,
                selectOption: select,
                score: score,//分数
                isRight: isRight,
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
        let eventChannel = _this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromA', function (data) {
            _this.setData({
                exam_details: data.data
            }, function () {
                let fssz1 = data.data.fssz, fssz2 = fssz1.split(",")
                let subjects = []
                for (let i = 0; i < fssz2.length; i++) {
                    let fssz3 = fssz2[i].split("|"), subject = {};
                    switch (fssz3[0]) {
                        case "1":
                            subject.sub = "语文"
                            subject.num = Number(fssz3[2])
                            if (Number(fssz3[2]) != 0) {
                                subjects = subjects.concat(subject)
                            }
                            break
                        case "2":
                            subject.sub = "数学"
                            subject.num = Number(fssz3[2])
                            if (Number(fssz3[2]) != 0) {
                                subjects = subjects.concat(subject)
                            }
                            break
                        case "3":
                            subject.sub = "英语"
                            subject.num = Number(fssz3[2])
                            if (Number(fssz3[2]) != 0) {
                                subjects = subjects.concat(subject)
                            }
                            break
                        case "4":
                            subject.sub = "政治"
                            subject.num = Number(fssz3[2])
                            if (Number(fssz3[2]) != 0) {
                                subjects = subjects.concat(subject)
                            }
                            break
                    }
                }
                _this.setData({
                    subject_kind: subjects
                })
                // console.log(subjects);

                //获取数据
                _this.loading_data_index()
            })
        })
        console.log(_this.data);



        // //倒计时
        // let t1 = _this.data.exam_details.time; //数据
        // let t2 = new Date(t1);
        // t2.setMinutes(t2.getMinutes()+_this.data.exam_details.timeLength); //数据
        // console.log(t2);
        // let time = _this.timeFn(t1, t2);

        // var wxTimer = new timer({
        //     beginTime: time,
        //     complete: function () {
        //         console.log("完成了")
        //     }
        // })
        // wxTimer.start(_this);



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
        // wx.enableAlertBeforeUnload({
        //     message: "测试是否返回",
        //     success: function (res) {
        //         console.log('cat res:', res)
        //     },
        //     fail:
        //         function (err) {
        //             console.error(err)
        //         }
        // })
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
        let _this = this, elems = [], answers = [], all_sn = _this.data.sn;
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
                        if (data[i].answerTimes > 0) {
                            let answer = {}
                            answer.isRight = data[i].isRight
                            answer.question = data[i].question
                            answer.rightAnswer = data[i].btQuestion.rightAnswer
                            answer.score = data[i].score
                            answer.select_option = data[i].selectOption
                            answer.sn = data[i].sn
                            answers = answers.concat(answer)
                        }
                    }
                    _this.setData({
                        sn: all_sn,
                        subject: data,
                        answer:answers
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


                } else if (datas.code == -3000) {
                    _this.setData({
                        tips: "暂无数据"
                    })
                    wx.showToast({
                        title: '暂无数据',
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
    //获取日期之差
    timeFn: function (d1, d2) {//di作为一个变量传进来
        //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
        var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
        var dateEnd = new Date(d2);
        var time = new Date();
        if (time.getTime() > dateBegin.getTime()) {
            dateBegin = time
        }
        var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
        var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
        var hours = Math.floor(dateDiff / (3600 * 1000))//计算出小时数
        //计算相差分钟数
        var leave2 = dateDiff % (3600 * 1000)    //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000)
        // console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
        return hours + ":" + minutes + ":" + seconds
    },




})