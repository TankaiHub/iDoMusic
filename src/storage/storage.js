import storage from 'good-storage'
const SEARCH_KEY = '_searchData_';
const STORAGE_MAX_LENGTH = 10

//搜索历史

export function getStorage() {
    return storage.get(SEARCH_KEY, []);
}
// 写
export function setStorage(val) {
    let arr = storage.get(SEARCH_KEY, []);
    insetArray(arr, val,  (item) => {
        return item == val;
    }, STORAGE_MAX_LENGTH);
    storage.set(SEARCH_KEY, arr);
    return arr;
}
// 删
export function deleteStorage(index) {
    let arr = getStorage();
    arr.splice(index, 1);
    storage.set(SEARCH_KEY, arr);
    return arr;
}
// 清除全部
export function clearStorage() {
    storage.clear(SEARCH_KEY);
    return []
}

//插入
function insetArray(arr, val, compare, maxLen) {
    let index = arr.findIndex(compare);
    if (index === 0) {
        return;
    }
    if (index > 0) {
        arr.splice(index, 1);
    }
    arr.unshift(val);
    if (maxLen, arr.length > maxLen) {
        arr.pop();
    }

} 