var url = "https://pokeapi.co/api/v2/pokemon/";
var limit = "?limit=964";
// Global list to add the caught pokemons
var caughtPokemons = [];
window.onload = function() {
  catchPoke();
};

// A function to fetch & store the pokémons
// to be able to search for the pokémons later on.
function catchPoke() {
  var pokemonNames = [];
  fetch(url + limit)
    .then(function(result) {
      if (result.ok) {
        return result.json();
      }
    })
    .then(function(resultData) {
      resultData.results.forEach(function(result) {
        pokemonNames.push(result.name);
      });
    });

  // To be able to search for the pokemon, we send the user input
  // and the list of available pokemons to the searchPoke function.
  searchPoke(document.getElementById("pokemonInput"), pokemonNames);
}

// A function to be able to search for existing pokemons
function searchPoke(inputValue, pokeNames) {
  var j;

  // When user searches/inputs a poke
  inputValue.addEventListener("input", function(e) {
    var pokeElement,
      mactchedPoke,
      i,
      pokeValue = this.value;
    // To make sure no lists of pokémons are open
    closeShownPoke();
    if (!pokeValue) {
      return false;
    }
    j = -1;
    // div element that will contain the pokemons
    pokeElement = document.createElement("div");
    pokeElement.setAttribute("id", this.id + "listOfPokes");
    pokeElement.setAttribute("class", "pokeItems");

    // Adds the div-element as a child of the pokeElement.
    this.parentNode.appendChild(pokeElement);

    for (i = 0; i < pokeNames.length; i++) {
      // If the pokemons starts with the same letter as the user input
      if (
        pokeNames[i].substr(0, pokeValue.length).toUpperCase() ==
        pokeValue.toUpperCase()
      ) {
        // Then we create a div element for those who match
        mactchedPoke = document.createElement("li");
        mactchedPoke.innerHTML = pokeNames[i];

        // An input, this will contain the current pokemon
        mactchedPoke.innerHTML +=
          "<input type='hidden' value='" + pokeNames[i] + "'>";

        // When a user clicks on a pokemon from the list, the pokemon will be
        // inserted to the input field
        mactchedPoke.addEventListener("click", function(e) {
          inputValue.value = this.getElementsByTagName("input")[0].value;
          // Again closing all the lists that are open, since we have chosen
          // a pokemon!
          closeShownPoke();
        });
        pokeElement.appendChild(mactchedPoke);
      }
    }
  });
  // to execute function whenever someone presses on a keyboard
  inputValue.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "listOfPokes");
    if (x) {
      x = x.getElementsByTagName("div");
    }
  });

  // A function to be able to close any open lists
  function closeShownPoke(removePoke) {
    var x = document.getElementsByClassName("pokeItems");
    for (var i = 0; i < x.length; i++) {
      if (removePoke != inputValue && removePoke != x[i]) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
}

// To be able to show the pokémons that the user has caught
function caughtPoke() {
  var pokeName = document.getElementById("pokemonInput").value;

  // The fetch method returns a promise obj. that contains
  // the .then() method which gives us a callback function
  // with sucess/failure

  // Here we check that the current pokémon actaully exists within the API
  fetch(url + pokeName.toLowerCase())
    .then(function(response) {
      // To check if there actually is a respons for that input
      if (response.ok) {
        return response.json();
      } else {
        // If not, there is most likely not a poke with that name
        var noPoke = "No pokémon found by that name, try again!";
        document.getElementById("pokeName").innerHTML = noPoke;
        // To log what kind of error we got
        throw new Error("No pokémon found by that name, try again!");
      }
    })
    .then(function(jsonData) {
      // For the date to be displayed correctly...
      var date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        time = hours + ":" + minutes + ":" + seconds;
      date = " " + year + "-" + month + "-" + day + ", " + time + "</br>";

      // Now we are quite sure that the poke exisits
      // And display the name of the pokemon and the base Exp it has
      var baseExp = jsonData.base_experience;
      document.getElementById("pokeName").innerHTML = pokeName.toUpperCase();
      document.getElementById("baseExp").innerHTML = baseExp;

      // Adding each pokemon to the caught list
      caughtPokemons.push(pokeName.toUpperCase());
      caughtPokemons.push(date);

      document.getElementById("caughtPokes").innerHTML = caughtPokemons.join(
        " "
      );
    });
}

// A function to throw away the current inserted pokémon
function throwAway() {
  var i = 0;
  var pokemon = document.getElementById("pokemonInput").value;
  caughtPokemons.forEach(function(pokeInList) {
    if (pokemon.toUpperCase() === pokeInList) {
      caughtPokemons.splice(i, 2);
      document.getElementById("caughtPokes").innerHTML = caughtPokemons;
      document.getElementById("pokeName").innerHTML = "";
      document.getElementById("baseExp").innerHTML = "";
      return;
    }
    i++;
  });
}

// Function to throw away all pokémons that has been chaught.
function throwAwayAll() {
  caughtPokemons = [];
  document.getElementById("caughtPokes").innerHTML = caughtPokemons;
  document.getElementById("pokeName").innerHTML = "";
  document.getElementById("baseExp").innerHTML = "";
}
