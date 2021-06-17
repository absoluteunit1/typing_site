var keyboard = document.querySelector(".keyboard");

function size () {
    var size = keyboard.parentNode.clientWidth / 90;
    keyboard.style.fontSize = size + 'px';
    console.log(size);
}

window.addEventListener('resize', function (e) {
    size();
});
size();