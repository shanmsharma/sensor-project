

const express = require('express');
const path = require('path')
const app = express();
const sensor = require('node-dht-sensor');
const getCachedSensorReadings = require('./get-cached-sensor-readings')
const databaseOperations = require('./database-operations')
const http = require('http')
const socketIo = require('socket.io')
const {subscribe,unsubscribe} = require('./notifier')


const httpServer = http.Server(app)

const io = socketIo(httpServer)

io.on('connection',socket => {

  console.log(`User connected [${socket.id}]`)

  const pushTemperature = newTemperature => {
    socket.emit('new-temperature',{
    value: newTemperature
    })
  }

  const pushHumidity = newHumidity => {
    socket.emit('new-humidity',{
    value: newHumidity
    })
  }

  subscribe(pushTemperature,'temperature')
  subscribe(pushHumidity,'humidity')

  socket.on('disconnect',() => {
   unsubscribe(pushTemperature,'temperature')
   unsubscribe(pushHumidity,'humidity')
  })
})

httpServer.listen(3000 ,function() {
 console.log('server listening on port 3000');
})





app.use('/public', express.static(path.join(__dirname,'public')))

app.get('/temperature',function(req,res){
   res.json({
     value:
   getCachedSensorReadings.getTemperature().toFixed(1)
   })
})


app.get('/humidity', function(req,res) {

   res.json({
    value:
   getCachedSensorReadings.getHumidity().toFixed(1)
  })
})

app.get('/public',function(req,res){
   res.send(path.join(__dirname,'index.html'))

})

app.get('/temperature/history',function(req,res){
 databaseOperations.fetchLatestReadings('temperature',10,(err,results) =>
 {
  if(err) {
  console.error(err)
  return res.status(500).end()
  }
  res.json(results.reverse())
 })
})

app.get('/humidity/history',function(req,res){
 databaseOperations.fetchLatestReadings('humidity',10,(err,results) =>
 {
  if(err) {
  console.error(err)
  return res.status(500).end()
  }
  res.json(results.reverse())
 })
})

app.get('/temperature/range',function(req,res){

 const {start,end} = req.query
 databaseOperations.fetchReadingBetweenTime
 ('temperature',start,end,(err,results) => {
   if(err){
     console.error(err)
     return res.status(500).end()
   }
   res.json(results)
  })
})

app.get('/temperature/average',function(req,res){

 const {start,end} = req.query
 databaseOperations.fetchAverageOfReadingsBetweenTime
 ('temperature',start,end,(err,results) => {
   if(err){
     console.error(err)
     return res.status(500).end()
   }
   res.json({
       value:results['avg(value)'].toFixed(1)
    })
  })
})

app.get('/humidity/range',function(req,res){

 const {start,end} = req.query
 databaseOperations.fetchReadingBetweenTime
 ('humidity',start,end,(err,results) => {
   if(err){
     console.error(err)
     return res.status(500).end()
   }
   res.json(results)
  })
})

app.get('/humidity/average',function(req,res){

 const {start,end} = req.query
 databaseOperations.fetchAverageOfReadingsBetweenTime
 ('humidity',start,end,(err,results) => {
   if(err){
     console.error(err)
     return res.status(500).end()
   }
   res.json({
       value:results['avg(value)'].toFixed(1)
    })
  })
})


//app.listen(3000 ,function() {
// console.log('server listening on port 3000');
//})

