<?php

namespace App\Http\Controllers\Home;

use App\Model\Article;
use App\Model\Cate;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Image;

class ArticleController extends CommonController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $cates = (new Cate)->tree();
        return view('home/wenzhang',compact('cates'));
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
        //��ȡ����Ԥ����վ����ҳ����
        $html = file_get_contents("http://www.weather.com.cn/weather/101120101.shtml");
        //������ʽ
        $reg = '#hour3data.+?\[".+?,.+?,(?<tianqi>.+?),(?<wendu>.+?),#';
        //���ƥ��ɹ���������¶���ص���Ϣ
        if (preg_match($reg, $html, $mat)) {
            $tianqi= $mat['wendu'];
        }


        $listkey = 'LIST:ARTICLE';
        $hashkey = 'HASH:ARTICLE:';

        $input = $request->except('_token','photo');
        if (empty($input['art_thumb'])){
            $input['art_thumb']=asset('muban/muban.png');
        }

        $input['art_tag']=$input['art_title'];
        $input['art_editor']=session('homeuser')->user_name;


        //���ʱ��
        $input['art_tianqi'] = $tianqi;
        $input['art_time'] = time();
        $input['art_view'] = 0;
        $input['art_status'] = 0;

        // ���ύ���������ݱ��浽���ݿ�

        $res = Article::create($input);

        if($res){
            return redirect('home/zhongxin');
        }else{
            return back();
        }
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
        //
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
