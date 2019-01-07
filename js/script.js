// setting constant variables
const CHECKED_IMG = "images/checked.png";
const UNCHECKED_IMG = "images/unchecked.png";
const selected = {"one": null, "two": null, "three": null}
const checkboxes = document.querySelectorAll('.checkbox');

// adds event listener to checkboxes
function initCheckboxes() {
  for (let box of checkboxes) {
    box.addEventListener('click', changeBox);
  }
}

// event handler, changes checkboxes when one is clicked
function changeBox(event) {
  const clickedBox = event.currentTarget;
  const item = clickedBox.parentElement;
  deselectAll(item.dataset.questionId);
  selectItem(item);
  if (isComplete()) {
    quizComplete();
  }
}

// calls deselectItem for each item in a question
function deselectAll(questionId) {
  items = document.querySelectorAll('div[data-question-id=' + questionId + ']');
  for (let item of items) {
    deselectItem(item);
  }
}

// deselects a single item, modifying its styling
function deselectItem(item) {
  const box = item.querySelector('.checkbox');
  box.src = UNCHECKED_IMG;
  item.style.backgroundColor = "#f4f4f4";
  item.style.opacity = 0.6;
}

// selects a single item, modifying its styling
function selectItem(item) {
  const box = item.querySelector('.checkbox');
  box.src = CHECKED_IMG;
  item.style.backgroundColor = "#cfe3ff";
  item.style.opacity = 1;
  selected[item.dataset.questionId] = item.dataset.choiceId;
}

// checks if all three questions are answered
function isComplete() {
  if ((selected["one"] !== null) && (selected["two"] !== null)
    && (selected["three"]!== null)) {
      return true;
  }
  else {
    return false;
  }
}

// removes event listeners from checkboxes then starts result generation
function quizComplete() {
  for (const box of checkboxes) {
    box.removeEventListener('click', changeBox);
  }
  const result = getResult();
  setResultBox(result);
}

// checks result tally, most common result is the final result
function getResult() {
  const tally = getTally();
  if (Object.keys(tally).length === 3) {
    return selected["one"]; // first result is final if there is a tie
  }
  else {
    let result = " ";
    for (const item in tally) {
      if (!tally[result] || tally[item] > tally[result]) {
        result = item;
      }
    }
    return result;
  }
}

// checks selected answers, tallying results
function getTally() {
  const tally = {};
  for (let question in selected) {
    if (tally[selected[question]]) {
      tally[selected[question]]++;
    }
    else {
      tally[selected[question]] = 1;
    }
  }
  return tally;
}

// sets the result box
function setResultBox(result) {
  const container = document.querySelector("article");
  const resultBox = document.createElement("div");
  resultBox.style.padding = "20px";
  resultBox.style.margin = "20px 0px";
  const resultTitle = document.createElement("h2");
  resultTitle.textContent = "You got: " + RESULTS_MAP[result].title;
  const resultText = document.createElement("div");
  resultText.textContent = RESULTS_MAP[result].contents;
  resultText.style.padding = "18px 0px";
  resultBox.appendChild(resultTitle);
  resultBox.appendChild(resultText);
  container.appendChild(resultBox);
  setRestartButton(result, resultBox);
}

// sets the restart button
function setRestartButton(result, resultBox) {
  const restartButton = document.createElement("div");
  restartButton.style.backgroundColor = "#cecece";
  restartButton.style.height = "50px";
  restartButton.textContent = "Restart quiz";
  restartButton.style.fontSize = "18px";
  restartButton.style.display = "flex";
  restartButton.style.alignItems= "center";
  restartButton.style.justifyContent = "center";
  restartButton.addEventListener('mouseover', mouseOver);
  restartButton.addEventListener('mouseout', mouseOut);
  restartButton.addEventListener('click', restart);
  resultBox.appendChild(restartButton);
}

// event handler, changes restart button on mouseover
function mouseOver(event) {
  const button = event.currentTarget;
  button.style.backgroundColor = "#e0e0e0";
}

// event handler, changes restart button on mouseout
function mouseOut(event) {
  const button = event.currentTarget;
  button.style.backgroundColor = "#cecece";
}

// event handler, restarts the quiz
function restart(event) {
  for (const question in selected) {
    selected[question] = null;
  }
  initCheckboxes();
  event.currentTarget.parentElement.remove();
  for (const box of checkboxes) {
    resetItem(box.parentElement);
  }
  const firstQuestion = document.querySelector(".question-name");
  firstQuestion.scrollIntoView(); // scrolls back up to first question
}

// resets the item back to its initial state
function resetItem(item) {
  const box = item.querySelector('.checkbox');
  box.src = UNCHECKED_IMG;
  item.style.backgroundColor = "#f4f4f4";
  item.style.opacity = 1;
}

// calls initCheckboxes
function main() {
  initCheckboxes();
}

main();
