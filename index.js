window.onload = function() {
    console.log('Welcome to my Page');
}
const summaries = document.querySelectorAll("summary");
const [ darkModeEl ] = document.getElementsByClassName('switch')

const foldableComponent = function() {
    
    summaries.forEach(summary => {
        const details = summary.closest("details");
    
        summary.addEventListener("click", function(event) {
            // first a guard clause: don't do anything 
            // if we're already in the middle of closing the menu.
            if (details.classList.contains("summary-closing")) {
                return;
            }
            // but, if the menu is open ...
            if (details.open) {
                // prevent default to avoid immediate removal of "open" attribute
                event.preventDefault();
                // add a CSS class that contains the animating-out code
                details.classList.add("summary-closing");
                // when enough time has passed (in this case, 500 milliseconds),
                // remove both the "open" attribute, and the "summary-closing" CSS 
                setTimeout(function() {
                    details.removeAttribute("open");
                    details.classList.remove("summary-closing");
                }, 500);
            }
        });
    
        // when user hovers over the summary element, 
        // add the open attribute to the details element
        summary.addEventListener("mouseenter", event => {
            details.setAttribute("open", "open");
        });
    
        // when the user moves the mouse away from the details element,
        // perform the out-animation and delayed attribute-removal
        // just like in the click handler
        details.addEventListener("mouseleave", event => {
            details.classList.add("summary-closing");
            setTimeout(function() {
                details.removeAttribute("open");
                details.classList.remove("summary-closing");
            }, 500);
            details.setAttribute("open", "open");
        });
    });
}
const darkModeHelper = function(evnt) {
    const container = document.querySelector('.container');
    const tabs = document.querySelector('.tabs');
    const repoLinks = document.querySelectorAll('.repo-profiles');
    const darkModeOn = evnt !== undefined ? evnt  : localStorage.getItem('darkModeOne')
    localStorage.setItem('darkModeOne', darkModeOn)
    if(darkModeOn === true || darkModeOn === 'true') {
        darkModeEl.control.checked = true;
        summaries.forEach(summary => {
            summary.style.backgroundColor = 'black';
        })
        container.style.backgroundColor = 'black';
        container.style.color = 'white';
        tabs.style.backgroundColor = 'rgb(113, 166, 111)';
        repoLinks.forEach(link => { 
            link.style.color = 'white'
        })
        
        return
    }
    summaries.forEach(summary => {
        summary.style.backgroundColor = 'rgb(242, 242, 242)';
    })
    container.style.backgroundColor = 'rgb(242, 242, 242)';
    container.style.color = 'black';
    tabs.style.backgroundColor = 'rgb(242, 242, 242)';
}

const checkbox = document.querySelector("input[name=switch]");

const gotoEnglishVersion = function() {
    console.log(document.location.href.replace('/es/', '/'))
    location.assign(document.location.href.replace('/es/', '/')) ;
} 
checkbox.addEventListener( 'change', function() {
    darkModeHelper(darkModeEl.control.checked)
});
darkModeHelper();


