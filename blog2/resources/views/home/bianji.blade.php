@extends('layouts.home')
@section('main-wrap')
    @include('admin.public.script')
    {{--��½����Ϣ--}}<?php $user=session('homeuser'); ?>
    <!-- Main Wrap -->
    <div id="main-wrap">
        <!-- CMS Layout -->
        <div class="container two-col-container cms-with-sidebar">
            <div id="main-wrap-left">

                <form class="layui-form" id="art_form" action="{{ url('home/article') }}" method="post">@csrf
                    <div class="layui-form-item layui-form-text">
                        <label class="layui-form-label">����ͼ</label>
                        <div class="layui-input-block layui-upload">
                            <input type="hidden" id="img1" class="hidden" name="art_thumb" value="">
                            <button type="button" class="layui-btn" id="test1">
                                <i class="fa fa-picture-o" aria-hidden="true">�ϴ�ͷ��</i>
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



                </form>

            </div>
            @parent
        </div>
        <script>
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
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
                            url: '/home/zhongxin/upload',
                            type: 'post',
                            data: formData,
                            // ��Ϊdataֵ��FormData���󣬲���Ҫ������������
                            processData: false,
                            contentType: false,
                            success: function (data) {
                                if (data['ServerNo'] == '200') {
                                    // ����ɹ�
                                    $('#art_thumb_img').attr('src', '/uploads/head/' + data['ResultData']);
                                    $('input[name=art_thumb]').val('/uploads/head/' + data['ResultData']);
                                    $(obj).off('change');
                                } else {
                                    // ���ʧ��
                                    alert(data['ResultData']);
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                var number = XMLHttpRequest.status;
                                var info = "�����" + number + "�ļ��ϴ�ʧ��!";
                                alert(info);
                            },
                            async: true
                        });
                    });

                });

                //�����ύ
                form.on('submit(add)', function (data) {

                });


            });
        </script>

        <!-- Blocks Layout -->
    </div>
    <!--/.Main Wrap -->
@endsection