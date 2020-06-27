const getImageNumber = (() => Math.ceil(Math.random() * 7))();
const SRC = 'images/pics/' + getImageNumber + '.jpg';

const image = document.querySelector('#cover-image');
image.src = SRC;
window.onload = function() {
    console.log('Welcome to my Page');
}

const openMenuNavigation = function() {
    const navigation = document.querySelector(".nav-header.-mobile");
    if(navigation.style.maxHeight)
        navigation.style.maxHeight = null;
    else {
        navigation.style.maxHeight = '100px';
    }
}
