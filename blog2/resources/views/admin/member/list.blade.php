<!DOCTYPE html>
<html class="x-admin-sm">
<head>
  <meta charset="UTF-8">
  <title>欢迎页面</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
  @include('admin.public.styles')
        @include('admin.public.script')
        <!--[if lt IE 9]>
  <script src="https://cdn.staticfile.org/html5shiv/r29/html5.min.js"></script>
  <script src="https://cdn.staticfile.org/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->
</head>
<body>
<div class="x-nav">
          <span class="layui-breadcrumb">
            <a href="">首页</a>
            <a href="">演示</a>
            <a>
              <cite>导航元素</cite></a>
          </span>
  <a class="layui-btn layui-btn-small" style="line-height:1.6em;margin-top:3px;float:right" onclick="location.reload()" title="刷新">
    <i class="layui-icon layui-icon-refresh" style="line-height:30px"></i></a>
</div>
<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-md12">
      <div class="layui-card">

        <div class="layui-card-body ">
          <form class="layui-form layui-col-space5">
            <div class="layui-input-inline">
              <select name="num" lay-filter="aihao">
                {{--<option value=""></option>--}}
                <option value="6" @if($request->input('num')==6) selected    @endif>6</option>
                <option value="10" @if($request->input('num')==10) selected    @endif>10</option>
              </select>
            </div>
            <div class="layui-inline layui-show-xs-block">
              <input type="text" name="username" value="{{ $request->input('username') }}"  placeholder="请输入用户名" autocomplete="off" class="layui-input">
            </div>
            <div class="layui-inline layui-show-xs-block">
              <button class="layui-btn"  lay-submit="" lay-filter="sreach"><i class="layui-icon">&#xe615;</i></button>
            </div>
            <span class="x-right" style="line-height:40px">共有数据：{{$arr}} 条</span>
          </form>
        </div>

        <div class="layui-card-body layui-table-body layui-table-main">
          <table class="layui-table layui-form">
            <thead>
            <tr>
              <th>用户名</th>
              <th>性别</th>
              <th>手机</th>
              <th>邮箱</th>
              <th>地址</th>
              <th>状态</th>
              <th>操作</th></tr>
            </thead>
            <tbody>
            <tr>
            @foreach($user as $v)
              <tr>
                <td>{{ $v->user_name }}</td>
                @if($v->sex==1)
                  <td>男</td>
                @else
                  <td>女</td>
                @endif
                <td>{{$v->phone}}</td>
                <td>{{ $v->email }}</td>
                <td>{{$v->address}}</td>
                <td class="td-status">
                  <span class="layui-btn layui-btn-normal layui-btn-mini">已启用</span></td>
                <td class="td-manage">
                  <a onclick="member_stop(this,{{ $v->user_id }})" href="javascript:;" status="{{ $v->status }}"  title="启用">
                    <i class="layui-icon">&#xe601;</i>
                  </a>
                  <a title="编辑"  onclick="xadmin.open('编辑','{{ url('admin/member/'.$v->user_id.'/edit') }}',600,400)" href="javascript:;">
                    <i class="layui-icon">&#xe642;</i>
                  </a>
                  <a title="删除" onclick="member_del(this,{{ $v->user_id }})" href="javascript:;">
                    <i class="layui-icon">&#xe640;</i>
                  </a>
                </td>
              </tr>
              @endforeach
            </tbody>
          </table>
        </div>

        <div class="page">
          {!! $user->appends($request->all())->render() !!}
        </div>



      </div>
    </div>
  </div>
</div>
</body>
<script>
  layui.use(['laydate','form'], function(){
    var laydate = layui.laydate;
    var  form = layui.form;


    //执行一个laydate实例
    laydate.render({
      elem: '#start' //指定元素
    });

    //执行一个laydate实例
    laydate.render({
      elem: '#end' //指定元素
    });


  });

  /*用户-停用*/
  function member_stop(obj,id){
    layer.confirm('确认要停用吗？',function(index){
      var status = $(obj).attr('data_id');
      $.get("/admin/member/changestate", { 'status': status,'userid':id},
              function(data){
                console.log($(obj).attr('data_id'));
                if($(obj).attr('title')=='启用'){

                  //发异步把用户状态进行更改
                  $(obj).attr('title','停用')
                  $(obj).find('i').html('&#xe62f;');

                  $(obj).parents("tr").find(".td-status").find('span').addClass('layui-btn-disabled').html('已停用');
                  layer.msg('已停用!',{icon: 5,time:1000});

                }else{
                  $(obj).attr('title','启用')
                  $(obj).find('i').html('&#xe601;');

                  $(obj).parents("tr").find(".td-status").find('span').removeClass('layui-btn-disabled').html('已启用');
                  layer.msg('已启用!',{icon: 6,time:1000});
                }
              });
    });
  }


  /*用户-删除*/
  function member_del(obj,id){
    layer.confirm('确认要删除吗？',function(index){

      $.post('/admin/member/'+id,{"_method":"delete","_token":"{{csrf_token()}}"},function(data){
        // console.log(data);
        if(data.status == 0){
          $(obj).parents("tr").remove();
          layer.msg(data.message,{icon:6,time:1000});
        }else{
          layer.msg(data.message,{icon:5,time:1000});
        }
      })

      //发异步删除数据

    });
  }
</script>
</html>