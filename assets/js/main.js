document.addEventListener("DOMContentLoaded", () => {
  pageTransition();
  const deleteBtns = document.querySelectorAll(".delete-btn");


  deleteBtns.forEach(btn => {
    btn.removeEventListener("click", handleClick);
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const confirmation = confirm("Really delete?");
      if (confirmation) {
        window.location.href = e.target.href;
      } else {
        return false;
      }
    });
  })
});