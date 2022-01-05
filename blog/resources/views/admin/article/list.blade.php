<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>后台管理</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi"/>
    @include('admin.public.styles')
    @include('admin.public.script')
    <style>
        /*外层容器设置高*/
        #elec_table{
            position:relative;
            table-layout : fixed;
        }
        .table-body{
            overflow-y:auto;
            overflow-x:hidden;
            height:680px;
        }
        /*设置table-layout:fixed固定宽度，表头和表体需要对齐*/
        table{
            table-layout:fixed;
        }
    </style>

</head>

<body>
<div class="x-nav">
          <span class="layui-breadcrumb">
            <a href="">首页</a>
            <a href="">演示</a>
            <a><cite>导航元素</cite></a>
          <span class="x-right" style="line-height:40px">&nbsp;&nbsp;&nbsp;&nbsp;共有数据：{{count($arts)}} 条</span>

          </span>
    <a class="layui-btn layui-btn-small" style="line-height:1.6em;margin-top:3px;float:right"
       onclick="location.reload()" title="刷新">
        <i class="layui-icon layui-icon-refresh" style="line-height:30px"></i></a>
</div>
<div class="x-body">
    <!-- 表头需要固定的地方  -->
    <div id="elec_table">
        <div class="table-head">
            <table class="table theadstyle layui-table">
                <thead>
                <tr>
                    {{--<th>--}}
                    {{--<div class="layui-unselect header layui-form-checkbox" lay-skin="primary"><i class="layui-icon">&#xe605;</i></div>--}}
                    {{--</th>--}}
                    <th style="text-align: center" width="171">文章标题</th>
                    <th width="171">作者</th>
                    <th width="171">分类</th>
                    <th width="171">标签</th>
                    <th width="40">查看次数</th>
                    <th width="171">缩略图</th>
                    <th width="171">状态</th>
                    <th width="171">操作</th>
                </tr>
                </thead>
            </table>
        </div>
    </div>
    <!-- 表体需要显示滚动条的地方  -->
    <div class="table-body">
        <table class="table table-bordered layui-table" id="srvTable">
            @foreach($arts as $v)
                <tr>
                    <td style="text-align: center">{{ $v['art_title'] }}</td>
                    <td>{{$v['art_editor']}}</td>
                    @foreach($arr as $c)
                        @if($v['cate_id']==$c['cate_id'])
                            <td>{{$c['cate_name']}}</td>
                        @endif
                    @endforeach
                    <td>{{ $v['art_tag'] }}</td>
                    <td style="width:30px;">{{ $v['art_view'] }}</td>
                    <td><img src="{{ $v['art_thumb'] }}" alt="" style="width:90px;height:50px;"></td>
                    <td class="td-status">
                        @if($v['art_status'] == 0)
                            <span class="layui-btn layui-btn-normal layui-btn-mini">未加入推荐位</span>
                        @else
                            <span class="layui-btn layui-btn-normal layui-btn-mini layui-btn-disabled">已添加到推荐位</span>
                        @endif

                    </td>
                    <td class="td-manage">
                        <a onclick="recommend(this,{{ $v['art_id'] }})" href="javascript:;" data-id="{{ $v['art_status'] }}"
                           title="未添加">
                            <i class="layui-icon">&#xe601;</i>
                        </a>
                        <a title="编辑" onclick="xadmin.open('编辑','{{ url('admin/article/'.$v['art_id'].'/edit') }}')"
                           href="javascript:;">
                            <i class="layui-icon">&#xe642;</i>
                        </a>

                        <a title="删除" onclick="member_del(this,{{ $v['art_id'] }})" href="javascript:;">
                            <i class="layui-icon">&#xe640;</i>
                        </a>
                    </td>
                </tr>
            @endforeach
        </table>
    </div>


</div>
<script>
    layui.use(['form', 'layer', 'laydate'], function () {
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

        //监听提交
        form.on('submit(search)', function (data) {
            console.log(data);
        });
    });


    /*文章-删除*/
    function member_del(obj, id) {
        layer.confirm('确认要删除吗？', function (index) {
            //发异步删除数据
            $.post('{{ url('admin/article/') }}/' + id, {
                '_method': 'delete',
                '_token': "{{csrf_token()}}"
            }, function (data) {
                if (data.status == 0) {
                    $(obj).parents("tr").remove();
                    layer.msg('已删除!', {icon: 1, time: 1000});
                    location.reload(true);
                } else {
                    // $(obj).parents("tr").remove();
                    layer.msg('删除失败!', {icon: 1, time: 1000});
                    location.reload(true);
                }

            })

        });
    }


    /*文章添加到推荐位*/
    function recommend(obj, id) {
        // 获取当前记录推荐位状态
        var status = $(obj).attr('data-id');
        if (status == 0) {
            layer.confirm('确认要添加到推荐位吗？', function (index) {
                //发异步把用户状态进行更改
                $.ajax({
                    type: "GET", //提交方式
                    url: '/admin/article/recommend',//路径
                    data: {"id": id, "status": status},//数据，这里使用的是Json格式进行传输
                    dataType: "Json",
                    success: function (result) {//返回数据根据结果进行相应的处理
                        if (result.status == 0) {
                            $(obj).attr('title', '已推荐')
                            $(obj).find('i').html('&#xe62f;');
                            $(obj).attr('data-id', '1');

                            $(obj).parents("tr").find(".td-status").find('span').addClass('layui-btn-disabled').html('已推荐');
                            layer.msg('已推荐!', {icon: 6, time: 1000});
                        } else {
                            layer.msg('修改失败!', {icon: 5, time: 1000});
                        }
                    }
                });
            });
        } else {
            layer.confirm('确认要取消推荐位吗？', function (index) {
                //发异步把用户状态进行更改
                $.ajax({
                    type: "GET", //提交方式
                    url: '/admin/article/recommend',//路径
                    data: {"id": id, "status": status},//数据，这里使用的是Json格式进行传输
                    dataType: "Json",
                    success: function (result) {//返回数据根据结果进行相应的处理
                        if (result.status == 0) {
                            $(obj).attr('title', '推荐位取消')
                            $(obj).find('i').html('&#xe601;');
                            $(obj).attr('data-id', '0');
                            $(obj).parents("tr").find(".td-status").find('span').removeClass('layui-btn-disabled').html('推荐位取消');
                            layer.msg('推荐位取消!', {icon: 5, time: 1000});
                        } else {
                            layer.msg('修改失败!', {icon: 5, time: 1000});
                        }
                    }
                });
            });
        }
    }
</script>

</body>

</html>
