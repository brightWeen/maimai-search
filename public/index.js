import { isExists, saveUser,clear } from './db.js'
import { getUserByKeywords } from './api.js'
import { exportExcel } from './export.js'

//var db = window['__db__'];

var BREAK = false;
var sleep = async (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time);
    })
}

var exportKeyWord = async (keyword, province) => {
    var count = 0;
    var i = 0;
    var hasUser = true
    console.log(`开始搜索${keyword}`);
    while (hasUser) {
        var users = await getUserByKeywords(i, `${keyword}`, province||'北京');
        i++;
        if (users.contacts.length == 0) {
            console.log('end');
            hasUser = false;
            break;
        }
        console.log(`page:${i},users:${users.contacts.length}`)
        for (let j = 0; j < users.contacts.length; j++) {
            if (BREAK) {
                throw new Error('手动停止')
            }
            var u = users.contacts[j]
            var isE = isExists(u.contact.id);
            if (isE) {
                console.log(`${u.contact.name} 已存在`)
                continue;
            }
            saveUser(u)
            console.log(`${count}--${u.contact.name}`)
            count++;
            util.config.count = count;
            util.config.name = u.contact.name;
            util.config.pageIndex = i;
            util.config.pageSize = users.contacts.length;
            util.doing();
        }
        let tick = Math.random() * 3
        let sleepTime = tick.toFixed(2)
        console.info(`page ${i},等待${sleepTime}s`)
        await sleep(1000 * parseFloat(sleepTime)); //等10秒
    }
    console.log('emd')
}


var util = {
    config: {
        keyword: '',
        count: 0,
        name: '',
        pageIndex: 0,
        pageSize: 0
    },
    beginSearch: async function () {
        var keyword = $('#txtKeyWord').val();
        var province = $('#txtProvince').val();
        if (!keyword) { alert('请输入关键字'); }
        var keywords = keyword.split(',');
        var $btn = $("#btnSearch");
        var $txtResult = $("#txtResult");
        $btn.attr("disabled", "disabled");
        $txtResult.text("否");
        for (var i = 0; i < keywords.length; i++) {
            var k = keywords[i]
            this.config.keyword = k
            await exportKeyWord(k, province);
        }
        $btn.removeAttr("disabled");
        $txtResult.text("是");
        $("#btnExport").removeAttr("disabled");
    },
    doing() {
        $("#txtDoing").html(`
        <div>关键词：${this.config.keyword}</div>
        <div>用户：${this.config.name}</div>
        <div>页数：${this.config.pageIndex}</div>
        <div>页用户数：${this.config.pageSize}</div>
        <div>记录用户数：${this.config.count}</div>
        `)
    },
    init() {
        //开始
        var $btnSearch = $("#btnSearch");
        var $btnStop = $("#btnStop");
        var $btnExport = $("#btnExport");
        var $btnClear = $("#btnClear");
        
        var self = this;
        $btnSearch.click(function () {
            BREAK = false;
            $btnSearch.attr('disabled', 'disabled');
            $btnExport.attr('disabled', 'disabled');
            $btnStop.removeAttr('disabled');
                        $btnExport.removeAttr('disabled');

            self.beginSearch();
        });
        //导出excel
        $btnExport.click(function () {
            exportExcel($('#txtKeyWord').val());
        });

        //停止
        $btnStop.click(function () {
            $btnSearch.removeAttr('disabled');
            $btnExport.removeAttr('disabled');
            $btnStop.attr('disabled', 'disabled');
            BREAK = true;
        });
        $btnClear.click(function(){
            clear();
            alert('清空成功');
        })
    }
}
var html = `
<div>
<div id="maimai-s">
<b>人选Excel导出小工具</b>
<div class="line-s">
搜索关键字：<input type="text"  placeholder="多个关键词使用逗号分隔" id="txtKeyWord"/>
</div>
<div class="line-s">
城市：<input type="text"  placeholder="城市默认为北京" id="txtProvince"/>
</div>
<div class="line-s">
搜索进展：<p id="txtDoing">否</p>
</div>
<div class="line-s">
是否完成：<span id="txtResult">否</span>
</div>
<div class="line-s">
<button id="btnSearch" >开始搜索</button> <br/>
<button id="btnExport" >导出Excel</button> <br/>
<button id="btnStop" disabled >停止</button> <br/>
<button id="btnClear"  >清空</button> <br/>
</div>
</div>
<style>
#maimai-s{
    position: absolute;
    width: 200px;
    height: 400px;
    z-index: 1000;
    left: 0px;
    top: 0px;
    background: #f1f1f1;
    border: 1px solid #333;
}
#maimai-s .line-s{
    padding:3px;
    border-bottom:1px solid #bababa;
}
</style>
</div>

`
var dv = document.createElement('div');
dv.innerHTML = html;
document.body.appendChild(dv);
util.init();

// (async () => {
//     //图应用平台|图计算平台|图数据库 | '图数据'

//     var keywords = [
//         "腾讯 hrbp","网易游戏 hrbp","C&B"
//         ]
//     for (var i = 0; i < keywords.length; i++) {
//         await exportKeyWord(keywords[i]);
//     }
// })()

