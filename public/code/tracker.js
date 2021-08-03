// const { default: fetch } = require("node-fetch");



fetchData()

async function fetchData () {
    // Use fetch to get data from /api

    const response = await fetch('/api')
    const data = await response.json()


    // AQI index

    // < 51 = 'good'
    // > 50 && < 101 = 'Moderate' 
    // > 100 && < 151 = 'Unhealthy for sensitive groups' 
    // > 150 && < 201 = 'Unhealthy' 
    // > 200 && < 301 = 'Very unhealthy' 
    // > 300 = 'Hazardous'



    console.log(data)
    let counter = 0
    data.forEach( element => {
        counter++

        let aqiText = ''
        let aqiClass = ''
    
        if (element.aqi < 51) {
            aqiText = 'good'
        } else if (element.aqi > 50 && element.aqi < 101) {
            aqiText = 'Moderate'
        } else if (element.aqi > 100 && element.aqi < 151) {
            aqiText = 'Unhealthy for sensitive groups'
        } else if (element.aqi > 150 && element.aqi < 201) {
            aqiText = 'Unhealthy'
        } else if (element.aqi > 200 && element.aqi < 301) {
            aqiText = 'Very unhealthy'
        } else if (element.aqi > 300) {
            aqiText = 'Hazardous'
        }


        // Create container for entry
        const container = document.createElement('div')
        container.innerHTML =
        `
        <section class="mood-container">
            <p class="counter">${counter}</p>
            <p class="data">${new Date(element.timestamp).toLocaleString()}</p>
            <p class="mood">${element.mood}</p>
            <div class="face-container">
                <img src="${element.image64}" alt="">
            </div>
            <div class="weatherDis">
            <div>
                    <div class="temp">${element.weather}°C</div>
                    <div class="summary">${element.description}</div>
                </div>
            </div>
                <div>
                    <p class="location" title="${element.lat},${element.lon}">${element.city}</p>
                    <p class="aqi" title="${element.lat},${element.lon}">${element.aqi}: ${aqiText}</p>
                </div>
            </div>
        </section>
        `
        document.querySelector('main').append(container)

    })
    
            
}