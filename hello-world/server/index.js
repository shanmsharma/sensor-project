


const express = require('express');

const app = express()

app.get('/temperature',function(req,res){

res.send('24 &#176C')
});


app.get('/humidity', function(req,res) {
res.send('48%');
});

app.listen(3000,function(){

console.log('server listening on port 3000');
});

