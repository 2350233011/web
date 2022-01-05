// pages/coach/coach_details.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        library: [],
        type: {
            subject: null,
            point: null
        },
    },

    //点击进入正在进行的页面
    conduct_exam: function (e) {
        let index = e.currentTarget.dataset.target, _this = this, type_point = "type.point";
        _this.setData({
            [type_point]: index
        })
        wx.navigateTo({
            url: 'coach_details2?index=' + JSON.stringify(_this.data.type),
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let key = options.key, _this = this, datas = [], type_subject = "type.subject";
        _this.setData({
            [type_subject]: key
        })
        wx.request({
            // url: app.globalData.config.baseURL + '/webapi/btPoint/searchBtPoint',
            url: "https://exam.youmengxinxi.com:10021/admin/api/btPoint/searchBtPoint",
            data: {
                fid: '0',
                subject: key,
                PageNum: '1',
                PageSize: '50'
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'authorities': app.globalData.token
                'authorities': '308d63f4-c235-407b-8566-160971b1e994'
            },
            success: function (res) {
                console.log(res);
                if (res.data.code == 1) {
                    let data = res.data.content;
                    for (let i = 0; i < data.length; i++) {
                        datas = _this.data.library.concat(data[i]);
                        _this.setData({
                            library: datas
                        })
                    }
                    console.log(_this.data.library);

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