/**
 * This is the JS to implement the user interface for the binary search algorithm. It allows the
 * user to input how many elements they would like to operate on as well as the elements themselves.
 * A stepping button allows the user to go at their own pace, iterating through the binary search
 * algorithm.
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  /**
   * Sets up necessary functionality when page loads. In particular, it creates a listener for
   * the first input that the user will enter.
   */
  function init() {
    qs("#size-input > input").addEventListener("input", getFirstInput);
  }

  /**
   * Gets the first input from the user as to how many elements they would like to provide
   * information for. This input is validated to make sure that the user is inputting only integers
   * between 1 and 20.
   */
  function getFirstInput() {
    let numElem = parseInt(this.value);
    let arrayContainer = id("elems");
    arrayContainer.innerHTML = "";
    const LOWER = 1;
    const UPPER = 20;
    if (isNaN(numElem) || !Number.isInteger(numElem) || numElem < LOWER || numElem > UPPER) {
      qs("#size-input > .error-msg").textContent = "Please enter an integer between 1 and 20";
    } else {
      qs("#size-input > .error-msg").textContent = "";
      createInputArrayContainer(numElem);
      let elemSearchButton = qs("#search > button");
      elemSearchButton.addEventListener("click", validateArrayInput);
    }
  }

  /**
   * Creates a place on the DOM that allows for user input for the elements of an array.
   * @param {number} numElem - number of elements that the user desires to provide data for
   */
  function createInputArrayContainer(numElem) {
    let arrayContainer = id("elems");
    for (let i = 0; i < numElem; i++) {
      let arrayElement = gen("div");
      let inputField = gen("input");
      arrayElement.appendChild(inputField);
      arrayContainer.appendChild(arrayElement);
    }
  }

  /**
   * Provides validation for the elements input into the array as well as the search field by
   * the user to ensure that the data is indeed numerical.
   */
  function validateArrayInput() {
    let elemInputFields = qsa("#elems div input");
    let elemSearchField = qs("#search > input");
    let validEntries = true;
    let arrayOfElemVals = [];
    for (let i = 0; i < elemInputFields.length; i++) {
      let elemInput = parseFloat(elemInputFields[i].value);
      if (isNaN(elemInput)) {
        validEntries = false;
      }
      arrayOfElemVals.push(elemInput);
    }
    let elementToFind = parseFloat(elemSearchField.value);
    let validationText = qs("#search > .error-msg");
    if (isNaN(elementToFind) || !validEntries) {
      validationText.textContent = "Please enter numbers";
    } else {
      validationText.textContent = "";
      qs("#search .hide").classList.remove("hide");
      generateVisualizer(arrayOfElemVals);
      binarySearchListener(arrayOfElemVals, elementToFind);
    }
  }

  /**
   * Sorts the array that the user input, then displays the initial array before the binary search
   * on the DOM.
   * @param {object} array - array of numbers used for creating a visual array on the webpage
   */
  function generateVisualizer(array) {
    array.sort((left, right) => left - right);
    let visualContainer = qs("#visualizer > section");
    for (let i = 0; i < array.length; i++) {
      let arrayElement = gen("div");
      let inputField = gen("span");
      inputField.textContent = array[i];
      arrayElement.appendChild(inputField);
      visualContainer.appendChild(arrayElement);
    }
  }

  /**
   * Sets up the data necessary for the binary search to execute. Uses a listener to iterate
   * through the binary search.
   * @param {object} array - the numbers input by the user from which the element is searched for
   * @param {number} searchItem - the number that the user desires to find in the array
   */
  function binarySearchListener(array, searchItem) {
    qs("button").disabled = true;
    let lo = 0;
    let hi = array.length - 1;
    let arrayElems = qsa("#visualizer > section div");
    let stepButton = qs("#search > section button");
    let iterations = 0;
    arrayElems[lo].classList.add("low");
    arrayElems[hi].classList.add("high");
    arrayElems[Math.floor(hi / 2)].classList.add("mid");
    let stateArray = [lo, hi, array, searchItem, arrayElems, iterations];
    stepButton.addEventListener("click", function() {
      binarySearch(stateArray);
    });
  }

  /**
   * Performs one iteration of binary search and updates its state
   * @param {object} stateArray - contains info about the state of the binary search
   */
  function binarySearch(stateArray) {
    let lo = stateArray[0];
    let hi = stateArray[1];
    let array = stateArray[2];
    let searchItem = stateArray[3];
    let arrayElems = stateArray[4];
    stateArray[5] += 1;
    if (lo <= hi) {
      let mid = Math.floor((lo + hi) / 2);
      if (array[mid] < searchItem) {
        updateDom(lo, mid, hi, arrayElems, "low");
        lo = mid + 1;
        stateArray[0] = lo;
        arrayElems[lo].classList.add("low");
        arrayElems[Math.floor((lo + hi) / 2)].classList.add("mid");
      } else if (array[mid] > searchItem) {
        updateDom(lo, mid, hi, arrayElems, "high");
        hi = mid - 1;
        stateArray[1] = hi;
        arrayElems[hi].classList.add("high");
        arrayElems[Math.floor((lo + hi) / 2)].classList.add("mid");
      } else {
        arrayElems[mid].classList.remove("mid");
        arrayElems[mid].classList.add("found");
        printEnd(searchItem, stateArray[5], true);
      }
    } else {
      printEnd(searchItem, stateArray[5], false);
    }
  }

  /**
   * Changes the background colors of the elements in the array displayed on the webpage
   * @param {number} lo - the low index of the binary search
   * @param {number} mid - the middle index of the binary search
   * @param {number} hi - the high index of the binary search
   * @param {object} arrayElems - array of div nodes used to represent the array on the webpage
   * @param {string} update - the string representation of the index to update
   */
  function updateDom(lo, mid, hi, arrayElems, update) {
    if (update === "low") {
      arrayElems[lo].classList.remove(update);
      arrayElems[mid].classList.remove("mid");
      for (let i = lo; i <= mid; i++) {
        arrayElems[i].classList.add("examined");
      }
    } else {
      arrayElems[hi].classList.remove(update);
      arrayElems[mid].classList.remove("mid");
      for (let i = mid; i < arrayElems.length; i++) {
        arrayElems[i].classList.add("examined");
      }
    }
  }

  /**
   * Updates the DOM to show the user the results of the binary search. Then displays a button to
   * allow the user to reset the binary search to it's original state.
   * @param {number} searchItem - number that was searched for
   * @param {number} iterations - number of iterations it took to complete the search
   * @param {boolean} found - whether the searched for element was found
   */
  function printEnd(searchItem, iterations, found) {
    qs("#search > section button").disabled = true;
    let result = gen("p");
    let visualizerSection = id("visualizer");
    visualizerSection.appendChild(result);
    let hidableSection = qs("#search > section");
    let resetButton = qsa("#search > section button")[1];
    resetButton.classList.remove("hide");
    resetButton.addEventListener("click", function() {
      window.location.reload();
    });
    hidableSection.appendChild(resetButton);
    if (found) {
      result.innerText = "" + searchItem + " was found after " + iterations + " iterations!";
    } else {
      result.innerText = "" + searchItem + " was NOT found! Total iterations: " + iterations + ".";
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} - array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - name of the tag to be created
   * @returns {object} - DOM object that has been created
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();