// ELEMENT VARIABLES
const time = document.querySelector(".time");
const shortcuts = document.querySelectorAll(".shortcut");
const container = document.querySelector(".container");
let draggableItem = document.getElementsByClassName("draggable");

//GLOBAL VARIABLES
let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// Generate time in taskbar
function setTime() {
  const options = {
    hour: "numeric",
    minute: "numeric",
  };
  time.innerText = new Date().toLocaleTimeString("en-GB", options);

  setInterval(() => {
    time.innerText = new Date().toLocaleTimeString("en-GB", options);
  }, 1000);
}

//// MAKE SHORTCUTS DRAGGABLE ////

// if eventTarget is in shotcuts array, add class to that shortcut element so that we can call it later
function setDraggableClass(eventTarget) {
  for (const shortcut of shortcuts) {
    if (eventTarget === shortcut || eventTarget.parentElement === shortcut) {
      shortcut.classList.add("draggable");
    }
  }
}

function dragStart(e) {
  e.preventDefault();
  setDraggableClass(e.target);
  // this is the item we are interacting with
  activeItem = document.querySelector(".draggable");
  if (
    e.target.classList.contains("draggable") ||
    e.target.parentElement.classList.contains("draggable")
  ) {
    active = true;

    if (activeItem !== null) {
      if (!activeItem.xOffset) {
        activeItem.xOffset = 0;
      }

      if (!activeItem.yOffset) {
        activeItem.yOffset = 0;
      }

      if (e.type === "touchstart") {
        activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
        activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
      } else {
        activeItem.initialX = e.clientX - activeItem.xOffset;
        activeItem.initialY = e.clientY - activeItem.yOffset;
      }
    }
  }
}

function dragEnd(e) {
  if (activeItem !== null) {
    activeItem.initialX = activeItem.currentX;
    activeItem.initialY = activeItem.currentY;
    //removes 'draggable' class
    shortcuts.forEach((element) => element.classList.remove("draggable"));
  }

  active = false;
  activeItem = null;
}

function drag(e) {
  if (active) {
    if (e.type === "touchmove") {
      e.preventDefault();

      activeItem.currentX = e.touches[0].clientX - activeItem.initialX;
      activeItem.currentY = e.touches[0].clientY - activeItem.initialY;
    } else {
      activeItem.currentX = e.clientX - activeItem.initialX;
      activeItem.currentY = e.clientY - activeItem.initialY;
    }

    activeItem.xOffset = activeItem.currentX;
    activeItem.yOffset = activeItem.currentY;

    setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

setTime();
