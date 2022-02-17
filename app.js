// 1. ELEMENT VARIABLES
const time = document.querySelector(".time");
const draggableItems = document.querySelectorAll(".draggable");
const container = document.querySelector(".container");
const startMenuBtn = document.querySelector(".start__btn");
const startMenu = document.querySelector(".start__menu");
const popupCloseBtns = document.querySelectorAll(".close__popup__button");
const popupMinimizeBtns = document.querySelectorAll(".minimize__popup__button");
const shorcutHelp = document.querySelector(".shortcut__help");
const popupHelp = document.querySelector(".help__popup");
const allPopups = document.querySelectorAll(".popup");
const taskbarLeft = document.querySelector(".taskbar__left");
// 2. GLOBAL VARIABLES
let active = false;
let activeItem = null;

////// 3. FUNCTIONS /////

// 3.1 Random Functions //

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

// Toggle hidden class
function toggleHiddenClass(element) {
  element.classList.toggle("hidden");
}

// truncate Long strings
function textTruncate(str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = "...";
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}

// 3.2 MAKE SHORTCUTS DRAGGABLE //

// if eventTarget is in shotcuts array, add class to that shortcut element so that we can call it later
function setDraggableClass(eventTarget) {
  for (const item of draggableItems) {
    if (eventTarget === item || eventTarget.parentElement === item) {
      item.classList.add("being__dragged");
    }
  }
}

function dragStart(e) {
  e.preventDefault();
  setDraggableClass(e.target);
  // this is the item we are interacting with
  activeItem = document.querySelector(".being__dragged");
  if (
    e.target.classList.contains("being__dragged") ||
    e.target.parentElement.classList.contains("being__dragged")
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
    draggableItems.forEach((element) =>
      element.classList.remove("being__dragged")
    );
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

// 3.3 ADD CURRENT OPEN APP OR DOC TO TASKBAR //

function addRemoveToTaskbar(popup) {
  // Add to taskbar id popup if visible
  if (!popup.classList.contains("hidden")) {
    const icon = popup.querySelector(".popup__icon");
    const title = popup.querySelector(".popup__title");
    const html = `<div class="taskbar__popup close" data-parent-class="${
      popup.classList[0]
    }">
  <img src=${icon.src} alt="">
  <span>${textTruncate(title.innerText, 20)}</span>
</div>`;
    taskbarLeft.insertAdjacentHTML("beforeend", html);
    const currentItem = taskbarLeft.querySelector(
      `[data-parent-class='${popup.classList[0]}'`
    );
    currentItem.addEventListener("click", () => {
      toggleHiddenClass(popup);
      currentItem.classList.toggle("minimized");
    });
  } else {
    // Delete from taskbar if popup is hidden
    const popupTaskbar = taskbarLeft.querySelector(
      `[data-parent-class='${popup.classList[0]}'`
    );
    console.log(popupTaskbar);
    popupTaskbar.remove();
  }
}

//// EVENT LISTENERS & FUNCTION EXECUTION
container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);
container.addEventListener("click", (e) => {
  // closes start menu if open while cliicking on desktop
  if (e.target === container && !startMenu.classList.contains("hidden")) {
    toggleHiddenClass(startMenu);
    startMenuBtn.classList.toggle("clicked");
  }
});
startMenuBtn.addEventListener("click", () => {
  startMenuBtn.classList.toggle("clicked");
  toggleHiddenClass(startMenu);
});

popupCloseBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const parent = e.target.closest(".popup");
    toggleHiddenClass(parent);
    addRemoveToTaskbar(parent);
  });
});
popupMinimizeBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const parent = e.target.closest(".popup");
    const trayShortcut = taskbarLeft.querySelector(
      `[data-parent-class='${parent.classList[0]}'`
    );
    trayShortcut.classList.toggle("minimized");
    toggleHiddenClass(parent);
  });
});

shorcutHelp.addEventListener("dblclick", () => {
  toggleHiddenClass(popupHelp);
  addRemoveToTaskbar(popupHelp);
});

setTime();
