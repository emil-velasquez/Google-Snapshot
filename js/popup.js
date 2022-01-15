document.getElementById("info-button").addEventListener("click", togglePopup);

function togglePopup() {
    var popup = document.getElementById("myPopup");
    var socials = document.getElementById("social-link-container");
    popup.classList.toggle("show");
    socials.classList.toggle("show");
}