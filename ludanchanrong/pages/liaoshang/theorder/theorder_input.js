// pages/theorder/theorder_input.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        TopIndex: 1, //状态
        order_info: [],
        //订单状态
        group_info: [{
            id: 6,
            name: '进行中',
            power: true
        }, {
            id: 7,
            name: '送货中',
            power: true
        },{
            id: 9,
            name: '已完成',
            power: true
        }],
        config: {
            pages: 1, //当前页面的分页数量
            pageIndex: 1, //当前分页
            total: 0

        } //页面显示配置
    },



    /**
     * 公共函数
     */
    //点击切换页面
    changstyle: function (e) {
        let index = e.currentTarget.dataset.index; /*定义index等于当前页面的dataset.index*/
        this.getorderinfo(index)
        this.setData({
            TopIndex: index /*定义当前数据的TopIndex等于  index 等于dataset.index*/
        })
    },
    //详情页面
    toOrderDetail(e) {
        let that = this, id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index
        wx.navigateTo({
            url: 'theorder_details?id=' + id,
            success: function (res) {
                res.eventChannel.emit('acceptDataFromA', { data: that.data.order_info[index] })
            }
        })
    },

    onRefresh() {
        this.getorderinfo(this.data.TopIndex)
        setTimeout(() => {
            this.setData({
                triggered: false,
            })
        }, 1500)
    },

    // 获取滚动条当前位置
    scrolltoupper: function (e) {
        if (e.detail.scrollTop > 100) {
            this.setData({
                cangotop: true,
                scroll: e.detail.scrollTop
            });
        } else {
            this.setData({
                cangotop: false
            });
        }
    },

    //回到顶部
    goTop: function (e) { // 一键回到顶部
        app.goTop(this, 50)

    },

    getorderinfo(index) {
        let that = this
        wx.request({
            url: app.globalData.config.baseURL + '/appapi/b2b/order/gets',
            data: {
                buyerId: app.globalData.user_data.sid,
                // parent: 0,
                type: app.globalData.type[1].id,
                state: index,

                pid: that.data.config.pageIndex - 1,
                pcount: app.globalData.config.PageSize,
                total: that.data.config.total
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'openid': app.globalData.wx_config.openid,
                'authorities': app.globalData.token
            },
            success: function (res) {
                let data = res.data
                console.log(data);
                for (let i = 0; i < data.list.length; i++) {
                    data.list[i].allunitprice = app.accMul(data.list[i].unitprice, data.list[i].quantity)
                }
                if (data.code == 1) {
                    that.setData({
                        order_info: data.list
                    })
                } else if (data.code == 401) {
                    // app.error_showToast()
                } else {

                }
                console.log(that.data);

            }
        })
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '采购管理'
        });
        var that = this
        that.setData({
            TopIndex: this.data.group_info[0].id,
            states: app.globalData.states
        })
        that.getorderinfo(6)


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