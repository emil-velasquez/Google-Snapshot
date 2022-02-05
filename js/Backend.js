var googleTrends = require("google-trends-api");

//array of state abbreviations to loop through create an array of document elements 
//that correspond to the
stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

//dictionary to keep track of alternate predictedTop
predictedTopSearches = new Object();
var dailyTrendsResults;

//function declarations
findMostRelevantTopicByState = async function () {
    //grab up to 20 of the current trending searchs according to ggogle
    let googleSearches = await getDailyTrendingSearches();

    //dictionary mapping each state to its most popular search
    //initialized assuming that the overall most trending search is the most popular search
    let mostRelevantTopicByState = new Object();
    for (let abbreviation of stateAbbreviations) {
        mostRelevantTopicByState["US-" + abbreviation] = googleSearches[0];
    }

    const QUERY_SIZE = 4;
    const NUM_QUERIES = googleSearches.length / QUERY_SIZE;

    const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000
    const NUM_DAYS_FROM_TODAY = 3;
    const today = new Date(Date.now());
    const yesterday = new Date(today - NUM_DAYS_FROM_TODAY * DAY_IN_MILLISECONDS);

    //dictionary to keep track of alternate predictedTop
    predictedTopSearches = new Object();
    predictedTopSearches[googleSearches[0]] = 50;

    for (let queries = 0; queries < NUM_QUERIES; queries++) {
        //figure out bounds of the query
        let start = queries * QUERY_SIZE;
        let end;
        if (queries + 1 > NUM_QUERIES) {
            end = googleSearches.length;
        } else {
            end = (queries + 1) * QUERY_SIZE;
        }
        for (const [topic, number] of Object.entries(predictedTopSearches)) {
            //generate list of all alternate predictedTops that need to be searched through
            await updateRelevantTopicByState(start, end, topic, googleSearches,
                mostRelevantTopicByState, predictedTopSearches);
        }
    }
    return mostRelevantTopicByState;
}

//returns a list of the current trending searches for today
getDailyTrendingSearches = async function () {
    let googleSearches = [];
    dailyTrendsResults = await googleTrends.dailyTrends({ geo: "US" });
    const jsonTrendResults = JSON.parse(dailyTrendsResults);
    const searchResults = jsonTrendResults.default.trendingSearchesDays[0].trendingSearches;
    for (let result of searchResults) {
        googleSearches.push(result.title.query);
    }
    return googleSearches;
}

//updates the mostRelevantTopicByState dictionary based on predicted top search term
//this update will work through pass-by-sharing (nothing will be returned by the function)
updateRelevantTopicByState = async function (start, end, predictedTop, googleSearches,
    mostRelevantTopicByState, predictedTopSearches) {
    //construct a searchQuery from start to end, starting with predictedTop
    let searchQuery = [predictedTop];
    for (let searchIndex = start; searchIndex < end; searchIndex++) {
        if (googleSearches[searchIndex] !== predictedTop) {
            searchQuery.push(googleSearches[searchIndex]);
        }
    }

    await interestByRegionDaily(searchQuery)
        .then((res) => {
            const jsonInterestResults = JSON.parse(res);
            const interestRegionArray = jsonInterestResults.default.geoMapData;
            for (let region of interestRegionArray) {
                let regionName = region.geoCode;
                if (regionName in mostRelevantTopicByState) {
                    if (mostRelevantTopicByState[regionName] === predictedTop) {
                        checkRegion(region, searchQuery, mostRelevantTopicByState,
                            predictedTopSearches);
                    }
                }
            }
        })
}

//finds the most relevant topic from the searchQuery and updates the dictionaries
checkRegion = async function (region, searchQuery, mostRelevantTopicByState,
    predictedTopSearches) {
    let regionName = region.geoCode;
    //if it is, we run a check through its array of percentages
    let relevancePercentage = region.value;
    //find the index of the max percentage
    let maxIndex = -1;
    let maxPercentage = -1;
    for (let index = 0; index < relevancePercentage.length; index++) {
        if (relevancePercentage[index] > maxPercentage) {
            maxIndex = index;
            maxPercentage = relevancePercentage[index];
        }
    }
    //find the topic with the max percentage
    let mostRelevantTopic = searchQuery[maxIndex];

    //check if this topic is not what is currently stored in the dictionary
    if (mostRelevantTopicByState[regionName] !== mostRelevantTopic) {
        //update the dictionary keeping track of alt topPredictedTopics
        //take from its predictedTop
        predictedTopSearches[mostRelevantTopicByState[regionName]] =
            predictedTopSearches[mostRelevantTopicByState[regionName]] - 1;
        if (predictedTopSearches[mostRelevantTopicByState[regionName]] <= 0) {
            delete predictedTopSearches[mostRelevantTopicByState[regionName]];
        }
        //add to the dictionary the new mostRelevantTopic
        if (!(mostRelevantTopic in predictedTopSearches)) {
            predictedTopSearches[mostRelevantTopic] = 0;
        }
        predictedTopSearches[mostRelevantTopic]++;

        //update the dictionary of states to topics
        mostRelevantTopicByState[regionName] = mostRelevantTopic;
    }
}

getDailyTrendsResults = function () {
    return dailyTrendsResults;
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

async function interestByRegionDaily(search) {
    widgetURLGet = getWidgetURL(search);

    let widgetData = httpGet(widgetURLGet);
    widgetData = widgetData.slice(5);
    const jsonWidgetData = JSON.parse(widgetData);
    const jsonWidgetInfoContainer = jsonWidgetData.widgets[1];
    const timeBounds = jsonWidgetInfoContainer.request.comparisonItem[0].time;
    const token = jsonWidgetInfoContainer.token;

    let comparedGeoURL = getComparedGeoURL(timeBounds, token, search);
    console.log(comparedGeoURL);
    let comparedGeoData = httpGet(comparedGeoURL);
    comparedGeoData = comparedGeoData.slice(6);

    return comparedGeoData;
}

function getWidgetURL(searchQuery) {
    let widgetURL = "https://trends.google.com/trends/api/explore?hl=en-US&tx=360&req=";
    let urlObject = new Object();
    urlObject.comparisonItem = [];
    for (let query of searchQuery) {
        let queryObject = new Object();
        queryObject.keyword = query;
        queryObject.geo = "US";
        queryObject.time = "now 1-d";
        urlObject.comparisonItem.push(queryObject);
    }
    urlObject.category = 0;
    urlObject.property = "";
    widgetURL = widgetURL + JSON.stringify(urlObject);
    widgetURL = widgetURL + "&tz=360";
    return widgetURL;
}

function getComparedGeoURL(timeBounds, curToken, searchQuery) {
    let callURL = "https://trends.google.com/trends/api/widgetdata/comparedgeo?hl=en-US&tz=360&req=";
    let urlObject = new Object();

    let geoObject = new Object();
    geoObject.country = "US";
    urlObject.geo = geoObject;

    urlObject.comparisonItem = [];
    for (let query of searchQuery) {
        let queryObject = new Object();
        queryObject.time = timeBounds;

        let keywordRestrictionObject = new Object();
        keywordRestrictionObject.keyword = [];
        let searchObject = new Object();
        searchObject.type = "BROAD";
        console.log(query);
        searchObject.value = query;
        keywordRestrictionObject.keyword.push(searchObject);

        queryObject.complexKeywordsRestriction = keywordRestrictionObject;

        urlObject.comparisonItem.push(queryObject);
    }

    urlObject.resolution = "REGION";
    urlObject.locale = "en-US";

    let requestOptionObject = new Object();
    requestOptionObject.property = "";
    requestOptionObject.backend = "CM";
    requestOptionObject.category = 0;
    urlObject.requestOptions = requestOptionObject;

    urlObject.dataMode = "PERCENTAGES";

    callURL = callURL + JSON.stringify(urlObject);
    callURL = callURL + "&token=" + curToken;

    return callURL;
}