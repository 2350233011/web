// pages/index/Ranking.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tips: null,
        tabFix:"",
        ranking: [
            {
                phone: "156****6178",
                name: "张三",
                school: "济南市体校",
                num: "13"
            },
            {
                phone: "156****6178",
                name: "李四",
                school: "济南市体校",
                num: "10"
            },
            {
                phone: "156****6178",
                name: "王五",
                school: "济南市体校",
                num: "9"
            },
            {
                phone: "156****6178",
                name: "赵六",
                school: "济南市体校",
                num: "8"
            },
            {
                phone: "156****6178",
                name: "张三",
                school: "济南市体校",
                num: "7"
            },
            {
                phone: "156****6178",
                name: "张三",
                school: "济南市体校",
                num: "7"
            },
            {
                phone: "156****6178",
                name: "李四",
                school: "济南市体校",
                num: "7"
            },
            {
                phone: "156****6178",
                name: "王五",
                school: "济南市体校",
                num: "6"
            },
            {
                phone: "156****6178",
                name: "赵六",
                school: "济南市体校",
                num: "6"
            },
            {
                phone: "156****6178",
                name: "张三",
                school: "济南市体校",
                num: "5"
            },
            {
                phone: "156****6178",
                name: "张三",
                school: "济南市体校",
                num: "5"
            },
            {
                phone: "156****6178",
                name: "张三",
                school: "济南市体校",
                num: "5"
            },
            {
                phone: "156****6178",
                name: "李四",
                school: "济南市体校",
                num: "4"
            },
            {
                phone: "156****6178",
                name: "王五",
                school: "济南市体校",
                num: "4"
            },
            {
                phone: "156****6178",
                name: "赵六",
                school: "济南市体校",
                num: "4"
            },
            {
                phone: "156****6178",
                name: "张三",
                school: "济南市体校",
                num: "3"
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        let me = this;
        //获取tab的距离顶部高度
        const query = wx.createSelectorQuery();
        query.select('#tab').boundingClientRect(function (res) {
            // console.log(res.top)
            me.data.tabTop = res.top
        }).exec();

    },
    onPageScroll: function (e) {
        let me = this;
        //tab的吸顶效果
        // console.log(e.scrollTop > me.data.tabTop)
        if (e.scrollTop > me.data.tabTop) {
            if (me.data.tabFix) {
                return
            } else {
                me.setData({
                    tabFix: 'Fixed'
                })
            }
        } else {
            me.setData({
                tabFix: ''
            })
        }
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