


const getSensorReadings = require('./get-sensor-readings')

const cache = {
  temperature: null,
  humidity: null
}

setInterval(() =>  {

  getSensorReadings((err,temperature,humidity) => {
  if(err){
    return console.error(err)
  }
  cache.temperature = temperature
  cache.humidity = humidity
 })
},2000)

module.exports.getTemperature = () => cache.temperature
module.exports.getHumidity = () => cache.humidity

