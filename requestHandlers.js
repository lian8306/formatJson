var queryString = require("querystring");
var url = require('url');
var fs = require("fs"),
    formidable = require("formidable");

function start(response) {
    console.log("Request handler 'start' was called.");

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">'+
        '</head>' +
        '<body>' +
        '<h1>Format Json</h1>' +
        '<form class="form-horizontal" action="/upload" method="post" enctype="multipart/form-data">' +
        // '<textarea name="text" rows="20" cols="60"></textarea>'+
        '<div class="form-group">'+
            '<label for="inputEmail3" class="col-sm-2 control-label">上传文件</label>'+
            '<div class="col-sm-10"><input type="file" name="upload" multiple="multiple"></div>' +
        '</div>'+
        '<div class="form-group">'+
            '<div class="col-sm-offset-2 col-sm-10"><input class="btn btn-primary" type="submit" value="转换成二维" /></div>' +
        '</div>'+
        // '<input type="submit" value="Submit text" />'+
        '</form>' +
        '<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>' +
        '</body>' +
        '</html>';
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(body);
    response.end();
}
function getErweiData(data){
    var result = {};
    function getKey(data,key){
        for(var i in data){
            var k = key ? (key +'.'+i) : i;
            if(typeof(data[i]) === 'object'){
                getKey(data[i],k)
            }else{
                console.log('k',k)
                result[k] = data[i];
            }
        }
    }
    getKey(data)
    return result;
}
function formatData(data){
    try{
        var fData = JSON.parse(data),
            result  = {};
        result = getErweiData(fData);
        return result;
    }catch(e){
        return 'format error:'+e;
    }
}
function upload(response, request) {
    console.log("Request handler 'upload' was called.");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        var data=fs.readFileSync(files.upload.path,"utf-8");
        var rData = formatData(data);
        if(!fs.existsSync('tmp')){
            fs.mkdirSync('tmp');
        }
        console.log('rData',rData)
        var name = "tmp/"+files.upload.name;
        fs.writeFile(name,JSON.stringify(rData),function(err){
            if(err){
                console.log(err)
            }
            console.log('success')
        })
        // fs.rename(files.upload.path, name, function(error) {
        //     if (error) {
        //         fs.unlink(name);
        //         fs.rename(files.upload.path, name);
        //     }
        // });
        var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">'+
        '</head>' +
        '<body>' +
        '<h1>Format Json</h1>' +
        '<form class="form-horizontal" action="/upload" method="post" enctype="multipart/form-data">' +
        // '<textarea name="text" rows="20" cols="60"></textarea>'+
        '<div class="form-group">'+
            '<label for="inputEmail3" class="col-sm-2 control-label">上传文件</label>'+
            '<div class="col-sm-10"><input type="file" name="upload" multiple="multiple"></div>' +
        '</div>'+
        '<div class="form-group">'+
            '<div class="col-sm-offset-2 col-sm-10"><input class="btn btn-primary" type="submit" value="转换成二维" /></div>' +
        '</div>'+
        // '<input type="submit" value="Submit text" />'+
        '</form>' +
        '<div>download:<a href="'+name+'" download="'+files.upload.name+'" target="_blank">download</a> </div>'+
        '<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>' +
        '</body>' +
        '</html>';
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(body);
        response.end();
    })
}

function show(response) {
    console.log('request handler "show" was called.');
    response.writeHead(200, { "Content-Type": "image/png" });
    fs.createReadStream("tmp/test.png").pipe(response);
}
function spaces(response,request){
    console.log('request handler "spaces" was called.' );
    console.log('request.method.toLowerCase',request.method.toLowerCase())
    var data
    if(request.method.toLowerCase() !== 'post'){
        response.writeHead(200,{"Content-Type":"application/json",'charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});
        data = {
            code:200,
            data:[{"id":"1","name":"我的空间"},{"id":"2","name":"空间2"}]
        }
        response.end(JSON.stringify(data));
    }else{
        getData(response,request);
    }
    
}
function catalog2s(response){
    catalogs(response,2)
}
function catalogs(response,id){

    console.log('request handler "catalogs" was called.' );
    response.writeHead(200,{"Content-Type":"text/html",'charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});
    var data = {
        code:200,
        data:[{"id":"1","name":"栏目一","parentId":0},{"id":"2","name":"栏目二","parentId":0},{"id":"3","name":"栏目一子栏目","parentId":1},{"id":"4","name":"栏目一子栏目的子栏目","parentId":3}]
    }
    if(id ===2){
        data   ={
            code:200,
            data:[{"parentId":0,"id":"1","name":"空间二的栏目"}]
        }
    }
    response.end(JSON.stringify(data));
}
function getData(response,request){
    var query = url.parse(request.url,true).query;
    console.log('request handler "getData" was called.' );
    response.writeHead(200,{"Content-Type":"text/html",'charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});
    var data;
    console.log('query',query)
    if(query.spaceId==1){
        if(query.pageNum>=4){
            data = {
                code:200,
                data:[]
            }
        }else{

            data = {
                code:200,
                data:[{"id":"1","spaceId":"1","catalogId":"2","title":"语文"},
                {"id":"2","spaceId":"1","catalogId":"2","title":"数学"},
                {"id":"3","spaceId":"1","catalogId":"2","title":"英语"},
                {"id":"4","spaceId":"1","catalogId":"2","title":"测试下标题长度"},
                {"id":"5","spaceId":"1","catalogId":"2","title":"语文"},
                {"id":"6","spaceId":"1","catalogId":"2","title":"测试下标题长度1"},
                {"id":"7","spaceId":"1","catalogId":"2","title":"测试下标题长度2"},
                {"id":"8","spaceId":"1","catalogId":"2","title":"测试下标题长度3"},
                {"id":"9","spaceId":"1","catalogId":"2","title":"测试下标题长度4"},
                ]
            }
        }
    }else{
        data = {
            code:200,
            data:[{"id":"1","spaceId":"1","catalogId":"2","title":"语文"},
            {"id":"2","spaceId":"1","catalogId":"2","title":"数学"},
            {"id":"3","spaceId":"1","catalogId":"2","title":"英语"},
            {"id":"7","spaceId":"1","catalogId":"2","title":"测试下标题长度2"},
            {"id":"8","spaceId":"1","catalogId":"2","title":"测试下标题长度3"},
            {"id":"9","spaceId":"1","catalogId":"2","title":"测试下标题长度4"},
            ]
        }
    }
    response.end(JSON.stringify(data));
}
function getAticle(response){
    console.log('request handler "getAticle" was called.' );
    response.writeHead(200,{"Content-Type":"text/html",'charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});
    var data = {
        code:200,
        data:{"title":"语文","contentBody":"我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料/n我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料我是语文资料/n"}
    }
    response.end(JSON.stringify(data));
}
exports.start = start;
exports.upload = upload;
exports.show = show;
exports.spaces = spaces;
exports.catalogs = catalogs;
exports.catalog2s = catalog2s;
exports.getData = getData;
exports.getAticle = getAticle;
