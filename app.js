const koa = require('koa');
const app = new koa();
const path = require('path');
//配置swig
const render =  require('koa-swig');
var co = require('co');
app.context.render = co.wrap(render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: 'memory', // disable, set to false 
  ext: 'html',
  writeBody: false
}));
//设置mysql
const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test'
});
connection.connect();
//配置路由
const router = require('koa-simple-router');
app.use(router(_ => {
  _.get('/index', async(ctx, next) => {
    ctx.body = await ctx.render('index');
  })
   _.get('/receive', async(ctx, next) => {
   	console.log(ctx.request);
   	const post={
		username:ctx.request.query.username
	};
	console.log(ctx.request.query.username);
	const query=connection.query('INSERT INTO userinfo SET  ?',post,function(err,result){
		
		// if(err){
		// 	ctx.response.type='application/json';
		// 	ctx.response.body=JSON.stringify({
		// 		success:'no',
		// 		msg:'插入数据失败'
		// 	})
		// }else{
		// 	ctx.response.type='application/json';
		// 	ctx.response.body=JSON.stringify({
		// 		success:'ok',
		// 		msg:'插入成功'
		// 	})
		// }
	});
   	ctx.response.type='application/json';
   	ctx.response.body=JSON.stringify({
   		errorCode:0
   	})

  })
}))
app.listen(8081,function(){
	console.log("Server is running");
});
//配置静态文件
const server = require('koa-static');
app.use(server(__dirname+'/public'));
