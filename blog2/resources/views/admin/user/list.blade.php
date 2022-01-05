<!DOCTYPE html>
<html class="x-admin-sm">
<head>
  <meta charset="UTF-8">
  <title>管理员列表</title>
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

{{--        1--}}
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
          </form>
        </div>

{{--        2--}}
        <div class="layui-card-header">
          <button class="layui-btn layui-btn-danger" onclick="delAll()"><i class="layui-icon"></i>批量删除</button>
          <button class="layui-btn" onclick="xadmin.open('添加用户','{{url('admin/user/create')}}',600,400)"><i class="layui-icon"></i>添加</button>
          <span class="x-right" style="line-height:40px">共有数据：{{$arr}} 条</span>
        </div>


        <div class="layui-card-body ">
          <table class="layui-table layui-form">
            <thead>
            <tr>
              <th>
                <input type="checkbox" name=""  lay-skin="primary">
              </th>
              <th>ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>状态</th>
              <th>操作</th>
            </thead>
            <tbody>
            @foreach($user as $v)
              <tr>
                <td>
                  <input type="checkbox" name="" data-id='{{ $v->user_id }}'  lay-skin="primary">
                </td>
                <td>{{ $v->user_id }}</td>
                <td>{{ $v->user_name }}</td>
                <td>{{ $v->email }}</td>
                <td class="td-status">
                  <span class="layui-btn layui-btn-normal layui-btn-mini">已启用</span></td>
                <td class="td-manage">
                  <a onclick="member_stop(this,{{ $v->user_id }})" href="javascript:;" status="{{ $v->status }}"  title="启用">
                    <i class="layui-icon">&#xe601;</i>
                  </a>
                  <a  onclick="xadmin.open('授权','{{ url('admin/user/auth/'.$v->user_id) }}',600,400)"  href="javascript:;"   title="授权">
                    <i class="layui-icon">&#xe631;</i>
                  </a>
                  <a title="编辑"  onclick="xadmin.open('编辑','{{ url('admin/user/'.$v->user_id.'/edit') }}',600,400)" href="javascript:;">
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
    var form = layui.form;

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
      $.get("/admin/user/changestate", { 'status': status,'userid':id},
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

      $.post('/admin/user/'+id,{"_method":"delete","_token":"{{csrf_token()}}"},function(data){
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



  function delAll (argument) {
    // 获取到要批量删除的用户的id
    var ids = [];

    $(".layui-form-checked").not('.header').each(function(i,v){
      var u = $(v).attr('data-id');
      ids.push(u);
    })


    layer.confirm('确认要删除吗？',function(index){

      $.get('/admin/user/del',{'ids':ids},function(data){
        if(data.status == 0){
          $(".layui-form-checked").not('.header').parents('tr').remove();
          layer.msg(data.message,{icon:6,time:1000});
        }else{
          layer.msg(data.message,{icon:5,time:1000});
        }
      });


    });
  }
</script>
<script>var _hmt = _hmt || []; (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?b393d153aeb26b46e9431fabaf0f6190";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();</script>
</html>