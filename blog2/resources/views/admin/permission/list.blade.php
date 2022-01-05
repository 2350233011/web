<!DOCTYPE html>
<html>
  
  <head>
    <meta charset="UTF-8">
    <title>xxxx</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    @include('admin.public.styles')
    @include('admin.public.script')
  </head>
  
  <body>
  <div class="x-nav" style="margin-bottom: 10px;">
          <span class="layui-breadcrumb">
            <a href="">首页</a>
            <a href="">演示</a>
            <a>
              <cite>导航元素</cite></a>
          </span>
    <a class="layui-btn layui-btn-small" style="line-height:1.6em;margin-top:3px;float:right" onclick="location.reload()" title="刷新">
      <i class="layui-icon layui-icon-refresh" style="line-height:30px"></i></a>
  </div>
    <div class="x-body">
      <div class="layui-row">

      </div>
      <xblock>
        <button class="layui-btn layui-btn-danger" onclick="delAll()"><i class="layui-icon"></i>批量删除</button>
        <button class="layui-btn" onclick="xadmin.open('添加权限','{{ url('admin/permission/create') }}',600,400)"><i class="layui-icon"></i>添加</button>
        <span class="x-right" style="line-height:40px">共有数据：{{count($data)}} 条</span>
      </xblock>
      <table class="layui-table">
        <thead>
          <tr>
            <th >ID</th>
            <th >权限名称</th>
            <th >权限路由</th>
            <th>操作</th></tr>
        </thead>
        <tbody>
        @foreach($data as $v)
          <tr>
            <td>{{ $v->id }}</td>
            <td>{{ $v->per_name }}</td>
            <td>{{ $v->per_url }}</td>
            <td class="td-manage">

              <a title="编辑"  onclick="xadmin.open('编辑','{{url('admin/permission/'.$v->id.'/edit')}}',600,400)" href="javascript:;">
                <i class="layui-icon">&#xe642;</i>
              </a>

              <a title="删除" onclick="member_del(this,'{{ $v->id }}')" href="javascript:;">
                <i class="layui-icon">&#xe640;</i>
              </a>
            </td>
          </tr>
        @endforeach

        </tbody>
      </table>


    </div>
    <script>

      /*用户-删除*/
      function member_del(obj,id){
          layer.confirm('确认要删除吗？',function(index){
              //发异步删除数据
              // $.post('URL地址'.'携带的参数',成功后的闭包函数)
              $.post('{{ url('admin/permission/') }}/'+id,{"_token":"{{csrf_token()}}","_method":"delete","id":id},function(data){
                  if(data.status == 0){
                      $(obj).parents("tr").remove();
                      layer.msg('已删除!',{icon:1,time:1000});
                      location.reload(true);
                  }else{
                      layer.msg('删除失败!',{icon:1,time:1000});
                      location.reload(true);
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
  </body>

</html>