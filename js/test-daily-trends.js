var googleTrends = require("google-trends-api");

const testURL = "https://trends.google.com/trends/api/explore?hl=en-US&tz=360&req={\"comparisonItem\":[{\"keyword\":\"Malzahar\",\"geo\":\"US\",\"time\":\"now 1-d\"},{\"keyword\":\"Miss Fortune\",\"geo\":\"US\",\"time\":\"now 1-d\"},{\"keyword\":\"Gangplank\",\"geo\":\"US\",\"time\":\"now 1-d\"}],\"category\":0,\"property\":\"\"}&tz=360";

var testInputs = ["Taylor Swift", "Billie Eilish", "Kanye"];

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000
const NUM_DAYS_FROM_TODAY = 4;
const today = new Date(Date.now());
const yesterday = new Date(today - NUM_DAYS_FROM_TODAY * DAY_IN_MILLISECONDS);

function httpGetAsync(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            console.log(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

httpGetAsync(testURL);


//https://trends.google.com/trends/api/dailytrends?hl=en-US&tz=360&geo=US&cat=all&ed=20220122&ns=15

/* Example URL to grab Widget Data (Need 2nd Widget Token and Specific Time Bounds)
https://trends.google.com/trends/api/explore?hl=en-US
&tz=360
&req=
{\"comparisonItem\":[
    {\"keyword\":\"Malzahar\",\"geo\":\"US\",\"time\":\"now 1-d\"},
    {\"keyword\":\"Miss Fortune\",\"geo\":\"US\",\"time\":\"now 1-d\"},
    {\"keyword\":\"Gangplank\",\"geo\":\"US\",\"time\":\"now 1-d\"}
],
\"category\":0,
\"property\":\"\"}
&tz=360
*/

/* Example of Compared geo Call
https://trends.google.com/trends/api/widgetdata/comparedgeo?hl=en-US
&tz=360
&req=
{"geo":{"country":"US"},
"comparisonItem":[
    {"time":"2022-01-23T05\\:55\\:17 2022-01-24T05\\:55\\:17","complexKeywordsRestriction":{"keyword":[{"type":"BROAD","value":"Malzahar"}]}},
    {"time":"2022-01-23T05\\:55\\:17 2022-01-24T05\\:55\\:17","complexKeywordsRestriction":{"keyword":[{"type":"BROAD","value":"Miss Fortune"}]}},
    {"time":"2022-01-23T05\\:55\\:17 2022-01-24T05\\:55\\:17","complexKeywordsRestriction":{"keyword":[{"type":"BROAD","value":"Gangplank"}]}}
],
"resolution":"REGION",
"locale":"en-US",
"requestOptions":{"property":"","backend":"CM","category":0},
"dataMode":"PERCENTAGES"}
&token=APP6_UEAAAAAYe-QxT6O-Sa5ecvEaI24WUD3yAfF0ksX
*/

/*
<script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/2790_RC04/embed_loader.js">
</script>
<script type="text/javascript">
trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":
[{"keyword":"Soccer","geo":"US","time":"2022-01-20T07 2022-01-21T07"}
,{"keyword":"Football","geo":"US","time":"2022-01-20T07 2022-01-21T07"}
,{"keyword":"Basketball","geo":"US","time":"2022-01-20T07 2022-01-21T07"}]
,"category":0,"property":""},
{"exploreQuery":"date=2022-01-20T07%202022-01-21T07&geo=US&q=Soccer,Football,Basketball",
"guestPath":"https://trends.google.com:443/trends/embed/"});
</script>
*/

/*
'https://trends.google.com/trends/api/explore?hl=en-US&req=%7B%22comparisonItem%22%3A%5B%7B%22keyword%22%3A%22Taylor%20Swift%22%2C%22startTime%22%3A%222022-01-21T00%3A56%3A44.648Z%22%2C%22geo%22%3A%22US%22%2C%22hl%22%3A%22en-US%22%2C%22category%22%3A0%2C%22timezone%22%3A360%2C%22property%22%3A%22%22%2C%22endTime%22%3A%222022-01-22T00%3A56%3A44.649Z%22%2C%22time%22%3A%222022-01-21%202022-01-22%22%7D%2C%7B%22keyword%22%3A%22Billie%20Eilish%22%2C%22startTime%22%3A%222022-01-21T00%3A56%3A44.648Z%22%2C%22geo%22%3A%22US%22%2C%22hl%22%3A%22en-US%22%2C%22category%22%3A0%2C%22timezone%22%3A360%2C%22property%22%3A%22%22%2C%22endTime%22%3A%222022-01-22T00%3A56%3A44.649Z%22%2C%22time%22%3A%222022-01-21%202022-01-22%22%7D%2C%7B%22keyword%22%3A%22Kanye%22%2C%22startTime%22%3A%222022-01-21T00%3A56%3A44.648Z%22%2C%22geo%22%3A%22US%22%2C%22hl%22%3A%22en-US%22%2C%22category%22%3A0%2C%22timezone%22%3A360%2C%22property%22%3A%22%22%2C%22endTime%22%3A%222022-01-22T00%3A56%3A44.649Z%22%2C%22time%22%3A%222022-01-21%202022-01-22%22%7D%5D%2C%22category%22%3A0%2C%22property%22%3A%22%22%7D&tz=360
*/

/*
https://trends.google.com/trends/api/widgetdata/
comparedgeo?hl=en-US&tz=360&req=%7B%22geo%22:%7B%22country%22:%22US%22%7D,
%22comparisonItem%22:%5B%7B%22time%22:%222022-01-21T22%5C%5C:30%5C%5C:48+2022-01-22T22%5C%5C:30%5C%5C
:48%22,%22complexKeywordsRestriction%22:%7B%22keyword%22:%5B%7B%22type%22
:%22BROAD%22,%22value%22:%22Taylor+Swift%22%7D%5D%7D%7D,%7B%22time%22:%222022-01-21T22%5C%5C:30%5C%5C:48+2022-01-22T22%5C%5C:30%5C%5C:48%22,%22complexKeywordsRestriction%22:%7B%22keyword%22:%5B%7B%22type%22
:%22BROAD%22,%22value%22:%22Billie+Eilish%22%7D%5D%7D%7D,%7B%22time%22:%222022-01-21T22%5C%5C:30%5C%5C:48+2022-01-22T22%5C%5C:30%5C%5C:48%22,%22complexKeywordsRestriction%22:%7B%22keyword%22:%5B%7B%22type%22
:%22BROAD%22,%22value%22:%22John+Smith%22%7D%5D%7D%7D%5D,%22resolution%22:%22REGION%22,%22locale%22:%22en-US%22,%22requestOptions%22:%7B%22property%22:%22%22,%22backend%22:%22CM%22,%22category%22:0%7D,%22dataMode%22:
%22PERCENTAGES%22%7D&token=APP6_UEAAAAAYe3XGJFPLRKZqvlsz58oCfy_O2csf1Pv
*/

//https://trends.google.com/trends/api/widgetData/comparedgeo
//https://trends.google.com/trends/api/widgetdata/multiline?date=2022-01-20T07%202022-01-21T07&geo=US&q=Soccer,Football,Basketball&cat=all&ed=20220122&ns=15

/*
All of them:
APP6_UEAAAAAYe-QxRXplhymOnagxpr83X94Xi04dHsY
APP6_UEAAAAAYe-QxT6O-Sa5ecvEaI24WUD3yAfF0ksX

APP6_UEAAAAAYe-QxT6O-Sa5ecvEaI24WUD3yAfF0ksX

Decoded Explore Call:
https://trends.google.com/trends/api/explore?hl=en-US&tz=360&
req={"comparisonItem":[{"keyword":"Malzahar","geo":"US","time":"now 1-d"},
{"keyword":"Miss Fortune","geo":"US","time":"now 1-d"},
{"keyword":"Gangplank","geo":"US","time":"now 1-d"}],"category":0,"property":""}
&tz=360

Decoded: Compared Geo Call:
https://trends.google.com/trends/api/widgetdata/comparedgeo?hl=en-US&tz=360&
req={"geo":{"country":"US"},
"comparisonItem":[
{"time":"2022-01-23T05\\:55\\:17 2022-01-24T05\\:55\\:17","complexKeywordsRestriction":{"keyword":[{"type":"BROAD","value":"Malzahar"}]}},
{"time":"2022-01-23T05\\:55\\:17 2022-01-24T05\\:55\\:17","complexKeywordsRestriction":{"keyword":[{"type":"BROAD","value":"Miss Fortune"}]}},
{"time":"2022-01-23T05\\:55\\:17 2022-01-24T05\\:55\\:17","complexKeywordsRestriction":{"keyword":[{"type":"BROAD","value":"Gangplank"}]}}],
"resolution":"REGION","locale":"en-US","requestOptions":{"property":"","backend":"CM","category":0},
"dataMode":"PERCENTAGES"}&token=APP6_UEAAAAAYe-QxT6O-Sa5ecvEaI24WUD3yAfF0ksX

Hypothesis: If you do a call towards the explore (which doesn't require a token), a JSON is returned
that holds the auth token we need. We can then construct a get for the compared geo that uses
this token. This should allow us to get data trending for the day

Malzahar:
APP6_UEAAAAAYe-QxY33cubh0NPuxjBGU2LW12XpyFeP
APP6_UEAAAAAYe-QxVPiOOoRtyyeCfp79sV0s-luh1Ri

MF:
APP6_UEAAAAAYe-QxS1JggVPQN0sl5D3PkG12W33-tWO
APP6_UEAAAAAYe-QxfHiw5wdcbTdSj0-yf6reIlU-HzE

GP:
APP6_UEAAAAAYe-QxdHMLDYkII8WQ0GBbseSL1N0cGq5
APP6_UEAAAAAYe-QxQyAgEkNHJghnyMcaJyn1P3O2dXi
*/