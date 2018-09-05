const request = require('request');

var geocodeAddress = (address, callback) => {
    var encodedAddress = encodeURI(address);
// var url = `http://www.mapquestapi.com/geocoding/v1/address?key=uUVa97uk5TxaZ6rAdWFC4RCKE2xuvBIU&location=${encodedAddress}`;

    var googleMapsAPIURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

    request({
        url: googleMapsAPIURL,
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Unable to connect to the google servers.');
        } else if (body.status === 'ZERO_RESULTS') {
            callback('Unable to find that address.')
        } else if (body.status === 'OVER_QUERY_LIMIT') {
            callback('Over Query Limit.')
        } else if (body.status === 'OK') {
            callback(undefined, {
                address: body.results[0].formatted_address,
                latitude: body.results[0].geometry.location.lat,
                longitude: body.results[0].geometry.location.lng
            });
        }

        // console.log(`Address: ${body.results[0].providedLocation.location}`);
        // console.log(`Latitude: ${body.results[0].locations[0].latLng.lat}`);
        // console.log(`Longitude: ${body.results[0].locations[0].latLng.lng}`);
    });
};

module.exports = {
    geocodeAddress
};
