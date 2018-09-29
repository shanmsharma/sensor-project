


const getSensorReadings = require('./get-sensor-readings')
const databaseOperations = require('./database-operations')

const cache = {
  temperature: 0,
  humidity: 0
}

setInterval(() =>  {

  getSensorReadings((err,temperature,humidity) => {
  if(err){
    return console.error(err)
  }
  databaseOperations.insertReading('temperature',temperature)
  databaseOperations.insertReading('humidity',humidity)
  cache.temperature = temperature
  cache.humidity = humidity
 })
},2000)

module.exports.getTemperature = () => cache.temperature
module.exports.getHumidity = () => cache.humidity

