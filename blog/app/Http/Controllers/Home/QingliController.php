<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use App\Model\HomeUser;
use App\Model\Article;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class QingliController extends Controller
{
    public function qingli(){

        $directory="uploads";
        $files = Storage::allFiles($directory);


        $arrs=[];
        $sql1=HomeUser::get();
        $sql2=Article::get();
        foreach ($sql1 as $v) {
           $arrs[]=$v->thumb;
        }
        foreach ($sql2 as $n){
            if ($n->art_thumb=="http://www.zhifou.com/muban/muban.png"){
            }else{
                $arrs[]=substr($n->art_thumb,1) ;
            }
        }

        foreach ($files as $u){
            if (in_array($u,$arrs)){
            }else{
                Storage::delete($u);
            }
        }
        echo "清理成功";




    }





}
