/** For common functions */

/**
 * Create the wrapping "tags" div for a collection of buttons/tags.
 * @param {String} divId - The ID of the DIV to be created.
 */
function createWrappingDiv(divId) {
  const outerDiv = document.createElement("div");
  outerDiv.id = divId;
  outerDiv.classList.add("buttons");
  return outerDiv;
}

/**
 * Creates a span button.
 * @param {*} buttonInnerHTML - The inner HTML to use for the button.
 */
function createSpanButton(buttonInnerHTML) {
  const span = document.createElement("span");
  span.classList.add("button");
  span.classList.add("is-small");
  span.classList.add("is-rounded");
  span.classList.add("is-link");
  span.innerHTML = buttonInnerHTML;
  return span;
}