const find = require('../../utils/fundIndex.js')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        tips: null,
        type: null,//科目章节
        indexNumber: null,//用户退出后练习题保存的位置,进入练习题时用
        error_num: 1,//纠错
        error_val: null,

        totals: "",//序号
        total: 1,

        page_title: "语文",//考试科目
        exam_time: "59:59",//考试剩余时间
        subject_id: 1,//题目排序
        subject_index: 1, //题目下标(js使用与展示页面无关)
        sn: [],
        answer: [],//用户所有答案
        select_option: null,//用户单题答案
        isRight: null,
        is_show: [],//判断答案对错并且显示class
        checkbox: [],//多项选择临时答案
        subject: [],
        isEnd: true,
        isTop: true
    },
    //单项选择
    radio_click: function (e) {
        let _this = this, radio = [];
        let subject_i = this.data.subject_id - 1;
        let that = this.data.subject[subject_i].option;
        let index = e.currentTarget.dataset.name;
        for (let i = 0; i < that.length; i++) {
            if (that[i].sn == index) {
                let topIndex = "subject[" + subject_i + "].option[" + i + "].topIndex";
                _this.setData({
                    [topIndex]: 1,
                })
                let isRight = find.findIndex(_this.data.subject[subject_i].option, "isRight", 1)
                if (isRight == i + 1) {
                    _this.setData({
                        isRight: 1,
                        select_option: _this.data.subject[subject_i].option[i].id
                    })
                    radio = {
                        question: _this.data.subject[subject_i].id,
                        selectOption: index,
                        sn: _this.data.subject[subject_i].sn,
                        select_option: _this.data.select_option,
                        is_right: _this.data.isRight,
                        rightAnswer: isRight
                    }
                } else {
                    _this.setData({
                        isRight: 0,
                        select_option: _this.data.subject[subject_i].option[i].id,
                    })
                    radio = {
                        question: _this.data.subject[subject_i].id,
                        selectOption: index,
                        sn: _this.data.subject[subject_i].sn,
                        select_option: _this.data.select_option,
                        is_right: _this.data.isRight,
                        rightAnswer: isRight
                    }
                }

            } else {
                let topIndex = "subject[" + subject_i + "].option[" + i + "].topIndex";
                _this.setData({
                    [topIndex]: 0,
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
            _this.setData({
                [answer_is]: radio.is_right,
                [answer_right]: radio.rightAnswer,
                [answer_sn]: radio.sn,
                [answer_selectOption]: radio.selectOption,
                [answer_select]: radio.select_option
            })
        }
    },
    //多项选择
    checkbox_click: function (e) {
        let _this = this, radio = [];
        let subject_i = this.data.subject_id - 1;
        let that = this.data.subject[subject_i].option;
        let index = e.currentTarget.dataset.name;
        for (let i = 0; i < that.length; i++) {
            if (that[i].sn == index) {
                let topIndex = "subject[" + subject_i + "].option[" + i + "].topIndex";
                if (that[i].topIndex == 1) {
                    find.remove(_this.data.checkbox, _this.data.subject[subject_i].option[i].id);
                    _this.setData({
                        [topIndex]: 0,
                    })
                } else {
                    let topIndex = "subject[" + subject_i + "].option[" + i + "].topIndex";
                    _this.data.checkbox.push(_this.data.subject[subject_i].option[i].id);
                    _this.setData({
                        [topIndex]: 1,
                    })
                }
            }
        }

        let isRight = find.findIndex4(_this.data.subject[subject_i].option, "isRight", 1, "id")
        if (isRight.sort().toString() == _this.data.checkbox.sort().toString()) {
            _this.setData({
                isRight: 1,
                select_option: _this.data.checkbox
            })
            radio = {
                question: _this.data.subject[subject_i].id,
                sn: _this.data.subject[subject_i].sn,
                select_option: _this.data.select_option,
                is_right: _this.data.isRight
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
                is_right: _this.data.isRight
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
            _this.setData({
                [question]: radio.question,
                [sn]: radio.sn,
                [select]: radio.select_option,
                [answer_id]: radio.is_right
            })
        }

    },
    //切换题目
    subject_switch: function (e) {
        let type = e.currentTarget.dataset.type;
        let _this = this;
        if (type == "top") {
            let index = _this.data.subject_id;
            if (index >= 1) {
                let subject_index = index - 1
                _this.setData({
                    subject_index: subject_index,
                })
                let total_num = _this.data.total - 1
                if (_this.data.subject_index < 1 && _this.data.isTop == true) {
                    subject_index = app.globalData.config.PageSize
                } else if (_this.data.subject_index < 1 && _this.data.isTop == false) {
                    subject_index = _this.data.subject_index + 1
                    total_num = total_num + 1
                }
                // let total_num = _this.data.indexNumber.page * app.globalData.config.PageSize + subject_index - app.globalData.config.PageSize

                _this.setData({
                    subject_id: subject_index,
                    total: total_num
                })
            }
            console.log(_this.data);
        } else {
            let index = _this.data.subject_id;
            if (index <= _this.data.subject.length) {
                if (find.indexOf2(_this.data.answer, 'question', find.findIndex_all(_this.data.subject, "sn", _this.data.sn[index - 1], "id"))) {
                    if (_this.data.isRight !== null || find.indexOf3(_this.data.is_show, _this.data.sn[index - 1])) {
                        //判断题目是否错误,如果错误就不进入下一题
                        if (_this.data.isRight == null || _this.data.isRight == 1) {
                            let subject_index = index + 1
                            _this.setData({
                                subject_index: subject_index,
                            })
                            let total_num = _this.data.total + 1
                            if (_this.data.subject_index > _this.data.subject.length && _this.data.isEnd == true) {
                                subject_index = 1

                            } else if (_this.data.subject_index > _this.data.subject.length && _this.data.isEnd == false) {
                                subject_index = _this.data.subject_index - 1
                                total_num = total_num - 1

                            }

                            // let total_num = _this.data.indexNumber.page * app.globalData.config.PageSize + subject_index - app.globalData.config.PageSize

                            _this.setData({
                                subject_id: subject_index,
                                total: total_num
                            })
                        }
                        //判断题目是否做了,如果做了就上传题目并且显示对错
                        let id = find.indexOf(_this.data.is_show, _this.data.sn[index - 1])
                        if (id == -1) {
                            let id = find.findIndex2(_this.data.answer, "sn", _this.data.sn[index - 1])
                            _this.Submit(_this.data.answer[id].question, _this.data.answer[id].select_option, _this.data.answer[id].is_right)
                            let data_show = _this.data.is_show.concat(_this.data.sn[index - 1]);
                            _this.setData({
                                is_show: data_show,
                            })
                        }
                    }
                } else {
                    wx.showToast({
                        title: '请先完成题目',
                        icon: 'none',
                        duration: 600
                    })
                }
            } else {
                //如果是最后一题就上传
                if (_this.data.isRight !== null || find.indexOf3(_this.data.is_show, _this.data.sn[index - 1])) {
                    let data_show = _this.data.is_show.concat(_this.data.sn[index - 1]);
                    _this.setData({
                        is_show: data_show,
                    })
                    let id = find.findIndex2(_this.data.answer, "sn", index)
                    _this.Submit(_this.data.answer[id].question, _this.data.answer[id].select_option, _this.data.answer[id].is_right)
                }
            }
            console.log(_this.data);

        }
        _this.setData({
            select_option: null,
            isRight: null,
            checkbox: [],
        })
    },
    //提交题目
    Submit: function (question, select, isRight) {
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/insertBtStudentQuestionInfoFormPractice',
            data: {
                question: question,
                selectOption: select,
                isRight: isRight,
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {

            }
        })
    },
    correct_error: function (e) {
        let _this = this
        let id = find.find_value_byindex(_this.data.subject, _this.data.subject_id, "id",)
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/userCorrect/checkIsAvailable',
            data: {
                question: id
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                if (res.data.code == 1) {
                    _this.setData({
                        modalName: e.currentTarget.dataset.target
                    })

                } else {
                    wx.showModal({
                        title: '提示',
                        content: '其他人已提交此题错误，正在更正中',
                        showCancel: false,
                        success(res) {

                        }
                    })
                }


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
    bindTextAreaBlur: function (e) {
        let value = e.detail.value
        this.data.error_val = value

    },
    submit_error: function (e) {
        let _this = this
        let id = find.find_value_byindex(_this.data.subject, _this.data.subject_id, "id",)
        if (_this.data.error_val !== null) {
            wx.request({
                url: app.globalData.config.baseURL + '/webapi/userCorrect/addUserCorrect',
                data: {
                    question: id,
                    contents: _this.data.error_val

                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authorities': app.globalData.token
                },
                success: function (res) {
                    _this.data.error_val = null
                    _this.hideModal()
                }
            })
        }

    },
    remove_error: function (e) {
        let _this = this
        _this.data.error_val = null
        _this.hideModal()

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let type = JSON.parse(options.index);
        let _this = this, indexNumber = null, id = null;
        _this.setData({
            type: type,
        })
        if (app.globalData.search_index) {
            id = find.findIndex_all(app.globalData.search_index, "chapter", type.chapter, "indexNumber")
        } else {
            id = -1
        }
        if (id > 1) {
            wx.showModal({
                title: '提示',
                content: '是否继续练习,取消则重新开始',
                success(res) {
                    if (res.confirm) {
                        //请求数据
                        let id = find.findIndex2(app.globalData.search_index, "chapter", type.chapter)
                        if (id > -1 && id !== false) {
                            indexNumber = app.globalData.search_index[id];
                            let total_num = indexNumber.page * app.globalData.config.PageSize + indexNumber.indexNumber - app.globalData.config.PageSize
                            _this.data.indexNumber = indexNumber
                            _this.setData({
                                subject_id: indexNumber.indexNumber,
                                total: total_num
                            })
                        } else {
                            indexNumber = { page: 1 }
                            _this.data.indexNumber = indexNumber
                            _this.data.type = type
                        }
                        _this.loading_data_index();
                        _this.setData({
                            show: true
                        })
                    } else if (res.cancel) {
                        wx.request({
                            url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/clearBtStudentQuestionInfoByChapter',
                            data: {
                                chapter: _this.data.type.chapter
                            },
                            method: 'POST',
                            header: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'authorities': app.globalData.token
                            },
                            success: function (res) {
                                console.log(res);
                                app.globalData.search_index = ""
                                let indexNumber = { page: 1 }
                                _this.data.indexNumber = indexNumber
                                _this.loading_data_index();
                                _this.setData({
                                    show: true
                                })
                            }
                        })

                    }
                }
            })
        } else {
            indexNumber = { page: 1 }
            _this.data.indexNumber = indexNumber
            _this.data.type = type
            _this.loading_data_index();
            _this.setData({
                show: true
            })
        }
        console.log(_this.data);



        //监听数据变化
        app.setWatcher(_this);
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
     * 生命周期函数--监听页面卸载(返回上一页)
     */
    onUnload: function () {
        let _this = this, indexId = null, size = app.globalData.config.PageSize;
        let indexNumber = _this.data.subject_id % size == 0 ? size : _this.data.subject_id % size
        if (_this.data.indexNumber.id) {
            indexId = _this.data.indexNumber.id
        } else {
            indexId = 0
        }
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btWebUserIndex/insertBtWebUserIndex',
            data: {
                idexId: indexId,
                subject: _this.data.type.subject,//科目
                chapter: _this.data.type.chapter,//章节
                point: 0,//知识点
                page: _this.data.indexNumber.page,//页数
                indexNumber: indexNumber
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
            }
        })
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btWebUserIndex/search',
            data: {
                subject: _this.data.type.subject,
                chapter: 0,//查询所有这个科目下的章节
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                let data = res.data.data
                app.globalData.search_index = data
            }
        })

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

    watch: {
        subject_index: function (data) {
            var _this = this;
            if (data > _this.data.subject.length) {
                _this.loading_data_down()
            } else if (data < 1) {
                _this.loading_data_top()
            }

        }
    },

    loading_data_index: function () {
        let _this = this, elems = [], answers = [], all_sn = [];
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btQuestion/searchQuestionForChapter',
            data: {
                subject: _this.data.type.subject,
                chapter: _this.data.type.chapter,
                platform: 2,//平台 手机端
                PageNum: _this.data.indexNumber.page,
                PageSize: app.globalData.config.PageSize //每页多少条数据
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                let datas = res.data, data = datas.data;
                _this.setData({
                    totals: datas.total
                })
                if (datas.code == 1) {
                    for (let i = 0; i < data.length; i++) {
                        let elem = {}, answer = {};
                        if (data[i].isFinish == 1) {
                            let data_show = _this.data.is_show.concat(data[i].sn);
                            answer = data[i].btStudentQuestionInfos;
                            answers = _this.data.answer.concat(answer);
                            _this.setData({
                                is_show: data_show,
                                answer: answers
                            })
                        }
                        all_sn = _this.data.sn.concat(data[i].sn);
                        elem.id = data[i].id;
                        elem.sn = data[i].sn;
                        elem.type = data[i].type;
                        elem.name = data[i].name;
                        elem.isFinish = data[i].isFinish;
                        elem.option = data[i].btAnswerItemList;
                        elems = _this.data.subject.concat(elem);
                        _this.setData({
                            sn: all_sn,
                            subject: elems
                        })
                    }
                    if (answers.length) {
                        for (let i = 0; i < answers.length; i++) {
                            let id = find.findIndex2(_this.data.subject, "id", answers[i].question);
                            let option = _this.data.subject[id].option, select = answers[i].selectOption.toString().split(',');
                            for (let q = 0; q < select.length; q++) {
                                for (let j = 0; j < option.length; j++) {
                                    if (select[q] == option[j].id) {
                                        let topIndex = "subject[" + id + "].option[" + j + "].topIndex"
                                        _this.setData({
                                            [topIndex]: 1,
                                        })
                                    }
                                }
                            }
                        }
                    }
                    let nums = datas.total, is_end, is_top;
                    let num = nums - app.globalData.config.PageSize * (_this.data.indexNumber.page)
                    if (num >= 1) {
                        is_end = true
                    } else {
                        is_end = false
                    }
                    if (_this.data.indexNumber.page >= 2) {
                        is_top = true
                    } else {
                        is_top = false
                    }
                    _this.setData({
                        isEnd: is_end,
                        isTop: is_top
                    })
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
    loading_data_down: function () {
        let _this = this, elems = [], answers = [], all_sn = [];
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btQuestion/searchQuestionForChapter',
            data: {
                subject: _this.data.type.subject,
                chapter: _this.data.type.chapter,
                platform: 2,//平台 手机端
                PageNum: _this.data.indexNumber.page + 1,
                PageSize: app.globalData.config.PageSize //每页多少条数据
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                let datas = res.data, data = datas.data, data_show = [];
                if (datas.code == 1) {
                    for (let i = 0; i < data.length; i++) {
                        let elem = {}, answer = {};
                        if (data[i].isFinish == 1) {
                            data_show.push(data[i].sn);
                            answer = data[i].btStudentQuestionInfos;
                            answers = answers.concat(answer);
                            _this.setData({
                                is_show: data_show,
                                answer: answers
                            })
                        }
                        all_sn.push(data[i].sn);
                        elem.id = data[i].id;
                        elem.sn = data[i].sn;
                        elem.type = data[i].type;
                        elem.name = data[i].name;
                        elem.isFinish = data[i].isFinish;
                        elem.option = data[i].btAnswerItemList;
                        elems = elems.concat(elem);
                        _this.setData({
                            sn: all_sn,
                            subject: elems
                        })
                    }
                    if (answers.length) {
                        for (let i = 0; i < answers.length; i++) {
                            let id = find.findIndex2(_this.data.subject, "id", answers[i].question);
                            let option = _this.data.subject[id].option, select = answers[i].selectOption.toString().split(',');
                            for (let q = 0; q < select.length; q++) {
                                for (let j = 0; j < option.length; j++) {
                                    if (select[q] == option[j].id) {
                                        let topIndex = "subject[" + id + "].option[" + j + "].topIndex"
                                        _this.setData({
                                            [topIndex]: 1,
                                        })
                                    }
                                }
                            }
                        }
                    }
                    let indexNumber = "indexNumber.page", nums = datas.total, is_end, is_top;
                    let num = nums - app.globalData.config.PageSize * (_this.data.indexNumber.page + 1)
                    if (num >= 1) {
                        is_end = true
                    } else {
                        is_end = false
                    }
                    if (_this.data.indexNumber.page >= 1) {
                        is_top = true
                    } else {
                        is_top = false
                    }
                    _this.setData({
                        [indexNumber]: _this.data.indexNumber.page + 1,
                        isEnd: is_end,
                        isTop: is_top
                    })
                } else if (datas.code == -3000) {
                    wx.showModal({
                        title: '提示',
                        content: '已经是最后一题了是否重新练习',
                        success(res) {
                            if (res.confirm) {
                                wx.request({
                                    url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/clearBtStudentQuestionInfoByChapter',
                                    data: {
                                        chapter: _this.data.type.chapter
                                    },
                                    method: 'POST',
                                    header: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'authorities': app.globalData.token
                                    },
                                    success: function (res) {
                                        console.log(res);
                                        app.globalData.search_index = ""
                                        _this.setData({
                                            tips: null,
                                            indexNumber: null,//用户退出后练习题保存的位置,进入练习题时用
                                            totals: "",//序号
                                            total: 1,
                                            subject_id: 1,//题目排序
                                            subject_index: 1, //题目下标(js使用与展示页面无关)
                                            sn: [],
                                            answer: [],//用户所有答案
                                            select_option: null,//用户单题答案
                                            isRight: null,
                                            is_show: [],//判断答案对错并且显示class
                                            checkbox: [],//多项选择临时答案
                                            subject: [],
                                            isEnd: true,
                                            isTop: true
                                        })
                                        let indexNumber = { page: 1 }
                                        _this.data.indexNumber = indexNumber
                                        _this.loading_data_index();
                                    }
                                })
                            } else if (res.cancel) {
                            }
                        }
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
    loading_data_top: function () {
        let _this = this, elems = [], answers = [], all_sn = [];
        if (_this.data.indexNumber.page >= 2) {
            wx.request({
                url: app.globalData.config.baseURL + '/webapi/btQuestion/searchQuestionForChapter',
                data: {
                    subject: _this.data.type.subject,
                    chapter: _this.data.type.chapter,
                    platform: 2,//平台 手机端
                    PageNum: _this.data.indexNumber.page - 1,
                    PageSize: app.globalData.config.PageSize //每页多少条数据
                },
                method: 'POST',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authorities': app.globalData.token
                },
                success: function (res) {
                    let datas = res.data, data = datas.data, data_show = [];
                    if (datas.code == 1) {
                        for (let i = 0; i < data.length; i++) {
                            let elem = {}, answer = {};
                            if (data[i].isFinish == 1) {
                                data_show.push(data[i].sn);
                                answer = data[i].btStudentQuestionInfos;
                                answers = answers.concat(answer);
                                _this.setData({
                                    is_show: data_show,
                                    answer: answers
                                })
                            }
                            all_sn.push(data[i].sn);
                            elem.id = data[i].id;
                            elem.sn = data[i].sn;
                            elem.type = data[i].type;
                            elem.name = data[i].name;
                            elem.isFinish = data[i].isFinish;
                            elem.option = data[i].btAnswerItemList;
                            elems = elems.concat(elem);
                            _this.setData({
                                sn: all_sn,
                                subject: elems
                            })
                        }
                        if (answers.length) {
                            for (let i = 0; i < answers.length; i++) {
                                let id = find.findIndex2(_this.data.subject, "id", answers[i].question);
                                let option = _this.data.subject[id].option, select = answers[i].selectOption.toString().split(',');
                                for (let q = 0; q < select.length; q++) {
                                    for (let j = 0; j < option.length; j++) {
                                        if (select[q] == option[j].id) {
                                            let topIndex = "subject[" + id + "].option[" + j + "].topIndex"
                                            _this.setData({
                                                [topIndex]: 1,
                                            })
                                        }
                                    }
                                }
                            }
                        }
                        let indexNumber = "indexNumber.page", is_top, is_end, nums = datas.total;
                        if (_this.data.indexNumber.page - 1 >= 2) {
                            is_top = true
                        } else {
                            is_top = false
                        }
                        let num = nums - app.globalData.config.PageSize * (_this.data.indexNumber.page - 1)
                        if (num >= 1) {
                            is_end = true
                        } else {
                            is_end = false
                        }
                        _this.setData({
                            [indexNumber]: _this.data.indexNumber.page - 1,
                            isEnd: is_end,
                            isTop: is_top
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
        } else {
            wx.showToast({
                title: '已经是第一题了',
                icon: 'none',
                mask: 'true',
                duration: 1000
            })
        }
    },




})