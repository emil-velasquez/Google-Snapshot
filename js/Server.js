const googleTrends = require('google-trends-api');

var googleSearches = [];

//grabs the latest 20 trending searches according to google
//puts theses searches in googleSearches
googleTrends.dailyTrends({ geo: 'US' }, function (err, results) {
    if (err) {
        console.log(err);
    } else {
        const jsonResults = JSON.parse(results);
        const searchResults = jsonResults.default.trendingSearchesDays[0].trendingSearches;
        for (let result of searchResults) {
            googleSearches.push(result.title.query);
        }
        for (let check of googleSearches) {
            console.log(check);
        }
    }
})

console.log(googleSearches);

//for each of those google searches, we will look at its interest staying exactly 1 day
//from right now

//because of the limitation of 5 seaches per query, we have to use this idea from:
//https://towardsdatascience.com/using-google-trends-at-scale-1c8b902b6bfa
//basically, in every query, we need to have a control term that is more popular
//than all of our google searches
//we then build queries of [control term + 4 of our trending seraches]
//everything will be scaled according to the control, letting us compare the percentage
//among the google searches to get the popularity data we want by state

//set up a dictionary that maps every state to its top trending result
//the dictionary should be initialized to map every state to googleSearches[0]
const stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

let mostRelevantTopicByState = new Object();
for (let abbreviation of stateAbbreviations) {
    mostRelevantTopicByState["US-" + abbreviation] = googleSearches[0];
}

//parsing the googleSearches array
const SET_SIZE = 4;
//if this ends up decimal, the for loop will allow us to view that decimal as the incomplete set 
//at the end
const NUM_SETS = googleSearches.length / SET_SIZE;

const today = new Date();
const yesterday = new Date(today.getDate() - 1);

for (let sets = 0; sets < NUM_SETS; sets++) {
    //figuring out bounds of our search
    let start = sets * SET_SIZE;
    let end;
    if (start + 1 > NUM_SETS) {
        end = googleSearches.length;
    } else {
        end = (sets + 1) * SET_SIZE;
    }
    console.log('here 1')
    //construct the search query with the current top trending as the first topic
    let searchQuery = [googleSearches[0]];
    for (let searchIndex = start; searchIndex < end; searchIndex++) {
        if (googleSearches[searchIndex] != googleSearches[0]) {
            searchQuery.push(googleSearches[searchIndex]);
        }
    }

    //conduct the search
    googleTrends.interestByRegion({ keyword: searchQuery, startTime: yesterday, geo: "US" })
        .then((res) => {
            const jsonInterestResults = JSON.parse(res);
            const interestRegionArray = jsonInterestResults.default.geoMapData;
            for (let region of interestRegionArray) {
                let regionName = region.geoCode;
                console.log(regionName);
                if (mostRelevantTopicByState.includes(regionName)) {
                    console.log("here");
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
}