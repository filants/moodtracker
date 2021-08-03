// Geolocation

// const { json } = require("body-parser")

// Exists the possibility to catch the location in the browser

function setup () {

    // Remove canvas

    noCanvas()

    // Capture video from webcam

    const video = createCapture()
    video.parent('main-container')
    video.size(320, 240)

    let lat, lon, city, weather, description, aqi

    // Geolocation
    // Exists the possibility to catch the location in the browser?

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition( async position =>  {

            try {   

            console.log(position)

            lat = position.coords.latitude
            lon = position.coords.longitude

            const apiUrl = `weather/${lat},${lon}`

            // Gather response form server

            const response = await fetch(apiUrl)
            const json = await response.json()
            console.log(json)

            // Get the data from API Object

            city = json.weather.name
            weather = json.weather.main.temp
            description = json.weather.weather[0].description
            aqi = json.aqi.data.aqi

            console.log(city, weather, description)

            const template =
            `
            <div class="more-info">
            <div class="weatherDis">
                <div>
                    <div class="temp">${weather}</div>
                    <div class="summary">${description}</div>
                </div>
            </div>
                <div>
                    <p class="location" title="${lat},${lon}">${city}</p>
                    <p class="aqi" title="${lat},${lon}">${aqi}</p>
                </div>
            </div>
            `

            const weatherDiv = document.createElement('div')
            weatherDiv.innerHTML = template
            document.querySelector('main').append(weatherDiv)
            // console.log(aqi)
            } catch (error) {
                console.error(error)
            }
            
        })
    } else {
        console.error('Geolocation is not availiable in this browser')
    }


    // What happens after user clicks send

    document.querySelector('form button').addEventListener('click', async e => { // ASYNC BEI FUNKTION
        e.preventDefault()
        // Get user input

        const mood = document.querySelector('form input').value
        // Get current image
        video.loadPixels()
        const image64 = video.canvas.toDataURL()

        const data = {
            mood,
            city,
            weather,
            description,
            aqi,
            image64
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(data)
        }

        // Send data to API endpoint

        const response2 = await fetch('/api', options)
        const json = await response2.json()

        console.log(data)
    })
}

