@extends('layouts.home')
@section('main-wrap')
    @include('admin.public.styles')
    @include('admin.public.script')
    <!-- Main Wrap -->
    <div id="main-wrap">
        <!-- CMS Layout -->
        <div class="container two-col-container cms-with-sidebar">
            <div id="main-wrap-left">

                <div class="x-body">
                    <form class="layui-form" id="art_form" action="{{asset('home/article')}}" method="post">
                        {{--            {{ csrf_field() }}--}}
                        <div class="layui-form-item">
                            <label for="L_email" class="layui-form-label">
                                <span class="x-red">*</span>分类
                            </label>
                            <div class="layui-input-inline" style="margin-left: 30px;">
                                <select name="cate_id">
                                    {{--<option value="0">==顶级分类==</option>--}}
                                    @foreach($cates as $k=>$v)
                                        @if($v->cate_pid!=0)
                                            <option value="{{ $v->cate_id }}">{{ $v->cate_name }}</option>
                                        @endif
                                    @endforeach
                                </select>
                            </div>
                            <div class="layui-form-mid layui-word-aux">
                                <span class="x-red">*</span>
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <label for="L_art_title" class="layui-form-label" style="width: 100px;">
                                <span class="x-red">*</span>文章标题
                            </label>
                            <div class="layui-input-block">
                                {{csrf_field()}}
                                <input type="text" id="L_art_title" name="art_title" required=""
                                       autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item layui-form-text">
                            <label class="layui-form-label">缩略图</label>
                            <div class="layui-input-block layui-upload">
                                <input type="hidden" id="img1" class="hidden" name="art_thumb" value="">
                                <button type="button" class="layui-btn" id="test1">
                                    <i class="layui-icon">&#xe67c;</i>上传图片
                                </button>
                                <input type="file" name="photo" id="photo_upload" style="display: none;"/>
                            </div>
                        </div>


                        <div class="layui-form-item layui-form-text">
                            <label class="layui-form-label"></label>
                            <div class="layui-input-block">
                                <img src="" alt="" id="art_thumb_img" style="max-width: 350px; max-height:100px;">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label for="L_art_tag" class="layui-form-label">
                                <span class="x-red">*</span>描述
                            </label>
                            <div class="layui-input-block">
                                <textarea placeholder="请输入内容" class="layui-textarea" name="art_description"></textarea>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label for="L_art_tag" class="layui-form-label">
                                <span class="x-red">*</span>内容
                            </label>
                            <div class="layui-input-block">
                                <script type="text/javascript" charset="utf-8" src="/ueditor/ueditor.config.js"></script>
                                <script type="text/javascript" charset="utf-8" src="/ueditor/ueditor.all.min.js"></script>
                                <script type="text/javascript" charset="utf-8" src="/ueditor/lang/zh-cn/zh-cn.js"></script>

                                <script id="editor" type="text/plain" name="art_content" style="width:100%;height:500px;"></script>
                                <script type="text/javascript">
                                    //实例化编辑器
                                    var ue = UE.getEditor('editor');
                                </script>
                            </div>
                        </div>

                        <div class="layui-form-item" style=" width:250px;margin: 0 auto">
                            <button class="layui-btn" lay-filter="add" lay-submit="" style="width: 200px;">
                                确定上传
                            </button>
                        </div>
                    </form>
                </div>
                <script>
                    layui.use(['form', 'layer', 'upload', 'element'], function () {
                        $ = layui.jquery;
                        var form = layui.form
                            , layer = layui.layer;
                        var upload = layui.upload;
                        var element = layui.element;

                        $('#test1').on('click', function () {
                            $('#photo_upload').trigger('click');
                            $('#photo_upload').on('change', function () {
                                var obj = this;
                                var formData = new FormData($('#art_form')[0]);
                                $.ajax({
                                    url: '/admin/article/upload',
                                    type: 'post',
                                    data: formData,
                                    // 因为data值是FormData对象，不需要对数据做处理
                                    processData: false,
                                    contentType: false,
                                    success: function (data) {
                                        if (data['ServerNo'] == '200') {
                                            // 如果成功
                                            {{--$('#art_thumb_img').attr('src', '{{ env('ALIOSS_DOMAIN')  }}'+data['ResultData']);--}}
                                            {{--$('#art_thumb_img').attr('src', '{{ env('QINIU_DOMAIN')  }}'+data['ResultData']);--}}
                                            $('#art_thumb_img').attr('src', '/uploads/article/' + data['ResultData']);
                                            $('input[name=art_thumb]').val('/uploads/article/' + data['ResultData']);
                                            $(obj).off('change');
                                        } else {
                                            // 如果失败
                                            alert(data['ResultData']);
                                        }
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        var number = XMLHttpRequest.status;
                                        var info = "错误号" + number + "文件上传失败!";
                                        // 将菊花换成原图
                                        // $('#pic').attr('src', '/file.png');
                                        alert(info);
                                    },
                                    async: true
                                });
                            });

                        });

                        //监听提交
                        form.on('submit(add)', function (data) {

                        });


                    });
                </script>

            </div>
            @parent
        </div>
        <!-- Blocks Layout -->
    </div>
    <!--/.Main Wrap -->
@endsection
