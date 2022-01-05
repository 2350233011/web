const app = getApp();
//判断
function findIndex(arr, key, valuetosearch) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == valuetosearch) {
            return i + 1;
        }
    }
    return -1;
}
function findIndex2(arr, key, valuetosearch) {
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] == valuetosearch) {
                return i;
            }
        }
        return -1;
    } else {
        return false
    }

}
function findIndex3(arr, key, valuetosearch) {
    let arr_all = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == valuetosearch) {
            arr_all.push(i + 1);
        }
    }
    return arr_all;
}
function find_value(arr, key) {
    let arr_all = [];
    for (var i = 0; i < arr.length; i++) {
        arr_all.push(arr[i][key]);
    }
    return arr_all;
}
function find_value_byindex(arr, index, value) {
    for (var i = 0; i < arr.length; i++) {
        if (i == index - 1) {
            return arr[i][value]
        }
    }
    return -1
}
//多选找
function findIndex4(arr, key, valuetosearch, id) {
    var arr_all = [], val = valuetosearch.toString().split(",");
    for (var j = 0; j < val.length; j++) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key] == val[j]) {
                arr_all = arr_all.concat(arr[i][id]);
            }
        }
    }
    return arr_all;
}
function findIndex_all(arr, key, value, data) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == value) {
            return arr[i][data];
        }
    }
    return -1;
}
function indexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) return i;
    }
    return -1;
}
function indexOf2(arr, key, valuetosearch) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == valuetosearch) {
            return true;
        }
    }
    return false;
}
function indexOf3(arr, valuetosearch) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == valuetosearch) {
            return true;
        }
    }
    return false;
}
function remove(arr, val) {
    var index = indexOf(arr, val);
    if (index > -1) {
        arr.splice(index, 1);
    }
}
function remove2(arr, key, val) {
    var index = findIndex2(arr, key, val);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

function compare(property, desc) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (desc == true) {
            // 升序排列
            return value1 - value2;
        } else {
            // 降序排列
            return value2 - value1;
        }
    }
}

module.exports.findIndex = findIndex;
module.exports.findIndex_all = findIndex_all;
module.exports.findIndex2 = findIndex2;
module.exports.findIndex3 = findIndex3;
module.exports.findIndex4 = findIndex4;
module.exports.find_value = find_value;
module.exports.find_value_byindex = find_value_byindex;
module.exports.remove = remove;
module.exports.remove2 = remove2;
module.exports.compare = compare;
module.exports.indexOf = indexOf;
module.exports.indexOf2 = indexOf2;
module.exports.indexOf3 = indexOf3;