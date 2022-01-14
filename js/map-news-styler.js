var googleTrends = require("google-trends-api");

//array of colors to color the map with
const colorsArray = [
  "#EE4035", "#F37736", "#FDF498", "#7BC043", "#0392CF",
  "#76b6c4", "#A200FF", "#FFC300", "#D696BB", "#FF6666",
  "#525266", "#FFE5A9", "#83ADB5", "#C7BBC9", "#5E3C58",
  "#FFC5D9", "#FFCB85", "#967259", "#634832", "#074E67"
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
  console.log(stateTopicMap);
  let colorIndex = Math.floor(Math.random() * (colorsArray.length));
  console.log(colorIndex);

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
  let sortedTopics = await countSortTopics(topicToColor);

  //get the dailytrend data again
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

