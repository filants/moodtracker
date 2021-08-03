const express = require('express')
const fetch = require('node-fetch')
const Datastore = require('nedb')
const { response } = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT


app.listen( port, () => {
    console.log(`App is listening at: http://localhost:${port}`)
})

app.use(express.static('public'))

app.use (express.json({
    limit:'1mb'
}))

// Define and load the database

const database = new Datastore('database/database.db')
database.loadDatabase()

// Database API POST

app.post('/api', (req, res) => {

    // Send information to the database

    console.log('Database post endpoint got a request')
    const data = req.body
    const timestamp = Date.now()
    data.timestamp = timestamp
    database.insert(data)
    res.json(JSON.stringify(data))

})

// Datavase API GET

app.get('/api', (req, res) => {
    // Send the information from the database to the client
    database.find({}, (err, data) => {
        if (err) {
            console.error(err)
            res.end()
        }

        res.json(data)
    })

})


// Weather, AQI and API Endpoint

app.get('/weather/:latlon', async (req, res) => {
    const latlon = req.params.latlon.split(',')
    const lat = latlon[0]
    const lon = latlon[1]
    //  console.log(lat, lon)

    // Api Key to OWM

    const apiKeyWeather = process.env.API_KEY_WEATHER // Connect to .env
    const apiKeyAqi = process.env.API_KEY_AQI // Connect to .env

    // Request weather

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKeyWeather}&units=metric` // 1. URL
    const weatherResponse = await fetch(weatherUrl) // 2. RESPONSE
    const weatherJson = await weatherResponse.json() // 3. JSON RESPONSE

    // Request AQI

    const aqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiKeyAqi}`
    const aqiResponse = await fetch(aqiUrl)
    const aqiJson = await aqiResponse.json()

    // console.log()aqiJson -> to prove if good


    // console.log(weatherJson)
    // TODO : AQI API einfügen

    const data = {
        weather: weatherJson,
        aqi: aqiJson
    }

    // Resend response to client
    res.json(data)
})