let express = require('express');
let proxy = require('http-proxy-middleware');
let app = new express();
let date = new Date();
app.use(express.static('./dist'));
app.use(proxy({
    target:'http://localhost:3000'
}));
app.listen(8888, function () {
    console.log('服务已启动', date)
});