const getImageNumber = (() => Math.ceil(Math.random() * 7))();
const SRC = 'images/pics/' + getImageNumber + '.jpg';

const image = document.querySelector('#cover-image');
image.src = SRC;
window.onload = function() {
    console.log('Welcome to my Page');
}