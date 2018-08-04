document.addEventListener("DOMContentLoaded", () => {
  pageTransition();
  const deleteBtns = document.querySelectorAll(".deletable");
  const addIngredientButton = document.querySelector("#addIngredientButton");
  const ingredientContainer = document.querySelector(".ingredient-container");
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


  // Check if theres an addIngredient button on the page
  // If there is, make a new ingredient input section appear on the screen
  if (addIngredientButton) {
    addIngredientButton.addEventListener("click", e => {
      let total = parseInt(ingredientContainer.getAttribute("data-total"));

      total++;
      const field = document.createElement("fieldset");
      const label = document.createElement("label");
      const ingredientsDiv = document.createElement("div");
      const inputName = document.createElement("input");
      const inputAmount = document.createElement("input");
      const deleteThisBtn = document.createElement("button");
      inputName.name = `ingredient[${total}][name]`;
      inputAmount.name = `ingredient[${total}][amount]`;

      field.classList.add("animate-in");
      deleteThisBtn.classList.add("button");
      deleteThisBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteThisBtn.type = "button";
      ingredientsDiv.classList.add("ingredients");
      label.innerText = `Ingredient ${total}`;
      inputName.type = "text";
      inputAmount.type = "number";

      deleteThisBtn.addEventListener("click", function () {
        this.parentNode.parentNode.classList.add("animate-out");
        setTimeout(() => {
          this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
          total--;
          ingredientContainer.setAttribute("data-total", total);
        }, 500);
      })

      ingredientsDiv.appendChild(inputName);
      ingredientsDiv.appendChild(inputAmount);
      ingredientsDiv.appendChild(deleteThisBtn);
      field.appendChild(label);
      field.appendChild(ingredientsDiv);
      ingredientContainer.appendChild(field);


      ingredientContainer.setAttribute("data-total", total);
    });
  }


});