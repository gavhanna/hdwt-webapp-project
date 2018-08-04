document.addEventListener("DOMContentLoaded", () => {
  pageTransition();
  const deleteBtns = document.querySelectorAll(".delete-btn");
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

  if (addIngredientButton) {
    addIngredientButton.addEventListener("click", e => {
      let oldTotal = ingredientContainer.getAttribute("data-total");
      let newTotal = parseInt(oldTotal) + 1;

      const field = document.createElement("fieldset");
      const label = document.createElement("label");
      const ingredientsDiv = document.createElement("div");
      const inputName = document.createElement("input");
      const inputAmount = document.createElement("input");
      inputName.name = `ingredient[${oldTotal}][name]`;
      inputAmount.name = `ingredient[${oldTotal}][amount]`;

      ingredientsDiv.classList.add("ingredients");
      field.innerHTML = `Ingredient ${newTotal}`;
      inputName.type = "text";
      inputAmount.type = "number";


      ingredientsDiv.appendChild(inputName);
      ingredientsDiv.appendChild(inputAmount);
      field.appendChild(label);
      field.appendChild(ingredientsDiv);
      ingredientContainer.appendChild(field);


      ingredientContainer.setAttribute("data-total", parseInt(oldTotal) + 1);
    });
  }



  // Form Validation
  const inputs = document.querySelectorAll("input");

  if (inputs) {
    console.log(inputs);
  }

});