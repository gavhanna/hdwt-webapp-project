document.addEventListener("DOMContentLoaded", () => {
  pageTransition();
  const deleteBtns = document.querySelectorAll(".deletable");
  const addIngredientButton = document.querySelector("#addIngredientButton");
  const ingredientContainer = document.querySelector(".ingredient-container");
  const navButton = document.querySelector(".nav-button");
  const nav = document.querySelector(".nav-list");
  const navCloser = document.querySelector("#nav-closer");

  //  Add event listener to each button that have the class .deletable
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

  // adds a class to a background overlay that when clicked
  // will close the nav menu
  navCloser.addEventListener("click", function () {
    nav.classList.remove("open");
    navButton.innerHTML = '<i class="fas fa-bars"></i>';
    navCloser.classList.remove("cover");
  });

  // Add the .open class to the nav menu on mobile when
  // the menu button is clicked
  navButton.addEventListener("click", function () {
    if (nav.classList.contains("open")) {
      nav.classList.remove("open");
      navButton.innerHTML = '<i class="fas fa-bars"></i>';
      navCloser.classList.remove("cover");
    } else {
      nav.classList.add("open");
      navButton.innerHTML = '<i class="fas fa-times"></i>';
      navCloser.classList.add("cover");
    }
  });

  // Check if theres an addIngredient button on the page
  // If there is, make a new ingredient input section appear on the screen
  if (addIngredientButton) {
    addIngredientButton.addEventListener("click", e => {
      // this line finds the current length of the ingredients list
      // this is saved as a data attribute on line 26 of update.pug
      let total = parseInt(ingredientContainer.getAttribute("data-total"));
      // total is then incremented to the number for the next ingredient
      total++;
      // create a new fieldset with ingredient input
      const field = document.createElement("fieldset");
      const label = document.createElement("label");
      const ingredientsDiv = document.createElement("div");
      const inputName = document.createElement("input");
      const inputAmount = document.createElement("input");
      const deleteThisBtn = document.createElement("button");
      inputName.name = `ingredient[${total}][name]`;
      inputAmount.name = `ingredient[${total}][amount]`;

      // add classes and content inside the created elements
      field.classList.add("animate-in");
      deleteThisBtn.classList.add("button");
      deleteThisBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteThisBtn.type = "button";
      ingredientsDiv.classList.add("ingredients");
      label.innerText = `Ingredient ${total}`;
      inputName.type = "text";
      inputAmount.type = "number";

      // added event listener to the button to remove ingredients
      deleteThisBtn.addEventListener("click", function () {
        this.parentNode.parentNode.classList.add("animate-out");
        setTimeout(() => {
          this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
          total--;
          ingredientContainer.setAttribute("data-total", total);
        }, 500);
      })

      // set required to true for the inputs and append them to the page
      inputName.required = true;
      inputAmount.required = true;
      ingredientsDiv.appendChild(inputName);
      ingredientsDiv.appendChild(inputAmount);
      ingredientsDiv.appendChild(deleteThisBtn);
      field.appendChild(label);
      field.appendChild(ingredientsDiv);
      ingredientContainer.appendChild(field);
      // set the data total to the current total
      ingredientContainer.setAttribute("data-total", total);
    });
  }


  // Search box

  // This function was made using information from this stackoverflow thread
  // https://stackoverflow.com/questions/29775797/fetch-post-json-data
  // in order to figure out how to send a POST request with fetch.
  const searchBox = document.querySelector("#search-box");
  const searchContainer = document.querySelector(".search-container");
  let searchResults;
  //added event listener to fire when atfter a key is lifted up, not pressed down
  searchBox.addEventListener("keyup", function () {
    // if there are already results showing, just remove them in all cases
    // this is here so i dont leave up old results after every keyup event
    if (searchResults) {
      let allResults = document.querySelectorAll(".search-results");
      allResults.forEach(item => {
        item.remove();
      })
    }
    if (this.value.length > 0) {
      // if there is anything in the search box
      // make a POST request to the server
      // searching for the current value of the search box input
      fetch(window.location.origin + "/search.json", {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: this.value })
      }).then(res => res.json())
        .then(res => {
          console.log(res); // logging for testing
          // now that we have results, create a ul to hold the results
          searchResults = document.createElement("ul");
          searchResults.classList.add("search-results");
          if (res.length == 0) {
            // if there are no results, tell the user with a "No results" message
            const li = document.createElement("li");
            li.innerText = "No results";
            li.classList.add("search-result");
            searchResults.appendChild(li);
          } else {
            // if we DO have results returning
            // for each returned value, create a link to that recipe
            // with its in and id in the anchor element
            res.forEach(item => {
              const li = document.createElement("li");
              const a = document.createElement("a");
              a.href = window.location.origin + "/recipes/" + item.id;
              a.innerText = item.title;
              li.classList.add("search-result");
              li.appendChild(a);
              searchResults.appendChild(li);
            });
          }
          // whether there are results or not, append the list to the dom
          searchContainer.appendChild(searchResults);
        });
    }

  })

});