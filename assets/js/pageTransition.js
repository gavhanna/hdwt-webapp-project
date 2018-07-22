document.addEventListener("DOMContentLoaded", () => {
  pageTransition();
});

const pageTransition = function () {
  const pageBody = document.querySelector("body");
  const anchors = document.querySelectorAll("a");

  pageBody.classList.add("enter-transition");

  anchors.forEach(a => {
    a.addEventListener("click", handleClick);
  });

  function handleClick(e) {
    //e.preventDefault();
    pageBody.classList.remove("enter-transition")
    pageBody.classList.add("exit-transition");
    console.log(e.target.href);
    if (e.target.href) {
      setTimeout(() => {
        window.location.href = e.target.href;
      }, 300);
    }
  }
};

