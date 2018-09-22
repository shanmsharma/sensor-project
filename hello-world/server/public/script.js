
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

setInterval(() => {
  fetchTemperature()
  fetchHumidity()
},2000)
