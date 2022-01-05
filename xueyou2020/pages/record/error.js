const find = require('../../utils/fundIndex.js')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        papers: "",
        PageSize: 40,
        show: false,
        tips: null,
        type: null,//科目章节
        indexNumber: null,//用户退出后练习题保存的位置,进入练习题时用
        error_num: 1,//纠错
        error_val: null,

        totals: "",//序号
        total: 1,

        subject_id: 1,//题目排序
        subject_index: 1, //题目下标(js使用与展示页面无关)
        sn: [],
        answer: [],//用户所有答案
        isRight: null,
        is_show: [],//判断答案对错并且显示class
        subject: [],
        isEnd: true,
        isTop: true
    },


    // 切换题目
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
                if (_this.data.isRight !== null || find.indexOf3(_this.data.is_show, _this.data.sn[index - 1])) {
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

                    _this.setData({
                        subject_id: subject_index,
                        total: total_num
                    })
                }
            } else {
                //如果是最后一题就上传
                if (_this.data.isRight !== null || find.indexOf3(_this.data.is_show, _this.data.sn[index - 1])) {
                    let data_show = _this.data.is_show.concat(_this.data.sn[index - 1]);
                    _this.setData({
                        is_show: data_show,
                    })
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
    del_error: function (e) {
        let id = e.currentTarget.dataset.id, _this = this
        wx.showModal({
            title: '提示',
            content: '是否删除此条错题记录',
            success(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/clearWrongQuestion',
                        data: {
                            questionId: id
                        },
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'authorities': app.globalData.token
                        },
                        success: function (res) {
                            console.log(res);
                            let subject = _this.data.subject, sn = _this.data.sn, is_show = _this.data.is_show, answer = _this.data.answer
                            find.remove2(subject, "id", id)
                            find.remove2(answer, "question", id)
                            find.remove(is_show, id)
                            find.remove(sn, id)
                            if (_this.data.total == _this.data.totals) {
                                _this.setData({
                                    total: _this.data.totals - 1,
                                    subject_id: _this.data.subject_id - 1
                                })
                            }
                            _this.setData({
                                totals: _this.data.totals - 1,
                                sn: sn,
                                answer: answer,
                                subject: subject
                            })
                            wx.showToast({
                                title: '清除成功',
                                icon: 'none',
                                duration: 1000
                            })
                            if (_this.data.totals == 0) {
                                _this.setData({
                                    tips: "暂无数据"
                                })
                            }
                        }
                    })
                } else if (res.cancel) {
                }
            }
        })
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
        let _this = this, indexNumber = null;
        // //请求数据
        indexNumber = { page: 1 }
        _this.data.indexNumber = indexNumber
        _this.loading_data_index();
        console.log(_this.data);


        // wx.request({
        //     url: app.globalData.config.baseURL + '/webapi/btWebUserIndex/search',
        //     data: {
        //         subject: 0,
        //         chapter: 0,//查询所有这个科目下的章节
        //     },
        //     method: 'POST',
        //     header: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'authorities': app.globalData.token
        //     },
        //     success: function (res) {
        //         let data = res.data.data
        //         console.log(res.data);
        //         if (res.data.code == 1) {
        //             app.globalData.search_index = data
        //         }
        //         let id = find.findIndex2(app.globalData.search_index, "chapter", 0)
        //         if (id > -1 && id !== false) {
        //             indexNumber = app.globalData.search_index[id];
        //             let total_num = indexNumber.page * app.globalData.config.PageSize + indexNumber.indexNumber - app.globalData.config.PageSize
        //             _this.data.indexNumber = indexNumber
        //             _this.setData({
        //                 subject_id: indexNumber.indexNumber,
        //                 total: total_num
        //             })
        //         } else {
        //             indexNumber = { page: 1 }
        //             _this.data.indexNumber = indexNumber
        //         }
        //         _this.loading_data_index();
        //         console.log(_this.data);
        //     }
        // })

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
        // let _this = this, indexId = null, size = app.globalData.config.PageSize;
        // let indexNumber = _this.data.subject_id % size == 0 ? size : _this.data.subject_id % size
        // if (_this.data.indexNumber.id) {
        //     indexId = _this.data.indexNumber.id
        // } else {
        //     indexId = 0
        // }
        // wx.request({
        //     url: app.globalData.config.baseURL + '/webapi/btWebUserIndex/insertBtWebUserIndex',
        //     data: {
        //         idexId: indexId,
        //         subject: 0,//科目
        //         chapter: 0,//章节
        //         point: 0,//知识点
        //         page: _this.data.indexNumber.page,//页数
        //         indexNumber: indexNumber
        //     },
        //     method: 'POST',
        //     header: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'authorities': app.globalData.token
        //     },
        //     success: function (res) {
        //         console.log(res);
        //     }
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
            url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/searchWrongQuestion',
            data: {
                papers: _this.data.papers,
                PageNum: _this.data.indexNumber.page,
                PageSize: _this.data.PageSize //每页多少条数据
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                let datas = res.data, data = datas.data;
                console.log(datas);
                _this.setData({
                    totals: datas.total
                })
                if (datas.code == 1) {
                    for (let i = 0; i < data.length; i++) {
                        let elem = {}, answer = {};
                        _this.data.is_show = _this.data.is_show.concat(data[i].btQuestion.id);
                        answer.rightAnswer = data[i].btQuestion.rightAnswer;
                        answer.selectOption = data[i].selectOption
                        answer.question = data[i].btQuestion.id
                        answer.sn = data[i].btQuestion.id
                        answer.isRight = data[i].isRight
                        _this.data.answer = _this.data.answer.concat(answer);
                        // _this.setData({
                        //     is_show: data_show,
                        // })
                        all_sn = _this.data.sn.concat(data[i].btQuestion.id);
                        elem.id = data[i].btQuestion.id;
                        elem.sn = data[i].btQuestion.sn;
                        elem.type = data[i].btQuestion.type;
                        elem.name = data[i].btQuestion.name;
                        elem.option = data[i].btQuestion.btAnswerItemList;
                        elem.selectOption = data[i].selectOption
                        elems = _this.data.subject.concat(elem);
                        _this.setData({
                            sn: all_sn,
                            subject: elems
                        })
                    }
                    let answers = _this.data.answer
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
            url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/searchWrongQuestion',
            data: {
                papers: _this.data.papers,
                PageNum: _this.data.indexNumber.page + 1,
                PageSize: _this.data.PageSize //每页多少条数据
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
                        data_show.push(data[i].btQuestion.id)
                        answer.rightAnswer = data[i].btQuestion.rightAnswer;
                        answer.selectOption = data[i].selectOption
                        answer.question = data[i].btQuestion.id
                        answer.sn = data[i].btQuestion.sn
                        answer.isRight = data[i].isRight
                        answers = answers.concat(answer);
                        _this.setData({
                            is_show: data_show,
                            answer: answers
                        })
                        all_sn.push(data[i].btQuestion.id);
                        elem.id = data[i].btQuestion.id;
                        elem.sn = data[i].btQuestion.sn;
                        elem.type = data[i].btQuestion.type;
                        elem.name = data[i].btQuestion.name;
                        elem.option = data[i].btQuestion.btAnswerItemList;
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
                        content: '已经是最后一条了，是否清空错题本',
                        success(res) {
                            if (res.confirm) {
                                wx.request({
                                    url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/clearWrongQuestion',
                                    data: {},
                                    method: 'POST',
                                    header: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'authorities': app.globalData.token
                                    },
                                    success: function (res) {
                                        console.log(res);
                                        _this.setData({
                                            totals: 0,
                                            total: 0,
                                            subject_id: 1,
                                            sn: [],
                                            answer: [],
                                            subject: []
                                        })
                                        wx.showToast({
                                            title: '清除成功',
                                            icon: 'none',
                                            duration: 1000
                                        })
                                        if (_this.data.totals == 0) {
                                            _this.setData({
                                                tips: "暂无数据"
                                            })
                                        }
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
                url: app.globalData.config.baseURL + '/webapi/btStudentQuestionInfo/searchWrongQuestion',
                data: {
                    papers: _this.data.papers,
                    PageNum: _this.data.indexNumber.page - 1,
                    PageSize: _this.data.PageSize //每页多少条数据
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
                            data_show.push(data[i].btQuestion.id)
                            answer.rightAnswer = data[i].btQuestion.rightAnswer;
                            answer.selectOption = data[i].selectOption
                            answer.question = data[i].btQuestion.id
                            answer.sn = data[i].btQuestion.sn
                            answer.isRight = data[i].isRight
                            answers = answers.concat(answer);
                            _this.setData({
                                is_show: data_show,
                                answer: answers
                            })
                            all_sn.push(data[i].btQuestion.id);
                            elem.id = data[i].btQuestion.id;
                            elem.sn = data[i].btQuestion.sn;
                            elem.type = data[i].btQuestion.type;
                            elem.name = data[i].btQuestion.name;
                            elem.option = data[i].btQuestion.btAnswerItemList;
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
                duration: 1000
            })
        }
    },




})