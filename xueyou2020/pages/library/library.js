// pages/library/library_complete/library_complete.js
const find = require('../../utils/fundIndex.js')
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        element: [
            {
                title: "错题",
                type: "cuoti",
                color: "blue"
            },
            {
                title: "收藏",
                type: "shoucang",
                color: "blue"
            }

        ],
        elements: []
    },
    //跳转页面
    Jump_btn: function (e) {
        let type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: 'library_details?key=' + type,
        });
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this, datas = [];
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
                for (let i = 0; i < data.length; i++) {
                    let elem = {};
                    elem.title = data[i].dicvalue;
                    elem.type = data[i].uuid;
                    elem.key = data[i].dickey;
                    elem.color = "blue";
                    datas = _this.data.elements.concat(elem);
                    _this.setData({
                        elements: datas
                    })
                }
            }
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

    //刷新
    onRefresh: function () {
        //在当前页面显示导航条加载动画
        wx.showNavigationBarLoading();
        this.getData();
    },
    //网络请求，获取数据
    getData: function () {
        let _this = this, datas = [];
        _this.setData({
            elements: []
        })
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/sysDic/searchDicGroup',
            data: {
                dicGroup: '科目'
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': app.globalData.token
            },
            success: function (res) {
                let data = res.data.data;
                for (let i = 0; i < data.length; i++) {
                    let elem = {};
                    elem.title = data[i].dicvalue;
                    elem.type = data[i].uuid;
                    elem.key = data[i].dickey;
                    elem.color = "blue";
                    datas = _this.data.elements.concat(elem);
                    _this.setData({
                        elements: datas
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

    }
})