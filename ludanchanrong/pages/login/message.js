// pages/login/message.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        upload: false,
        hidden: true,
        numList: [
            { name: '身份信息确认' },
            { name: '录入人脸信息' },
            { name: '完成注册' },
        ],
        num: 0,
        register: true,
        user_data: [{
            id: 1,
            code: "13003560099",
            name: "张三",
            ctime: "2021-03-30 17:28:24",
            utime: "2021-04-14 08:53:53",
            type: "PERSONAL",
            source: "unityuser",
            creater: "2",
            updater: "2",
            state: "9",
            certificates_type: "身份证",
            certificates_no: "3701813232323232",
            rules: "liaoshang,tuzaichang",
        }]


    },
    numSteps() {
        this.setData({
            num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
        })
    },
    numStep_index(e) {
        let that = this, index = e.currentTarget.dataset.index
        console.log(index);
        that.setData({
            num: index - 1
        })
    },

    // wx.saveFile({
    //     tempFilePath: tempImagePath,
    //     success: function (res) {
    //         //返回保存时的临时路径 res.savedFilePath
    //         const savedFilePath = res.savedFilePath
    //         // 保存到本地相册
    //         wx.saveImageToPhotosAlbum({
    //             filePath: savedFilePath,
    //         })
    //     },
    //     //保存失败回调（比如内存不足）
    //     fail: console.log
    // })

    //上传人脸
    takePhoto() {
        let that = this
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'normal',
            // quality: 'high',
            success: (res) => {
                //获取图片文件大小
                wx.getFileInfo({
                    filePath: res.tempImagePath,
                    success(res) {
                        let size = (res.size / 1024).toFixed()
                        console.log(size)
                        // console.log(res.digest)
                    }
                })
                console.log(res.tempImagePath,);
                that.setData({
                    upload: true,
                    hidden: !that.data.hidden
                })

                wx.uploadFile({
                    url: app.globalData.config.baseURL + '/appapi/user/testFace', //仅为示例，非真实的接口地址
                    filePath: res.tempImagePath,
                    header: {
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                        'authorities': app.globalData.token,
                          'openid': app.globalData.wx_config.openid,
                    },
                    name: 'file',
                    success(res) {
                        console.log(res);
                        let data = JSON.parse(res.data)
                        if (data.code == 1) {
                            setTimeout(function () {
                                that.setData({
                                    hidden: true,
                                    num: that.data.num == that.data.numList.length - 1 ? 0 : that.data.num + 1,
                                })
                            }, 1000)
                        } else {
                            setTimeout(function () {
                                that.setData({
                                    register: false,
                                    hidden: true,
                                    num: that.data.num == that.data.numList.length - 1 ? 0 : that.data.num + 1,
                                })
                            }, 1000)
                        }

                    }
                })
            }
        })
    },
    error(e) {
        console.log(e.detail)
    },
    changeHidden: function () {
        this.setData({
            hidden: !this.data.hidden
        });
    },

    //进入系统
    save: function (e) {
        let that = this, rules_all = []
        let rules = that.data.user_data.rules.split(',');
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i]
            if (rule == "liaoshang" || rule == "yangzhihu") {
                rules_all.push(rule)
            }
        }
        console.log(that.data);
        wx.setStorageSync('user_data', that.data.user_data)
        if (rules_all.length > 1) {
            wx.navigateTo({
                url: '/pages/login/identity'
            })
        } else {
            wx.switchTab({
                url: '/pages/' + rules_all[0] + '/' + rules_all[0]
            })
        }
    },

    //点击重试
    again(e) {
        this.setData({
            upload: false,
            hidden: true,
            user_type: "",
            numList: [
                { name: '身份信息确认' },
                { name: '录入人脸信息' },
                { name: '完成注册' },
            ],
            num: 0,
            register: true,
        })

    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this, type = options.type
        wx.setNavigationBarTitle({
            title: '身份信息核验'
        });

        that.setData({
            user_data: app.globalData.user_data
        })
        console.log(that.data.user_data);


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

    },


})