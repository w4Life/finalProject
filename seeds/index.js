if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const path = require('path')
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mbxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mbxToken})

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("CONNECTED")
    })
    .catch(err => {
        console.log(err)
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < cities.length; i++) {
        const ranPrice = Math.floor(Math.random() * 30)
        const camp = new Campground({
            author: '643b3b2f8ba71d9e450c1196',
            location: `${cities[i].name}, Vietnam`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dsa07ixj9/image/upload/v1681666433/YelpCamp/55009_tjnajv.jpg',
                    filename: 'YelpCamp/55009_tjnajv.jpg',
                },
                {
                    url: 'https://res.cloudinary.com/dsa07ixj9/image/upload/v1681666426/YelpCamp/55014_svum9r.jpg',
                    filename: 'YelpCamp/55014_svum9r.jpg',
                },
                {
                    url: 'https://res.cloudinary.com/dsa07ixj9/image/upload/v1681666421/YelpCamp/55019_ettjhl.jpg',
                    filename: 'YelpCamp/55019_ettjhl.jpg',
                },
                {
                    url: 'https://res.cloudinary.com/dsa07ixj9/image/upload/v1681666409/YelpCamp/55024_bbe3o8.jpg',
                    filename: 'YelpCamp/55024_bbe3o8.jpg',
                }
            ],
            description: 'This is description',
            price: ranPrice
        })
        const geoData = await geocoder.forwardGeocode({
            query: camp.location,
            limit: 1
        }).send()
        camp.geometry = geoData.body.features[0].geometry
        await camp.save()
    }
}

seedDb().then(() => {
    mongoose.connection.close()
})

