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
      inputName.name = `ingredient[${total}][name]`;
      inputAmount.name = `ingredient[${total}][amount]`;

      ingredientsDiv.classList.add("ingredients");
      field.innerHTML = `Ingredient ${total}`;
      inputName.type = "text";
      inputAmount.type = "number";


      ingredientsDiv.appendChild(inputName);
      ingredientsDiv.appendChild(inputAmount);
      field.appendChild(label);
      field.appendChild(ingredientsDiv);
      ingredientContainer.appendChild(field);


      ingredientContainer.setAttribute("data-total", total);
    });
  }


});