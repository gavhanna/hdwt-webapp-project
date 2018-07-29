
const pageTransition = function () {
  const pageBody = document.querySelector("body");
  const anchors = document.querySelectorAll("a");

  pageBody.classList.add("enter-transition");

  anchors.forEach(a => {
    if (a.href.endsWith("#")) {
      return;
    }
    a.addEventListener("click", handleClick);
  });

};
function handleClick(e) {
  pageBody.classList.remove("enter-transition");
  pageBody.classList.add("exit-transition");

  if (e.target.href) {
    setTimeout(() => {
      window.location.href = e.target.href;
    }, 300);
  }
}

