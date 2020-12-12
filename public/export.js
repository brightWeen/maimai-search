import * as name from './excel.js'
import { getAll } from './db.js'

console.log(name)
var ExportJsonExcel = window['js-export-excel'];


const headers = [
    '来源',
    '姓名',
    '公司',
    '岗位',
    '电话',
    '邮箱',
    '位置',
    '工作经历',
    '教育经历',
    '链接',
    '导入时间'
]

const createInfo = (user) => {
    user = user._doc || user
    // console.log(user)
    user.card = user.card || user.contact;
    user.uinfo = user.uinfo || {};
    user.uinfo.work_exp = user.uinfo.work_exp || []
    user.uinfo.education = user.uinfo.education || []
    // console.log(`${user.createdAt.getFullYear()}-${user.createdAt.getMonth() + 1}-${user.createdAt.getDate()}`)
    // throw  new Error('waawa')
    return {
        res: $('.pcUserName').text().trim() || user.userResource || 'Yvonne',
        name: user.card.name,
        company: user.card.company,
        position: user.card.position,
        mobile: user.uinfo.mobile,
        email: user.uinfo.email,
        province: user.card.province,
        work_exp: user.uinfo.work_exp.map((c) => `${c.company} -- ${c.position} (${c.start_date} - ${c.end_date} ) \r\n ${c.description}`).join('\r\n'),
        education: user.uinfo.education.map((c) => `${c.school} -- ${c.department} (${c.start_date} - ${c.end_date} )  }`).join('\r\n'),
        site: `https://maimai.cn/contact/detail/${user.card.mmid}`,
        time: `-` //${user?.createdAt?.getFullYear()}-${user?.createdAt?.getMonth() + 1}-${user?.createdAt?.getDate()}
    }
}

async function exportExcel(keyword) {

    var option = {};

    option.fileName = `${keyword}-脉脉结果`;
    var users = await getAll();
    console.log(`用户数量:${users.length}`)
    var sheetData = [];
    users.forEach((user) => {
        //console.time('user')
        var u = createInfo(user)
        sheetData.push(u)
    })
    option.datas = [
        {
            sheetData: sheetData,
            sheetHeader: headers
        }
        // {
        //     sheetData: [
        //         { one: "一行一列", two: "一行二列" },
        //         { one: "二行一列", two: "二行二列" },
        //     ],
        //     sheetName: "sheet",
        //     sheetFilter: ["two", "one"],
        //     sheetHeader: ["第一列", "第二列"],
        //     columnWidths: [20, 20],
        // },
        // {
        //     sheetData: [
        //         { one: "一行一列", two: "一行二列" },
        //         { one: "二行一列", two: "二行二列" },
        //     ],
        // },
    ];
    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); //保存
}
export {
    exportExcel
}





 


