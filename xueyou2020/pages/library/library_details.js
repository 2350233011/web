// pages/library/library_details.js
const find = require('../../utils/fundIndex.js')
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tips: null,
        total: "",
        type: {
            subject: null,
            chapter: null
        },
        library: []
    },
    //点击进入正在进行的页面
    conduct_exam: function (e) {
        let index = e.currentTarget.dataset.target, _this = this, type_chapter = "type.chapter";
        _this.setData({
            [type_chapter]: index
        })
        wx.navigateTo({
            url: 'library_complete?index=' + JSON.stringify(_this.data.type),
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let key = options.key, _this = this, type_subject = "type.subject";
        _this.setData({
            [type_subject]: key
        })
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btChapter/searchBtChapter',
            data: {
                fid: '0',
                subject: key,
                PageNum: '1',
                PageSize: '50'
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorities': app.globalData.token
            },
            success: function (res) {
                if (res.data.code == 1) {
                    _this.setData({
                        total: res.data.total,
                        library: res.data.data
                    })
                } else if (res.data.code == -3000) {
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
        wx.request({
            url: app.globalData.config.baseURL + '/webapi/btWebUserIndex/search',
            data: {
                subject: key,
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
        //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
        wx.showLoading({
            title: '刷新中...',
        })
        this.getData();
    },
    //网络请求，获取数据
    getData: function () {
        wx.request({
            url: '',
            //网络请求执行完后将执行的动作
            complete(res) {
                //隐藏loading 提示框
                wx.hideLoading();
                //隐藏导航条加载动画
                wx.hideNavigationBarLoading();
                //停止下拉刷新
                wx.stopPullDownRefresh();
            }
        })
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