<?php


namespace App\Http\Controllers\Admin;

use App\Model\Article;
use App\Model\Cate;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Image;
use App\Services\OSS;
use Storge;

class ArticleController extends Controller
{


    //文章上传
    public function upload(Request $request)
    {
        //获取上传文件
        $file = $request->file('photo');
        //判断上传文件是否成功
        if(!$file->isValid()){
            return response()->json(['ServerNo'=>'400','ResultData'=>'无效的上传文件']);
        }
        //获取原文件的扩展名
        $ext = $file->getClientOriginalExtension();    //文件拓展名
        //新文件名
        $newfile = md5(time().rand(1000,9999)).'.'.$ext;

        //文件上传的指定路径
        $path = public_path('uploads/article');

//        图片缩放

        $res=Image::make($file)->resize(500,300)->save($path.'/'.$newfile);
        if ($res){
            return response()->json(['ServerNo'=>'200','ResultData'=>$newfile]);
        }
        return response()->json(['ServerNo'=>'400','ResultData'=>'保存文件失败']);
////将文件从临时目录移动到本地指定目录
//        if(! $file->move($path,$newfile)){
//            return response()->json(['ServerNo'=>'400','ResultData'=>'保存文件失败']);
//        }
//        return response()->json(['ServerNo'=>'200','ResultData'=>$newfile]);

        //2. 将文件上传到OSS的指定仓库
//        $osskey : 文件上传到oss仓库后的新文件名
//        $filePath:要上传的文件资源
//        $res = OSS::upload($newfile, $file->getRealPath());

    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
//      1. 链接mysql数据库，获取需要的数据
        $arts = Article::get()->toArray();
        $arr=Cate::get()->toArray();
        return view('admin.article.list',compact('arts','arr'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

        //获取所有分类
        $cates = (new Cate)->tree();
        return view('admin.article.add',compact('cates'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //获取天气预报网站的网页内容
        $html = file_get_contents("http://www.weather.com.cn/weather/101120101.shtml");
        //正则表达式
        $reg = '#hour3data.+?\[".+?,.+?,(?<tianqi>.+?),(?<wendu>.+?),#';
        //如果匹配成功，就输出温度相关的信息
        if (preg_match($reg, $html, $mat)) {
            $tianqi= $mat['wendu'];
        }


        $listkey = 'LIST:ARTICLE';
        $hashkey = 'HASH:ARTICLE:';

        $input = $request->except('_token','photo');
        if (empty($input['art_thumb'])){
            $input['art_thumb']=asset('muban/muban.png');
        }

        //添加时间
        $input['art_tianqi'] = $tianqi;
        $input['art_time'] = time();
        $input['art_view'] = 0;
        $input['art_status'] = 0;

        // 将提交的文章数据保存到数据库

        $res = Article::create($input);

        if($res){
            return redirect('admin/article');
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
        $cates = (new Cate)->tree();
        $arts = Article::find($id);
        return view('admin.article.edit',compact('arts','cates'));
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
//        使用模型修改表记录
        $art = Article::find($id);
        $art->cate_id=$request->input('cate_id');
        $art->art_title=$request->input('art_title');
        $art->art_editor=$request->input('art_editor');
        if (empty($art->art_thumb)){
            $art->art_thumb=$request->input('art_thumb');
        }
        $art->art_tag=$request->input('art_tag');
        $art->art_description=$request->input('art_description');
        $art->art_content=$request->input('art_content');






        $res = $art->save();

        if($res){
            $data = [
                'status'=>0,
                'msg'=>'修改成功'
            ];
        }else{
//            return 2222;
            $data = [
                'status'=>1,
                'msg'=>'修改失败'
            ];
        }
        return $data;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $res = Article::find($id)->delete();
        //如果删除成功
        if($res){
            $data = [
                'status'=>0,
                'message'=>'删除成功'
            ];
        }else{
            $data = [
                'status'=>1,
                'message'=>'删除失败'
            ];
        }

        return $data;
    }

    //添加推荐位
    public function recommend(Request $request)
    {
        // 更新添加到推荐位状态
        $input = $request->all();
        $art = Article::find($input['id']);
        if($input['status'] == 1){
            $res = $art->update(['art_status'=>0]);
            if($res){
                return response()->json(['status' => 0]);
            }else{
                return response()->json(['status' => 1]);
            }
        }else{
            $res = $art->update(['art_status'=>1]);
            if($res){
                return response()->json(['status' => 0]);
            }else{
                return response()->json(['status' => 1]);
            }
        }


    }
}
