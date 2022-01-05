// pages/coach/coach.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tips: "正在开发中",
        element: [],

    },
    tixing: function (e) {
        wx.showToast({
            title: '正在开发中',
            icon: 'none',
            mask: 'true',
            duration: 1000
        })
    },
    //跳转页面
    Jump_btn: function (e) {
        let type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: 'coach_details?key=' + type,
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
                if (res.data.code == 1) {
                    for (let i = 0; i < data.length; i++) {
                        let elem = {};
                        elem.title = data[i].dicvalue;
                        elem.type = data[i].uuid;
                        elem.key = data[i].dickey;
                        elem.color = "blue";
                        datas = _this.data.element.concat(elem);
                        _this.setData({
                            element: datas
                        })
                    }
                }else if (res.data.code == -3000) {
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