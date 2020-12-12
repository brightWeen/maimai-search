var getUserByKeywords = async (page = 0,keyword = '',province='') => {
    var params = {
        count: 20,
        page: page,
        query: keyword,
        dist: 0,
        jsononly: 1,
        pc: 1
    }
    if(province){
        params.province = province
    }
    var res = await fetch('/search/contacts?'+ new URLSearchParams(params), {
          credentials: 'include'
    });
    var r = await res.json();
    
    console.log(r);
    
    return _.get(r, 'data', null);
} 
export{
    getUserByKeywords
}
