<?php

namespace App\Http\Controllers\Home;

use App\Model\Article;
use App\Model\HomeUser;
use App\Model\Cate;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Image;

class ZhongxinController extends CommonController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $cates = (new Cate)->tree();
        return view('home.zhongxin',compact('cates'));
    }
    //�ϴ�ͼƬ
    public function upload(Request $request)
    {
        //��ȡ�ϴ��ļ�
        $file = $request->file('photo');
        //�ж��ϴ��ļ��Ƿ�ɹ�
        if(!$file->isValid()){
            return response()->json(['ServerNo'=>'400','ResultData'=>'��Ч���ϴ��ļ�']);
        }
        //��ȡԭ�ļ�����չ��
        $ext = $file->getClientOriginalExtension();    //�ļ���չ��
        //���ļ���
        $newfile = md5(time().rand(1000,9999)).'.'.$ext;

        //�ļ��ϴ���ָ��·��
        $path = public_path('uploads/head');
        //ͼƬ����

        $res=Image::make($file)->resize(500,300)->save($path.'/'.$newfile);
        if ($res){
            return response()->json(['ServerNo'=>'200','ResultData'=>$newfile]);
        }
        return response()->json(['ServerNo'=>'400','ResultData'=>'�����ļ�ʧ��']);

        //2. ���ļ��ϴ���OSS��ָ���ֿ�
//        $osskey : �ļ��ϴ���oss�ֿ������ļ���
//        $filePath:Ҫ�ϴ����ļ���Դ
//        $res = OSS::upload($newfile, $file->getRealPath());

    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $cates = (new Cate)->tree();
        return view('home.bianji',compact('cates'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
