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

document.addEventListener("DOMContentLoaded", function() {
    var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  
    if ("IntersectionObserver" in window) {
      let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            let lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove("lazy");
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });
  
      lazyImages.forEach(function(lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      // Possibly fall back to event handlers here
    }
  });