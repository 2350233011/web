<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\Member;
use Illuminate\Support\Facades\Crypt;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user =  Member::orderBy('user_id')
            ->where(function($query) use($request){
                $username = $request->input('username');
                $email = $request->input('email');
                if(!empty($username)){
                    $query->where('user_name','like','%'.$username.'%');
                }
                if(!empty($email)){
                    $query->where('email','like','%'.$email.'%');
                }
            })
            ->paginate($request->input('num')?$request->input('num'):6);

        $users=Member::all();
        $arr=count($users);
        return view('admin.member.list',compact('user','arr','request'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.member.add');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    private function getname()
    {
        $chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $username = "";
        for ( $i = 0; $i < 6; $i++ )
        {
            $username .= $chars[mt_rand(0, strlen($chars))];
        }
        return strtoupper(base_convert(time() - 1420070400, 10, 36)).$username;

    }

    public function store(Request $request)
    {
        //1. 接收前台表单提交的数据  email   pass repass
        $input = $request->all();

//        2. 进行表单验证

//        3. 添加到数据库的user表
        $username = $this->getname();

        $pass = Crypt::encrypt($input['pass']);

        $res = Member::create(['user_name'=>$username,'user_pass'=>$pass,'email'=>$input['email'],'active'=>'1']);


//        4 根据添加是否成功，给客户端返回一个json格式的反馈
        if($res){
            return redirect('admin/member');
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
        $user = Member::find($id);

        return view('admin.member.edit',compact('user'));
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
        //        1. 根据id获取要修改的记录
        $user = Member::find($id);
//        2. 获取要修改成的用户名
        $username = $request->input('user_name');
        $email= $request->input('email');
        if ( !empty($request->input('user_pass'))){
            $pass = Crypt::encrypt($request->input('user_pass'));
            $user->user_pass=$pass;
        }
        $user->email=$email;
        $user->user_name=$username;

        $res = $user->save();
        if($res){
            $data = [
                'status'=>0,
                'message'=>'修改成功'
            ];
        }else{
            $data = [
                'status'=>1,
                'message'=>'修改失败'
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
        $user = Member::find($id);
        $res = $user->delete();
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
}
