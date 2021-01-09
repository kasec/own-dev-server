export default function() {
  const getImageNumber = (() => Math.ceil(Math.random() * 7))();
  const image = document.querySelector('#cover-image');
  const SRC = '/assets/images/pics/' + getImageNumber + '.jpg';
  console.log('adding something');
  
  if(image) {
    image.dataset.src = SRC;
    image.dataset.srcset = SRC;
  }
  
  window.onload = function() {
      console.log('maricas');
  }
  
  const openMenuNavigation = function() {
      const navigation = document.querySelector(".nav-header.-mobile");
      if(navigation.style.maxHeight)
          navigation.style.maxHeight = null;
      else {
          navigation.style.maxHeight = '150px';
      }
  }
  
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
      } else {
        // Possibly fall back to event handlers here
      }
    });
    
}