//array of colors to color the map with
const colorsArray = [
  "#922B21", "#E74C3C", "#AF7AC5", "#6C3483", "#2980B9",
  "#2980B9", "#2980B9", "#2980B9", "#2980B9", "#2980B9",
  "#2980B9", "#2980B9", "#2980B9", "#2980B9", "#2980B9",
  "#31E611", "#31E611", "#C33F3F", "#CB7C7C", "#CB7C7C"
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

  await colorMap(abbreviationElementDictionary)

}

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
    console.log(topicColorMap[topic]);
    abbreviationElementDictionary[abbreviation].style.fill = topicColorMap[topic];
  }
}

//control flow starts here
main();

//these functions from https://dev.to/codecustard/creating-an-interactive-map-of-the-us-b5o
var detailsBox = document.getElementById("details-box");

document.addEventListener('mouseover', function (e) {
  if (e.target.tagName == 'path') {
    let content = e.target.dataset.name;
    let stateID = e.target.dataset.id;
    detailsBox.innerHTML = content + ": " + stateTopicMap["US-" + stateID];
    detailsBox.style.opacity = "100%";
  }
  else {
    detailsBox.style.opacity = "0%";
  }
});

window.onmousemove = function (e) {
  var x = e.clientX,
    y = e.clientY;
  detailsBox.style.top = (y + 20) + 'px';
  detailsBox.style.left = (x) + 'px';
};

