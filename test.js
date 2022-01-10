//use getElemntById to create a list of all the path elements in the united states map 
//the ids are the state initials
var detailsBox = document.getElementById('details-box');

//test grabbing the element
var massachusetts = document.getElementById('MA');
massachusetts.style.fill = "green";

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