@extends('layouts.home')
@section('main-wrap')
    @include('admin.public.script')
{{--登陆的信息--}}<?php $user=session('homeuser'); ?>
    <!-- Main Wrap -->
    <div id="main-wrap">
    <!-- CMS Layout -->
    <div class="container two-col-container cms-with-sidebar">
        <div id="main-wrap-left">


        </div>
        @parent
    </div>

    <!-- Blocks Layout -->
    </div>
    <!--/.Main Wrap -->
@endsection
