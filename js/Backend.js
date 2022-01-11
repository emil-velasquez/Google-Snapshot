const googleTrends = require("google-trends-api");
const stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

//function declarations
async function main() {
    //grab up to 20 of the current trending searchs according to ggogle
    let googleSearches = await getDailyTrendingSearches();



}

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

//command flow starts here
main();