<header class="header-wrap" id="nav-scroll">
    <div class="nav-wrap">
        <div class="logo-title">
            <a href="{{url('/')}}" alt="知否" title="知否"><img style="margin-top: 4%;"  src="{{asset('home/images/logo.png')}}"></a>
        </div>
        <!-- Toggle menu -->
        <div class="toggle-menu">
            <i class="fa fa-bars"></i>
        </div>
        <!-- /.Toggle menu -->
        <!-- Search button -->
    @if(session('homeuser'))
        <!-- Login status -->
            <div id="login-reg">
                <span> <a href="/loginout" style="color: white">退出登录</a></span>
            </div>
            <!-- /.Login status -->
            <!-- Login status -->
            <div id="login-reg" title="用户中心">
                <span> <a href="{{url('home/zhongxin')}}" style="color: white" >{{ session('homeuser')->user_name }}</a></span>
            </div>
            <!-- /.Login status -->


    @else
        <!-- Login status -->
            <!-- Login status -->
            <div id="login-reg">
                <span> <a href="/login" style="color: white">登录</a></span>
            </div>
            <!-- /.Login status -->
            <div id="login-reg">
                <span> <a href="/emailregister" style="color: white">注册</a></span>
            </div>
            <!-- /.Login status -->


    @endif
        <!-- Focus us -->
        <div id="focus-us">
            关注我们
            <div id="focus-slide" class="ie_pie">
                <div class="focus-title">
                    关注我们
                </div>
                <p class="focus-content">
                    <a href="https://weibo.com/u/6698812328" target="_blank" class="sinaweibo"><span><i class="fa fa-weibo"></i>新浪微博</span></a>
                    <a href="https://weibo.com/u/6698812328" target="_blank" class="sinaweibo"><span><i class="fa fa-tencent-weibo"></i>腾讯微博</span></a>
                </p>
                <div class="focus-title">
                    联系我们
                </div>
                <p class="focus-content" style="line-height: 20px;margin-bottom: 10px;">
                    <a href="http://wpa.qq.com/msgrd?v=3&uin=2350233011&site=qq&menu=yes"
                        target="_blank" class="qq">
                        <span><i class="fa fa-qq"></i>QQ</span>
                    </a>
                    <a onclick="document.getElementById('light').style.display='block';document.getElementById('fade').style.display='block'"
                       target="_blank" class="qq">
                        <span><i class="fa fa-weixin"></i>微信</span>
                    </a>

                    <a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&amp;email=2350233011@qq.com"
                        target="_blank">
                        <span><i class="fa fa-envelope"></i>发送邮件</span>
                    </a>

                    <a target="_blank" href="https://jq.qq.com/?_wv=1027&k=5nBMIfr">
                        <span><i class="fa fa-users"></i>加入QQ群</span>
                    </a>
                </p>
{{--邮箱订阅                <form action="http://list.qq.com/cgi-bin/qf_compose_send" target="_blank" method="post">--}}
{{--                    <input type="hidden" name="t" value="qf_booked_feedback"/>--}}
{{--                    <input type="hidden" name="id"--}}
{{--                           value="http://list.qq.com/cgi-bin/qf_invite?id="/>--}}
{{--                    <input type="email" name="to" id="to" class="focus-email" placeholder="输入邮箱,订阅本站"--}}
{{--                           required=""/>--}}
{{--                    <input type="submit" class="focus-email-submit" value="订阅"/>--}}
{{--                </form>--}}

            </div>
        </div>

        <!-- /.Focus us -->
        <!-- Menu Items Begin -->
        <nav id="primary-navigation" class="site-navigation primary-navigation " role="navigation">
            <div class="menu-%e9%a1%b6%e9%83%a8%e8%8f%9c%e5%8d%95-container">
                <ul id="menu-%e9%a1%b6%e9%83%a8%e8%8f%9c%e5%8d%95" class="nav-menu">
                    <li class="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-4324"><a href="{{url('/')}}">首页</a></li>


                    @foreach($cateone as $k=>$v)
                        <li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-has-children menu-item-4316"><a href="{{ url('/lists/'.$v->cate_id) }}">{{ $v->cate_name }}</a>
                            @if(!empty($catetwo[$k]))
                                <ul class="sub-menu">
                                    @foreach($catetwo[$k] as $m=>$n)
                                        <li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-4317"><a href="{{ url('/lists/'.$n->cate_id) }}">{{ $n->cate_name }}</a></li>
                                    @endforeach

                                </ul>
                            @endif
                        </li>
                    @endforeach

                </ul>
            </div>
        </nav>
        <!-- Menu Items End -->
    </div>
    <div class="clr"></div>
    <div class="site_loading"></div>
</header>
<div class="hidefixnav"></div>
<!-- End Nav -->
<script type="text/javascript">
    $('.site_loading').animate({'width': '33%'}, 50);  //第一个进度节点
</script>
