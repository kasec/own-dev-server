
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
console.log('hello world');

const getImageNumber = (() => Math.ceil(Math.random() * 7))();
const image = document.querySelector('#cover-image');
const SRC = 'assets/images/pics/' + getImageNumber + '.jpg';

if(image) {
  image.dataset.src = SRC;
  image.dataset.srcset = SRC;
}

window.onload = function() {
    console.log('Welcome to my Page');
};
const openMenuNavigation = function() {
    const navigation = document.querySelector(".nav-header.-mobile");
    if(navigation.style.maxHeight)
        navigation.style.maxHeight = null;
    else {
        navigation.style.maxHeight = '150px';
    }
};

const btn = document.querySelector('.menu-navigation-button');
btn.addEventListener('click', openMenuNavigation);

document.addEventListener("DOMContentLoaded", function() {
    var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
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
    }
  });
