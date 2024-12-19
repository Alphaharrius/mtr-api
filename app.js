const express = require('express');
const app = express();
const router = express.Router();

const port = 8080;

const data = require('./data/station_locations_with_id.json')

router.use(function (req, res, next) {
    console.log('/' + req.method);
    next();
});

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}

router.get('/nearest-station-id', function(req, res) {
    const { lat, lon } = req.query;
    const distance = []
    for (const row of data) {
        const d = getDistance(lat, lon, row['Lat'], row['Lon'])
        distance.push({id: row['ID'], distance: d})
    }
    // sort the distance array
    distance.sort((a, b) => a.distance - b.distance)
    res.setHeader('content-type', 'text/plain');
    res.send(distance[0].id.toString())
});

app.use('/', router);

app.listen(port, function () {
    console.log('MTR-API app listening on port 8080!');
})
