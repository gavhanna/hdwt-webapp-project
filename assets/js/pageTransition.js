// made these variables global so i could access them in both functions
let pageBody;
let anchors;
const pageTransition = function () {
  // grab the page body
  pageBody = document.querySelector("body");
  // grab every anchor element
  anchors = document.querySelectorAll("a");

  pageBody.classList.add("enter-transition");

  anchors.forEach(a => {
    // if the anchor just goes to a place on current page, do nothing
    if (a.href.endsWith("#")) {
      return;
    }
    // if it goes to a link, call the handler
    a.addEventListener("click", handleClick);
  });

};
function handleClick(e) {
  // remove the enter class and add the exit-transition class
  // these classes have keyframe animations in the CSS
  pageBody.classList.remove("enter-transition");
  pageBody.classList.add("exit-transition");

  // if the target has a href value, 
  // wait 300ms (for the animation to happen) and then go to that href
  if (e.target.href) {
    setTimeout(() => {
      window.location.href = e.target.href;
    }, 300);
  }
}

