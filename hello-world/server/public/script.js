
const temperatureCanvasCtx = document.getElementById('temperature-chart').getContext('2d')
const humidityCanvasCtx = document.getElementById('humidity-chart').getContext('2d')
const humidityDisplay = document.getElementById('humidity-display')
const temperatureDisplay = document.getElementById('temperature-display')

const pushData = (arr, value, maxLen) => {
   arr.push(value)
   if(arr.length > maxLen){
   arr.shift()
   }
}


const temperatureChartConfig = new Chart(temperatureCanvasCtx,
{

   type:'line',
   data: {
   labels: [],
   datasets: [{
   data: [],
   backgroundColor: 'rgba(255,205,210,0.5)'
    }]
   },
   options:{
   legends: {
      display: false
   },
   responsive: true,
   maintainAspectRatio: false,
   scales: {
   yAxes:[{
     ticks: {
       suggestedMin: 10,
       suggestedMax: 40
       }
     }]
    }
   }
})


const humidityChartConfig = new Chart(humidityCanvasCtx,
{

   type:'line',
   data: {
   labels: [],
   datasets: [{
   data: [],
   backgroundColor: 'rgba(197,202,233,0.5)'
    }]
   },
   options:{
   legends: {
      display: false
   },
   responsive: true,
   maintainAspectRatio: false,
   scales: {
   yAxes:[{
     ticks: {
       suggestedMin: 30,
       suggestedMax: 90
       }
     }]
    }
   }
})


const addSocketListeners = () => {

  const socket = io()

  socket.on('new-temperature',data => {
   const now = new Date()
   const timeNow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()

   pushData(temperatureChartConfig.data.labels,timeNow,10)
   pushData(temperatureChartConfig.data.datasets[0].data,data.value,10)
   temperatureChartConfig.update()
   temperatureDisplay.innerHTML = '<strong>'+ data.value + '</strong>'
  })

  socket.on('new-humidity',data => {
   const now = new Date()
   const timeNow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()

   pushData(humidityChartConfig.data.labels,timeNow,10)
   pushData(humidityChartConfig.data.datasets[0].data,data.value,10)
   humidityChartConfig.update()
   humidityDisplay.innerHTML = '<strong>'+ data.value + '</strong>'
  })

}


const fetchTemperature = () => {
fetch('/temperature')
  .then(results => {
   return results.json()
  })
  .then(data => {
   const now = new Date()
   const timeNow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
   pushData(temperatureChartConfig.data.labels,timeNow,10)
   pushData(temperatureChartConfig.data.datasets[0].data,data.value,10)
   temperatureChartConfig.update()
   temperatureDisplay.innerHTML = '<strong>'+ data.value + '</strong>'
   })
}

const fetchHumidity = () => {
fetch('/humidity')
  .then(results => {
   return results.json()
  })
  .then(data => {
   const now = new Date()
   const timeNow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
   pushData(humidityChartConfig.data.labels,timeNow,10)
   pushData(humidityChartConfig.data.datasets[0].data,data.value,10)
   humidityChartConfig.update()
   humidityDisplay.innerHTML = '<strong>' + data.value + '</strong>'
   })
}

const fetchTemperatureHistory = () => {

fetch('/temperature/history')
  .then(results => {
     return results.json()
   })
  .then(data => {
  data.forEach(reading => {

  const time = new Date(reading.createdAt + 'Z')
  const formattedTime = time.getHours() + ':'+ time.getMinutes() +':'+
time.getSeconds()
  pushData(temperatureChartConfig.data.labels,formattedTime,10)
  pushData(temperatureChartConfig.data.datasets[0].data,reading.value,10)
  })
  temperatureChartConfig.update
 })
}

const fetchHumidityHistory = () => {

fetch('/humidity/history')
  .then(results => {
     return results.json()
   })
  .then(data => {
  data.forEach(reading => {

  const time = new Date(reading.createdAt + 'Z')
  const formattedTime = time.getHours() + ':'+ time.getMinutes() +':'+
time.getSeconds()
  pushData(humidityChartConfig.data.labels,formattedTime,10)
  pushData(humidityChartConfig.data.datasets[0].data,reading.value,10)
  })
  humidityChartConfig.update
 })
}

function getParameterByName (name) {
 const url = window.location.href
 name = name.replace(/[\[\]]/g,'\\$&')
 const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|&)')
 const results = regex.exec(url)
 if(!results)return null
 if(!results[2]) return ''
 return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

const fetchTemperatureRange = () => {

 const start = getParameterByName('start')
 const end = getParameterByName ('end')

 fetch(`/temperature/range?start=${start}&end=${end}`)
   .then(results => {
   return results.json()
   })
   .then(data => {
     data.forEach(reading => {
      const time = new Date(reading.createdAt + 'Z')
      const formattedTime = time.getHours() + ':' + time.getMinutes() + ':'
+ time.getSeconds()
      pushData(temperatureChartConfig.data.labels,formattedTime,10)
      pushData(temperatureChartConfig.data.datasets[0].data,reading.value,10)
     })
     temperatureChartConfig.update()
})

 fetch(`/temperature/average?start=${start}&end=${end}`)
   .then(results => {
   return results.json()
   })
   .then(data => {
    temperatureDisplay.innerHTML = '<strong>' + data.value + '</strong>'
  })

}

const fetchHumidityRange = () => {

 const start = getParameterByName('start')
 const end = getParameterByName ('end')

 fetch(`/humidity/range?start=${start}&end=${end}`)
   .then(results => {
   return results.json()
   })
   .then(data => {
     data.forEach(reading => {
      const time = new Date(reading.createdAt + 'Z')
      const formattedTime = time.getHours() + ':' + time.getMinutes() + ':'
+ time.getSeconds()
      pushData(humidityChartConfig.data.labels,formattedTime,10)
      pushData(humidityChartConfig.data.datasets[0].data,reading.value,10)
     })
     humidityChartConfig.update()
})

 fetch(`/humidity/average?start=${start}&end=${end}`)
   .then(results => {
   return results.json()
   })
   .then(data => {
    humidityDisplay.innerHTML = '<strong>' + data.value + '</strong>'
  })

}

if(!getParameterByName('start') &&
   !getParameterByName('end')) {
 addSocketListeners()
 //setInterval(() => {
  //  fetchTemperature()
  //  fetchHumidity()
 // },2000)

 fetchTemperatureHistory()
 fetchHumidityHistory()
}else {
fetchHumidityRange()
fetchTemperatureRange()

}
