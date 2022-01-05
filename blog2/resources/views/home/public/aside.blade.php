<div id="sidebar" class="clr">
    <div id="text-15" class="widget widget_text">
        <h3><span class="widget-title">个人中心</span></h3>
        <div class="textwidget">
            <div align="center">

            </div>
        </div>
    </div>
    <div id="search-3" class="widget widget_search">
        <h3><span class="widget-title">站内搜索</span></h3>
        <form method="get" class="searchform themeform" action="/">
            <div>
                <input type="text" class="search" name="s" onblur="if(this.value=='')this.value='Search..';"
                       onfocus="if(this.value=='Search..')this.value='';" value="Search.." maxlength="20"
                       required="required"/>
            </div>
        </form>
    </div>
    {{--小功能 日历--}}
    <div id="tintagcloud-2" class="widget widget_tintagcloud">
        <div region="center" >
            <div class="easyui-fullCalendar" fit="true" style="height: 300px; width: 300px;" ></div>
        </div>
    </div>
    {{--友情链接--}}
    <div id="tinbookmark-2" class="widget widget_tinbookmark">
        <h3><span class="widget-title">友情链接</span></h3>
        <div class="tinbookmark">
            <ul>
                <li class="tinbookmark-list list-right"><i class="fa fa-angle-right"></i><a
                        href="http://www.21cncn.com/" title="青年说" target="_blank">青年说</a></li>
                <li class="tinbookmark-list list-left"><i class="fa fa-angle-right"></i><a href="http://zatime.com/"
                                                                                           title="杂时代" target="_blank">杂时代</a>
                </li>
                <li class="tinbookmark-list list-right"><i class="fa fa-angle-right"></i><a href="http://shulaquan.com/"
                                                                                            title="书啦圈" target="_blank">书啦圈</a>
                </li>
                <li class="tinbookmark-list list-left"><i class="fa fa-angle-right"></i><a
                        href="http://www.lailianzi.com" title="练字网" target="_blank">练字网</a></li>
                <li class="tinbookmark-list list-right"><i class="fa fa-angle-right"></i><a
                        href="http://www.listenfog.com/" title="听雾读书" target="_blank">听雾读书</a></li>
                <li class="tinbookmark-list list-left"><i class="fa fa-angle-right"></i><a
                        href="http://www.liuyuanw.com/forum.php" title="柳苑文学" target="_blank">柳苑文学</a></li>
                <li class="tinbookmark-list list-right"><i class="fa fa-angle-right"></i><a href="http://www.wutu.info"
                                                                                            title="於菟阅读博客"
                                                                                            target="_blank">於菟阅读博客</a>
                </li>
                <li class="tinbookmark-list list-left"><i class="fa fa-angle-right"></i><a href="http://fanhcy.com/"
                                                                                           title="饭后茶娱" target="_blank">饭后茶娱</a>
                </li>
                <li class="tinbookmark-list list-right"><i class="fa fa-angle-right"></i><a
                        href="http://lusongsong.com/daohang/html/YunNan_138.htm" title="博客大全" target="_blank">博客大全</a>
                </li>
                <li class="tinbookmark-list list-left"><i class="fa fa-angle-right"></i><a
                        href="http://www.chinadmoz.org/" title="DMOZ目录" target="_blank">DMOZ目录</a></li>
            </ul>
        </div>
    </div>
    {{--后台--}}
    <div id="tinsitestatistic-3" class="widget widget_tinsitestatistic">
        <ul>
            <li>日志总数：<span>1934</span> 篇</li>
            <li> 评论总数：<span>627</span> 条</li>
            <li>标签数量：<span>64</span> 个</li>
            <li>链接总数：<span>11</span> 个</li>
            <li>建站日期：<span>2013-04-05</span></li>
            <li>运行天数：<span>1279</span> 天</li>
            <li>最后更新：<span>2016-9-30</span></li>
        </ul>
        <div class="clear"></div>
    </div>
    <div id="meta-3" class="widget widget_meta">
        <h3><span class="widget-title">后台管理</span></h3>
        <ul>
            <li><a href="{{url('admin/login')}}">进入后台</a></li>
            <li><a href="http://www.iydu.net/feed">文章<abbr title="Really Simple Syndication">RSS</abbr></a></li>
            <li><a href="http://www.iydu.net/comments/feed">评论<abbr title="Really Simple Syndication">RSS</abbr></a>
            </li>
            <li><a href="https://cn.wordpress.org/" title="基于WordPress，一个优美、先进的个人信息发布平台。">WordPress.org</a></li>
        </ul>
    </div>
    <div class="floatwidget-container">
    </div>
</div>
<script type="text/javascript">
    $('.site_loading').animate({'width': '78%'}, 50);  //第三个节点
</script>
</div>
