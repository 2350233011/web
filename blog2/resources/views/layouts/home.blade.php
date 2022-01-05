<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <!-- 引入页面描述和关键字模板 -->
    <title>知否</title>
    <meta name="description" content="云悦读专注于提供多元化的阅读体验，以阅读提升生活品质"/>
    <meta name="keywords" content="云悦读,悦读,阅读,文字,历史,杂谈,散文,见闻,游记,人文,科技,杂碎,冷笑话,段子,语录"/>
    <!-- 网站图标 -->
    <link rel="shortcut icon" href="{{asset('home/images/favicon.ico')}}"/>
    <!-- 禁止浏览器初始缩放 -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>

    @include('home.public.styles')
    @include('home.public.script')
    <link rel="stylesheet" type="text/css" href="{{asset('rili/easyui.css')}}" />
    <script type="text/javascript" src="{{asset('rili/js/jquery-1.8.3.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('rili/js/jquery.easyui.min.js')}}"></script>
    <script type="text/javascript" src="{{asset('rili/js/jquery.fullcalendar.js')}}"></script>


</head>
<body id="wrap" class="home blog">
<!-- Nav -->
<!-- Moblie nav-->
<div id="body-container">
    @include('home.public.navmenu')
<!-- /.Moblie nav -->
    <section id="content-container" style="background:#f1f4f9; ">
    @include('home.public.header')

    <!-- Main Wrap -->
    @section('main-wrap')
            <div id="light" class="white_content" style="width: 400px;height: 400px; " >
                <a href="javascript:void(0)"
                   onclick="document.getElementById('light').style.display='none';document.getElementById('fade').style.display='none'">
                    <img  src="{{asset('home/images/weixin.png')}}">
                </a>
            </div>
        {{--                右侧边栏--}}
        @include('home.public.aside')
    @show
    <!--/.Main Wrap -->
    @include('home.public.footer')

    </section>
</div>
{{--登录--}}
@include('home.public.signin')

{{--右侧小功能--}}
<div class="floatbtn">
    <span id="back-to-top">
        <i class="fa fa-arrow-up"></i>
    </span>
    <span id="bdshare" class="bdshare_t mobile-hide">
        <a class="bds_more" href="#" data-cmd="more"><i class="fa fa-share-alt"></i></a>
    </span>
    <span id="qr" class="mobile-hide">
        <i class="fa fa-qrcode"></i><div id="floatbtn-qr"><div id="floatbtn-qr-msg">
         <img src="{{asset('home/images/shoukuan.png')}}">扫一扫支持一下</div></div>
    </span>
    <span id="zh-cn-tw" class="mobile-hide">
        <i><a id="StranLink">繁</a></i>
    </span>
    @if(session('homeuser'))
    <span id="layoutswt" class="mobile-hide" title="写文章">
        <a href="{{ url('home/article') }}"><i class="fa fa-book"></i></a>
    </span>
    @endif
</div>
<!-- /.Footer Nav Wrap -->
@include('home.public.footjs')
<!-- /.Footer Nav Wrap -->
</body>
</html>
