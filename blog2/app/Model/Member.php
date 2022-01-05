<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
//    1. 关联的数据表
    public $table = 'homeuser';

//    2. 主键
    public $primaryKey = 'user_id';

//    3. 允许批量操作的字段

//    public $fillable = ['user_name','user_pass','email','phone'];
    public $guarded = [];

//    4. 是否维护crated_at 和 updated_at字段

    public $timestamps = false;
}
