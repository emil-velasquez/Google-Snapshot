//array of colors to color the map with
const colorsArray = [
  '#E57373', '#BA68C8', '#7986CB', '#4FC3F7', '#4DB6AC',
  '#AED581', '#FFF176', '#FFB74D', '#A1887F', '#90A4AE',
  '#F06292', '#9575CD', '#64B5F6', '#4DD0E1', '#81C784',
  '#DCE775', '#FFD54F', '#FF8A65', '#BDBDBD', '#90A4AE',
]

const stateAbbs = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

var stateTopicMap;

async function main() {
  //creating a dictionary to pair our state abbreviations with its element
  let abbreviationElementDictionary = new Object();
  for (let abbreviation of stateAbbs) {
    abbreviationElementDictionary[abbreviation] = document.getElementById(abbreviation);
  }

  let topicToColor = await colorMap(abbreviationElementDictionary)
  await getArticles(topicToColor);
}

//colors the map of the united states by topic and returns the dictionary mapping 
async function colorMap(abbreviationElementDictionary) {
  //grab the mapping from state:topic (note: state is in form US-XX)
  stateTopicMap = await findMostRelevantTopicByState();
  let colorIndex = Math.floor(Math.random() * (colorsArray.length));

  //create a dictionary mapping topics to colors
  topicColorMap = new Object();

  //for every state
  for (const [state, topic] of Object.entries(stateTopicMap)) {
    //get its true abbreviation
    let abbreviation = state.slice(3);

    //if the state's topic isn't in our topicColorMap
    if (!(topic in topicColorMap)) {
      //we want to add it to our mapping
      topicColorMap[topic] = colorsArray[colorIndex];

      //update the colorIndex
      colorIndex++;
      if (colorIndex >= colorsArray.length) {
        colorIndex = 0;
      }
    }

    //update the state's color
    abbreviationElementDictionary[abbreviation].style.fill = topicColorMap[topic];
  }

  return topicColorMap;
}

//populates the articles section
async function getArticles(topicToColor) {
  const numArticles = 4;

  let sortedTopics = await countSortTopics(topicToColor);

  //get the dailytrend data again
  //TODO: create a method on the backend that keeps from calling dailyTrends twice
  let dailyTrendsResults = getDailyTrendsResults();
  const jsonTrendResults = JSON.parse(dailyTrendsResults);
  const searchResults = jsonTrendResults.default.trendingSearchesDays[0].trendingSearches;

  //for every topic that has a state
  for (const [topic, number] of sortedTopics) {

    //build a header for it
    let divHeader = document.createElement("div");
    divHeader.id = "article-container";

    let circleColor = topicToColor[topic];
    divHeader.innerHTML =
      "<i id=\"circle-header\" class=\"fas fa-circle\" style=\"color:" + circleColor + "\"></i >" +
      "<h2>" + topic + "</h2>";
    document.getElementById("related-articles").appendChild(divHeader);

    //populate its articles
    let articles = document.createElement("div");
    articles.id = "article-card-container";

    //find the trendingSearchesObject that correlates with the topic
    let topicIndex = 0;
    let foundTopic = false;
    while (!foundTopic && topicIndex < searchResults.length) {
      let currentTopic = searchResults[topicIndex];
      if (currentTopic.title.query === topic) {
        foundTopic = true;
        let articleArray = currentTopic.articles;

        //for a max of 3 articles or there are no more articles
        let articleIndex = 0;
        while (articleIndex < numArticles && articleIndex < articleArray.length) {
          let currentArticle = articleArray[articleIndex];
          let currentTitle = currentArticle.title;
          let currentLink = currentArticle.url;
          let currentAuthor = currentArticle.source;

          let currentImage;
          try {
            currentImage = currentArticle.image.imageUrl;
          } catch {
            currentImage = "";
          }

          let articleCard = document.createElement("div");
          articleCard.id = "article-card"
          articleCard.innerHTML =
            "<a id=\"article-link\" href=\"" + currentLink + "\">" +
            "<img id=\"article-image\" src=\"" + currentImage + "\">" +
            "<div id=\"article-text\">" +
            "<p>" + currentTitle + "</p>" +
            "<p>" + currentAuthor + "</p>" +
            "</div>" +
            "</a>";
          articles.appendChild(articleCard);
          articleIndex++;
        }
        document.getElementById("related-articles").appendChild(articles);
      }
      topicIndex++;
    }
  }

  //now, loop through the rest of trending searchs and build their cards underneath the mapped
  //topics
  //create a header
  let additionalArticleHeader = document.createElement("h1");
  additionalArticleHeader.textContent = "Other Trending Searches";
  document.getElementById("related-articles").appendChild(additionalArticleHeader);

  //loop here
  for (const addArticle of searchResults) {
    if (!(addArticle.title.query in topicToColor)) {
      //build a header for it
      let divHeader = document.createElement("div");
      divHeader.id = "article-container";
      divHeader.innerHTML =
        "<i id=\"circle-header\" class=\"fas fa-circle\" style=\"color:white\"></i >" +
        "<h2>" + addArticle.title.query + "</h2>";

      document.getElementById("related-articles").appendChild(divHeader);

      //populate its articles
      let articles = document.createElement("div");
      articles.id = "article-card-container";

      foundTopic = true;
      let articleArray = addArticle.articles;

      //for a max of 3 articles or there are no more articles
      let articleIndex = 0;
      while (articleIndex < numArticles && articleIndex < articleArray.length) {
        let currentArticle = articleArray[articleIndex];
        let currentTitle = currentArticle.title;
        let currentLink = currentArticle.url;
        let currentAuthor = currentArticle.source;

        let currentImage;
        try {
          currentImage = currentArticle.image.imageUrl;
        } catch {
          currentImage = "";
        }

        let articleCard = document.createElement("div");
        articleCard.id = "article-card"
        articleCard.innerHTML =
          "<a id=\"article-link\" href=\"" + currentLink + "\">" +
          "<img id=\"article-image\" src=\"" + currentImage + "\">" +
          "<div id=\"article-text\">" +
          "<p>" + currentTitle + "</p>" +
          "<p>" + currentAuthor + "</p>" +
          "</div>" +
          "</a>";
        articles.appendChild(articleCard);
        articleIndex++;
      }
      document.getElementById("related-articles").appendChild(articles);
    }
  }
}

//counts the number of states per topic and then sorts the dictionary to return
async function countSortTopics(topicToColorMap) {
  //stateTopicMap is exposed for use here
  let topicCounter = new Object();

  //initialize our topicCounter for every topic we know we have at least 1 reference to
  for (const [topic, color] of Object.entries(topicToColorMap)) {
    topicCounter[topic] = 0;
  }

  //loop through the stateTopicMap and increment the correct value
  for (const [state, topic] of Object.entries(stateTopicMap)) {
    topicCounter[topic]++;
  }

  //sorting the dictionary with https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
  //creating an array representation of our dictionary
  var sortedItems = Object.keys(topicCounter).map(function (key) {
    return [key, topicCounter[key]];
  });

  sortedItems.sort(function (first, second) {
    return second[1] - first[1];
  })

  return sortedItems;
}

//control flow starts here
main();

//these functions from https://dev.to/codecustard/creating-an-interactive-map-of-the-us-b5o
var detailsBox = document.getElementById("details-box");

//updates the (window detailing state: topic)'s content with the currently hovered state
document.addEventListener('mouseover', function (e) {
  if (e.target.tagName == 'path') {
    let content = e.target.dataset.name;
    let stateID = e.target.dataset.id;
    try {
      detailsBox.innerHTML = content + ": " + stateTopicMap["US-" + stateID];
    } catch {
      detailsBox.innerHTML = "Loading..."
    }
    detailsBox.style.opacity = "100%";
  }
  else {
    detailsBox.style.opacity = "0%";
  }
});

//moves the window detailing state: topic to the mouse position when over a state
window.onmousemove = function (e) {
  var x = e.clientX,
    y = e.clientY;
  detailsBox.style.top = (y + 20) + 'px';
  detailsBox.style.left = (x) + 'px';
};