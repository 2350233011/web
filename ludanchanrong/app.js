// app.js
App({
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        if (wx.getStorageSync('user_data')) {
            this.globalData.token = wx.getStorageSync('token')
            this.globalData.user_data = wx.getStorageSync('user_data')
        }
        // 登录
        if (wx.getStorageSync('wx_config')) {
            let that = this
            that.globalData.wx_config = wx.getStorageSync('wx_config')
        } else {
            wx.login({
                success: res => {
                    let that = this
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    wx.request({
                        url: this.globalData.config.baseURL + '/appapi/wechat/getMiniprogramOpenId',
                        data: {
                            code: res.code
                        },
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        success: function (res) {
                            console.log(res);
                            let data = JSON.parse(res.data.data)
                            that.globalData.wx_config = data
                            wx.setStorageSync('wx_config', data)
                        }
                    })
                }
            })
        }
    },

    globalData: {
        config: {
            // baseURL: 'http://192.168.21.54:9999',
            baseURL: "https://uc.sdldcr.com",
            ossUrl: "http://bjucloud.oss-cn-qingdao.aliyuncs.com", //查看图片的阿里oss
            appid: "wx8ab77eb8ea476835",
            appsecret: "9b765a3cf2c5406efeef6bfcb732325b",
            PageSize: 40, // 每页的数据条数
        },
        wx_config: {
            openid: "",
            session_key: "",
        },
        token: "",
        user_data: "", //后台的用户数据
        userInfo: "", //微信的用户数据

        // 订单type
        type: [
            {
                id: 1,
                name: "养殖订单"
            },
            {
                id: 2,
                name: "投入品订单"
            }
        ],
        //订单状态
        states: [{
            id: 1,
            name: '待接单',
            power: true
        }, {
            id: 5,
            name: '待分配',
            power: true
        }, {
            id: 6,
            name: '进行中',
            power: true
        }, {
            id: 7,
            name: '送货中',
            power: true
        }, {
            id: 8,
            name: '已收货',
            power: true
        }, {
            id: 9,
            name: '已完成',
            power: true
        }, {
            id: 10,
            name: '已付款',
            power: true
        }, {
            id: 2,
            name: '已取消',
            power: true
        }, {
            id: 3,
            name: '已删除',
            power: true
        }],
    },





    //删除数组中的某一元素
    removeByValue: function (arr, val, type) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][type] == val) {
                arr.splice(i, 1);
                return 1;
                // break;
            }
        }
    },

    //获取时间函数
    gettime: function (e, time) {
        //e：时间中间的间隔
        //time：时间戳
        var timestamp
        if (time) {
            timestamp = time
        } else {
            timestamp = Date.parse(new Date());
        }
        var date = new Date(timestamp);
        //获取年份  
        var Y = date.getFullYear();
        //获取月份  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var MM = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + e + M + e + D + " " + H + ":" + MM + ":" + S
    },

    // 一键回到顶部函数
    goTop: function (that, num) {
        let scroll = Math.ceil(that.data.scroll)
        if (scroll > 600) {
            scroll = 600
        }
        var a = setInterval(function () {
            //循环执行代码
            if (scroll < num) {
                that.setData({
                    topNum: 0
                });
                scroll = 0
                clearInterval(a)
            } else {
                that.setData({
                    topNum: scroll - num
                });
                scroll -= num
            }
            // console.log(scroll);
        }, 20)
    },

    //退出登录函数
    error_showToast: function (e) {
        wx.showToast({
            title: '账号异常，请重新登录',
            icon: 'none',
            duration: 1000,
            mark: true,
            complete: setTimeout(function () {
                wx.removeStorageSync('token')
                wx.removeStorageSync('user_data')
                wx.removeStorageSync('wx_config')
                wx.reLaunch({
                    url: '/pages/login/login'
                })
            }, 1000)
        })
    },

    //乘法运算
    accMul: function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },

    //将转义字符串转回html
    unescapeHTML: function (a) {
        return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    },



})