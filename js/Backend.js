const googleTrends = require("google-trends-api");
const stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

//dictionary to keep track of alternate predictedTop
var predictedTopSearches = new Object();

//function declarations
async function main() {
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

    //TODO: Experiment with different starting days for yesterday
    const today = new Date();
    const yesterday = new Date(today.getDate() - 1);

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
            await updateRelevantTopicByState(start, end, yesterday, topic, googleSearches,
                mostRelevantTopicByState, predictedTopSearches);
        }
    }

    console.log(mostRelevantTopicByState);

}

//returns a list of the current trending searches for today
async function getDailyTrendingSearches() {
    let googleSearches = [];
    let dailyTrendsResults = await googleTrends.dailyTrends({ geo: "US" });
    const jsonTrendResults = JSON.parse(dailyTrendsResults);
    const searchResults = jsonTrendResults.default.trendingSearchesDays[0].trendingSearches;
    for (let result of searchResults) {
        googleSearches.push(result.title.query);
    }
    return googleSearches;
}

//updates the mostRelevantTopicByState dictionary based on predicted top search term
//this update will work through pass-by-sharing (nothing will be returned by the function)
async function updateRelevantTopicByState(start, end, yesterday, predictedTop, googleSearches,
    mostRelevantTopicByState, predictedTopSearches) {
    //construct a searchQuery from start to end, starting with predictedTop
    let searchQuery = [predictedTop];
    for (let searchIndex = start; searchIndex < end; searchIndex++) {
        if (googleSearches[searchIndex] !== predictedTop) {
            searchQuery.push(googleSearches[searchIndex]);
        }
    }

    //use this searchQuery to find the interest of the terms by region
    await googleTrends.interestByRegion({ keyword: searchQuery, startTime: yesterday, geo: "US" })
        .then((res) => {
            console.log(searchQuery);
            const jsonInterestResults = JSON.parse(res);
            const interestRegionArray = jsonInterestResults.default.geoMapData;
            //for each state in our array
            for (let region of interestRegionArray) {
                let regionName = region.geoCode;
                //check if it is a state we care about (aka 1 of the 50 states)
                //also check if that state is part of this search
                if (regionName in mostRelevantTopicByState) {
                    if (mostRelevantTopicByState[regionName] === predictedTop) {
                        checkRegion(region, searchQuery, mostRelevantTopicByState,
                            predictedTopSearches);
                    }
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })


}

//finds the most relevant topic from the searchQuery and updates the dictionaries
async function checkRegion(region, searchQuery, mostRelevantTopicByState, predictedTopSearches) {
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

//command flow starts here
main();