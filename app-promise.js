const yargs = require('yargs');
const axios = require('axios');

const  argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

var encodedAddress = encodeURIComponent(argv.address);

var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeURL).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find that address.');
    }

    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;

    var weatherURL = `https://api.darksky.net/forecast/640ba3635a6718f03c4c0975434ed9d9/${lat},${lng}?units=uk2`;
    console.log(response.data.results[0].formatted_address);

    return axios.get(weatherURL);
}).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;

    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`)

}).catch((e) => {
    if (e.code === 'ENOTFOUND' || e.code === 'ECONNREFUSED') {
        console.log('Unable to connect to API servers.')
    } else {
        console.log(e.message);
    }
});