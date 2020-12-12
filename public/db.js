
import './indexdb.js'
var dbObject = {
    dbName: 'userInfo', // 数据库名
    version: 1, // 版本号
    primaryKey: 'id', // 主键
    keyNames: [{ // 需要存储的数据字段对象
        key: 'name', // 字段名
        unique: false // 当前这条数据是否能重复 (最常用) 默认false
    }]
};

var userInfo = new window['IndexedDB'](dbObject);
userInfo.init();
window['db_userinfo'] = userInfo;

var isExists = (uid) => {
    return userInfo.getData(uid) != undefined
}
var saveUser = (u) => {
    u.id = u.contact.id
    userInfo.set(u);
}
var getUser = (uid) => {
    return userInfo.getData(uid)
}
var clear = () => {
    return userInfo.clearData()
}
var getAll = async () => {
    var r =  await userInfo.getAllData();
    console.log(r)
    return r;
}


export {
    isExists,
    saveUser,
    getUser,
    getAll,
    clear
}