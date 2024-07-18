// window.addEventListener("load", startGame);

let activePlayer = 1;
const strEven = [1, 0, 1, 0, 1, 0, 1, 0];
const strOdd = [0, 1, 0, 1, 0, 1, 0, 1];

let boardEl = document.getElementById("board");
let modalEl = document.getElementById("modal");
let resetButtons = document.getElementsByClassName("reset");
let numbersRowEl = document.getElementsByClassName("numbers-row");
let numbersColEl = document.getElementsByClassName("numbers-col");

for (let btn of resetButtons) {
  btn.addEventListener("click", function () {
    if (!modalEl.classList.contains("hidden")) {
      modalEl.classList.add("hidden");
    }
    if (
      document.getElementById("player1").value === "" ||
      document.getElementById("player0").value === ""
    ) {
      alert("Заполните именя игроков");
    } else {
      startGame();
    }
  });
}
function deleteClass(param) {
  let elGoTo = document.getElementsByClassName(param);
  while (elGoTo.length > 0) {
    elGoTo[0].classList.remove(param);
  }
}
boardEl.addEventListener("click", function (event) {
  let targetClasses = event.target.classList;
  let els = document.getElementsByClassName("goto");
  let gotoEls = Array.from(els);
  if (
    targetClasses.contains("field") &&
    !targetClasses.contains("busy") &&
    gotoEls.includes(event.target)
  ) {
    deleteClass("goto");
    insertImg(event.target);
    const notAte = deletePawn(event.target);
    deleteElement("current");
    deleteClass("allocated");
    addEvent();
    if (notAte) {
      nextPlayer();
    } else if (hasNewMoves(event.target)) {
      nextPlayer();
    }
    whoCanMoves();
  }
});

function hasNewMoves(element) {
  const targetData = element.dataset;
  let nextPlayer = availableMoves(targetData.row, targetData.col);

  if (!nextPlayer) {
    element.classList.add("allocated");
    const imgEl = element.querySelector(".img");
    imgEl.classList.add("current");
    return false;
  } else {
    deleteClass("goto");
    return true;
  }
}

function whoCanMoves() {
  deleteClass("mustMove");
  const elList = document.querySelectorAll(
    activePlayer === 0 ? ".blue" : ".yellow"
  );
  let elArray = [...elList];
  elArray.forEach((el) => {
    const targetData = el.parentNode.dataset;

    if (shouldMakeMove(targetData.row, targetData.col)) {
      el.parentNode.classList.add("mustMove");
    }
  });
}

function shouldMakeMove(row, col) {
  let rowUp = parseInt(row) + 1;
  let rowDown = parseInt(row) - 1;
  let colRight = parseInt(col) + 1;
  let colLeft = parseInt(col) - 1;
  let vector = 1;

  if (activePlayer === 1) {
    let elLeft = getElementByRowCol(rowUp, colLeft);
    let elRight = getElementByRowCol(rowUp, colRight);
    let canEatLeft = eatCheckerForNext(elLeft, rowUp + vector, colLeft - 1);
    let canEatRight = eatCheckerForNext(elRight, rowUp + vector, colRight + 1);

    return canEatLeft || canEatRight;
  } else {
    vector = -1;
    let elLeft = getElementByRowCol(rowDown, colLeft);
    let elRight = getElementByRowCol(rowDown, colRight);
    let canEatLeft = eatCheckerForNext(elRight, rowDown + vector, colRight + 1);
    let canEatRight = eatCheckerForNext(elLeft, rowDown + vector, colLeft - 1);

    return canEatLeft || canEatRight;
  }
}

function insertImg(element) {
  element.insertAdjacentHTML("beforeend", getElementActivePlayer());
  element.classList.remove("free");
  element.classList.add("busy");
}

function getElementActivePlayer() {
  let color = "";

  if (activePlayer === 0) {
    color = getBlueEl();
  } else if (activePlayer === 1) {
    color = getYellowEl();
  }
  return color;
}

function checkActivePlayer(targetClasses) {
  if (targetClasses == null) {
    return false;
  }
  if (activePlayer === 0 && targetClasses.contains("blue")) {
    return true;
  } else if (activePlayer === 1 && targetClasses.contains("yellow")) {
    return true;
  }
  return false;
}

function nextPlayer() {
  activePlayer = 1 - activePlayer;
  deleteClass("border");
  let newBorder = document.getElementById(`p${activePlayer}`);
  newBorder.classList.add("border");
}

function renderBoard(board) {
  let fields = [];
  for (let [i, row] of board.entries()) {
    for (let [j, value] of row.entries()) {
      fields.push(`
        <div class="field ${value ? "busy" : "free"}" 
            data-row="${i}" 
            data-col="${j}"
            id ="${i}${j}"
            style="grid-row:${i + 1};grid-column:${j + 1};"
        >
          ${value || ""}
        </div>
      `);
    }
  }
  boardEl.innerHTML = fields.join("");
  fields = [];
  for (let index = 0; index < board.length; index++) {
    fields.push(`<div class="number row">${index + 1}</div>`);
  }
  numbersRowEl[0].innerHTML = fields.join("");

  fields = [];
  const Alf = ["A", "B", "C", "D", "E", "F", "G", "H"];
  for (let index = 0; index < board.length; index++) {
    fields.push(`<div class="number col">${Alf[index]}</div>`);
  }
  numbersColEl[0].innerHTML = fields.join("");
}

function startGame() {
  let sizeBoard = 8;
  board = [];
  for (let i = 0; i < sizeBoard; i++) {
    let row = [];
    board.push(row);
    for (let b = 0; b < sizeBoard; b++) {
      board[i].push(yellowOrBlue(i, b));
    }
  }
  renderBoard(board);
  addEvent();
  nextPlayer();
}

function yellowOrBlue(i, b) {
  let value = "";
  let fully = false;

  if (i % 2) {
    if (strOdd[b] === 1) {
      fully = true;
    }
  } else if (strEven[b] === 1) {
    fully = true;
  }

  if (i <= 2 && fully) {
    value = getYellowEl();
  } else if (i >= 5 && fully) {
    value = getBlueEl();
  }
  return value;
}

function getYellowEl() {
  return '<img class="img yellow" src="file:///D:/Git/chess/yellow.svg"></img>';
}

function getBlueEl() {
  return '<img class="img blue" src="file:///D:/Git/chess/blue.svg"></img>';
}

function addEvent() {
  let imgEls = document.getElementsByClassName("img");
  for (let element of imgEls) {
    element.addEventListener("click", (event) => {
      deleteClass("goto");
      deleteClass("current");
      deleteClass("allocated");
      click(element);
    });
  }
}

function click(element) {
  let targetClasses = element.parentNode.classList;
  let targetData = element.parentNode.dataset;
  const elList = document.querySelectorAll(".mustMove");
  let elArr = Array.from(elList);
  if (
    targetClasses.contains("field") &&
    targetClasses.contains("busy") &&
    checkActivePlayer(element.classList) &&
    (elArr.length == 0 || elArr.includes(element.parentNode))
  ) {
    element.parentNode.classList.add("allocated");
    element.classList.add("current");
    availableMoves(targetData.row, targetData.col);
  }
}

function availableMoves(row, col) {
  let rowUp = parseInt(row) + 1;
  let rowDown = parseInt(row) - 1;
  let colRight = parseInt(col) + 1;
  let colLeft = parseInt(col) - 1;
  let vector = 1;

  if (activePlayer === 1) {
    return playerMoves(rowUp, colLeft, colRight, vector);
  } else {
    vector = -1;
    return playerMoves(rowDown, colLeft, colRight, vector);
  }
}

function playerMoves(row, colLeft, colRight, vector) {
  let elLeft = getElementByRowCol(row, colLeft);
  let elRight = getElementByRowCol(row, colRight);

  let youCanEatLeft = eatChecker(elLeft, row + vector, colLeft - 1);
  let youCanEatRight = eatChecker(elRight, row + vector, colRight + 1);

  if (!youCanEatRight && !youCanEatLeft) {
    simpleMove(elRight);
    simpleMove(elLeft);
    return true;
  } else {
    return false;
  }
}

function simpleMove(element) {
  if (checkNonBusy(element)) {
    addClass(element);
  }
}

function getElementByRowCol(row, col) {
  return document.getElementById(`${row}${col}`);
}

function checkNextElement(element) {
  return (
    element != null &&
    element.classList.contains("busy") &&
    !checkActivePlayer(element.querySelector(".img").classList)
  );
}

function checkNonBusy(element) {
  return element != null && !element.classList.contains("busy");
}

function addClass(element) {
  element.classList.add("goto");
}

function eatChecker(element, row, col) {
  if (checkNextElement(element)) {
    let nextEl = getElementByRowCol(row, col);
    if (checkNonBusy(nextEl)) {
      addClass(nextEl);
      return true;
    }
    return false;
  }
  return false;
}

function eatCheckerForNext(element, row, col) {
  if (checkNextElement(element)) {
    let nextEl = getElementByRowCol(row, col);
    if (checkNonBusy(nextEl)) {
      return true;
    }
    return false;
  }
  return false;
}

function deleteElement(param) {
  let el = document.getElementsByClassName(param);
  for (let i = 0; i < el.length; i++) {
    el[i].parentNode.classList.remove("busy");
    el[i].parentNode.classList.add("free");
    el[i].remove();
  }
}

function deletePawn(elementEnd) {
  const elementStart = document.getElementsByClassName("allocated");
  const rEnd = parseInt(elementEnd.getAttribute("data-row"));
  const rStart = parseInt(elementStart[0].getAttribute("data-row"));
  const cEnd = parseInt(elementEnd.getAttribute("data-col"));
  const cStart = parseInt(elementStart[0].getAttribute("data-col"));
  const newRow = (rEnd + rStart) / 2;
  const newCol = (cEnd + cStart) / 2;

  if (Number.isInteger(newRow % 2)) {
    let nElement = document.getElementById(`${newRow}${newCol}`);
    nElement.classList.remove("busy");
    nElement.classList.add("free");
    nElement.querySelector(".img").remove();
    return false;
  } else {
    return true;
  }
}

function showWinner(winner) {
  let header = modalEl.getElementsByTagName("h2")[0];
  header.textContent = `Победил игрок №${winner + 1}! 🍾`;
  modalEl.classList.remove("hidden");
}

//to do
  //описать логику ходов дамки
  //съеденные пешки складывать в кучку
  //проверка победы
  //переписать в онлайн игру
