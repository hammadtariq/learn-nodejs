var express = require('express');
var app = express();
var request = require('request');
var url = require('url');

// app.get('/',function(req,response) {
//     response.sendfile(__dirname+'/index.html')
// })

// app.get('/',function(req,response) {
//     var username = req.params.username;

//     options={
//         protocol:'http:',
//         host:"api.twitter.com",
//         pathname:'/1/statuses/user_timeline.json',
//         query: {screen_name:username,count:10}
//     }
//     var twitterUrl = url.format(options)
//     console.log("Url: ",twitterUrl)
//     request(twitterUrl).pipe(response);
// })

app.get('/',function(req,response) {
    request("tweets.json",function(err,response,body) {
        var username = "hammad";
        var data = JSON.parse(body)
        console.log("body: ",body)
        response.render('tweets.ejs',{tweets:data,name:username});
    })
})

app.listen(8080,function(){
    console.log('server is listening on port 8080');
})