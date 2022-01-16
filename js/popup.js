document.getElementById("info-button").addEventListener("click", togglePopup);

function togglePopup() {
    var popup = document.getElementById("myPopup");
    var socials = document.getElementById("social-link-container");
    var license = document.getElementById("license-link");
    popup.classList.toggle("show");
    socials.classList.toggle("show");
    license.classList.toggle("show");
}