// pages/library/library_ wrong.js
const find = require('../../utils/fundIndex.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page_title: "语文",//考试科目
        exam_time: "59:59",//考试剩余时间
        subject_id: 1,//题目排序
        answer: [],//用户答案
        checkbox: [],//多项选择临时答案
        subject: []
    },

    //单项选择
    radio_click: function (e) {
        let _this = this, radio = [];
        let subject_i = this.data.subject_id - 1;
        let that = this.data.subject[subject_i].option;
        let index = e.currentTarget.dataset.name;
        for (let i = 0; i < that.length; i++) {
            if (that[i].index == index) {
                let topindex = "subject[" + subject_i + "].option[" + i + "].TopIndex";
                _this.setData({
                    [topindex]: 1,
                })
            } else {
                let topindex = "subject[" + subject_i + "].option[" + i + "].TopIndex";
                _this.setData({
                    [topindex]: 0,
                })
            }
        }

        radio = {
            id: _this.data.subject_id,
            type: "radio",
            text: index
        }

        let answer = _this.data.answer.concat(radio);
        if (find.findIndex(_this.data.answer, "id", radio.id) === -1) {
            _this.setData({
                answer: answer
            })
        } else {
            let answer_id = "answer[" + find.findIndex(_this.data.answer, "id", radio.id) + "].text"
            _this.setData({
                [answer_id]: index
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
            if (that[i].index == index) {
                let topindex = "subject[" + subject_i + "].option[" + i + "].TopIndex";
                if (that[i].TopIndex == 1) {
                    find.remove(_this.data.checkbox, index);
                    _this.setData({
                        [topindex]: 0,
                    })
                } else {
                    let topindex = "subject[" + subject_i + "].option[" + i + "].TopIndex";
                    _this.data.checkbox.push(index);
                    _this.setData({
                        [topindex]: 1,
                    })
                }
            }
        }
        radio = {
            id: _this.data.subject_id,
            type: "checkbox",
            text: _this.data.checkbox
        }

        let answer = _this.data.answer.concat(radio);
        if (find.findIndex(_this.data.answer, "id", radio.id) === -1) {
            _this.setData({
                answer: answer
            })
        } else {
            let answer_id = "answer[" + find.findIndex(_this.data.answer, "id", radio.id) + "].text"
            _this.setData({
                [answer_id]: _this.data.checkbox
            })
        }


    },
    //判断题
    judge_click: function (e) {
        let _this = this, radio = [];
        let subject_i = this.data.subject_id - 1;
        let index = e.currentTarget.dataset.name;
        let topindex = "subject[" + subject_i + "].TopIndex";
        _this.setData({
            [topindex]: index,
        })
        radio = {
            id: _this.data.subject_id,
            type: "judge",
            text: index
        }
        let answer = _this.data.answer.concat(radio);
        if (find.findIndex(_this.data.answer, "id", radio.id) === -1) {
            _this.setData({
                answer: answer
            })
        } else {
            let answer_id = "answer[" + find.findIndex(_this.data.answer, "id", radio.id) + "].text"
            _this.setData({
                [answer_id]: index
            })
        }

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
    let that = this, data = [
        {
            id: 1,
            type: "radio",
            number: "5.0",
            title: '<img src="https://www.baidu.com/img/flexible/logo/pc/result.png">',
            option: [
                {
                    index: "A",
                    text: "千里逢迎",
                    TopIndex: 0
                },
                {
                    index: "B",
                    text: "孟学士之词宗",
                    TopIndex: 0
                },
                {
                    index: "C",
                    text: "千里逢迎",
                    TopIndex: 0
                },
                {
                    index: "D",
                    text: "孟学士之词宗",
                    TopIndex: 0
                },
            ]
        },
        {
            id: 2,
            type: "checkbox",
            number: "10.0",
            title: "多项选择题()",
            option: [
                {
                    index: "A",
                    text: "123",
                    TopIndex: 0
                },
                {
                    index: "B",
                    text: "456",
                    TopIndex: 0
                },
                {
                    index: "C",
                    text: "789",
                    TopIndex: 0
                },
                {
                    index: "D",
                    text: "1234",
                    TopIndex: 0
                },
            ]
        },
        {
            id: 3,
            type: "judge",
            number: "10.0",
            title: '<img src="https://www.baidu.com/img/flexible/logo/pc/result.png">',
            TopIndex: ""//A:对，B:错
        },
    ];
    that.setData({
        subject: data,
    })

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