//array of state abbreviations to loop through create an array of document elements 
//that correspond to the 
const stateAbbreviations = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

//creating a dictionary to pair our state abbreviations with its element
let abbreviationElementDictionary = new Object();
for (let abbreviation of stateAbbreviations) {
  console.log(abbreviation);
  abbreviationElementDictionary[abbreviation] = document.getElementById(abbreviation);
  abbreviationElementDictionary[abbreviation].style.fill = generateRandomColor();
}


//test grabbing the element
var massachusetts = document.getElementById('MA');
massachusetts.style.fill = "green";

//just for testing
//https://www.educative.io/edpresso/how-to-generate-a-random-color-in-javascript
function generateRandomColor() {
  let maxVal = 0xFFFFFF; // 16777215
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);
  return `#${randColor.toUpperCase()}`
}


//these functions provided by https://dev.to/codecustard/creating-an-interactive-map-of-the-us-b5o
var detailsBox = document.getElementById("details-box");

document.addEventListener('mouseover', function (e) {
  if (e.target.tagName == 'path') {
    var content = e.target.dataset.name;
    detailsBox.innerHTML = content;
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