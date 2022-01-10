const googleTrends = require('google-trends-api');

googleTrends.dailyTrends({ geo: 'US' }, function (err, results) {
    if (err) {
        console.log(err);
    } else {
        console.log(results);
    }
})

console.log("break")

googleTrends.interestByRegion({ keyword: 'Donald Trump', startTime: new Date('2017-02-01'), endTime: new Date('2017-02-06'), geo: 'US' })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })