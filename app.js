// 1. ELEMENT VARIABLES
let draggableItems = document.querySelectorAll(".draggable");
const time = document.querySelector(".time");
const container = document.querySelector(".container");
const startMenuBtn = document.querySelector(".start__btn");
const startMenu = document.querySelector(".start__menu");
const popupCloseBtns = document.getElementsByClassName(".close__popup__button");
const popupMinimizeBtns = document.getElementsByClassName(
  ".minimize__popup__button"
);
const shortcuts = document.querySelectorAll(".shortcut");
const shorcutHelp = document.querySelector(".shortcut__help");
const popupHelp = document.querySelector(".help__popup");
const allPopups = document.getElementsByClassName(".popup");
const taskbar = document.querySelector(".taskbar");
// 2. GLOBAL VARIABLES
let active = false;
let activeItem = null;
const skillsHtml = `
<div class="left">
<p>HTML</p>
<p>CSS</p>
<p>SCSS & SASS</p>
<p>JavaScript</p>
</div>
<div class="right">
<p>NodeJs</p>
<p>Express</p>
<p>C#</p>
<p>Unity</p>
</div>`;

////// 3. FUNCTIONS /////

// 3.1 Random Functions //

// delayed text Display
async function delayedText(txt, element, waitTime, isHTML) {
  await new Promise((resolve) => setTimeout(resolve, waitTime));

  isHTML
    ? element.insertAdjacentHTML("beforeend", txt)
    : (element.textContent = txt);
}
// Typing animation
async function typeWriter(txt, element, waitTime, typeSpeed) {
  let i = 0;
  function type() {
    if (i < txt.length) {
      element.textContent += txt.charAt(i);
      i++;
      setTimeout(type, typeSpeed);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, waitTime));
  type();
}

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
  draggableItems = document.querySelectorAll(".draggable");
  for (const item of draggableItems) {
    if (
      eventTarget === item ||
      eventTarget.parentElement === item ||
      eventTarget.parentElement.parentElement === item
    ) {
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
    e.target.parentElement.classList.contains("being__dragged") ||
    e.target.parentElement.parentElement.classList.contains("being__dragged")
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
  if (popup && !popup.classList.contains("hidden")) {
    const icon = popup.querySelector(".popup__icon");
    const title = popup.querySelector(".popup__title");
    const html = `<div class="taskbar__popup close" data-parent-class="${
      popup.classList[0]
    }">
  <img src=${icon.src} alt="">
  <span>${textTruncate(title.innerText, 20)}</span>
</div>`;
    startMenuBtn.insertAdjacentHTML("afterend", html);
    const currentItem = taskbar.querySelector(
      `[data-parent-class='${popup.classList[0]}'`
    );
    currentItem.addEventListener("click", () => {
      toggleHiddenClass(popup);
      currentItem.classList.toggle("minimized");
    });
  } else {
    // Delete from taskbar if popup is hidden or removed
    const popupTaskbar = taskbar.querySelector(
      `[data-parent-class='${popup.classList[0]}'`
    );
    popupTaskbar.remove();
  }
}

// 3.4 POPUP FUNCTIONS
function whoAmiPopup(e) {
  const eventTarget = e.closest(".shortcut");
  const title = eventTarget.querySelector(".shortcut__title");
  const icon = eventTarget.querySelector(".shortcut__icon");
  if (!document.querySelector(".help__popup")) {
    html = `<div class="help__popup draggable popup">
  <div class="basic__window__top__container">
      <div class="basic__window_top">
          <div class="basic__window__top__left">
              <img class="popup__icon" src="${icon.src}" alt="">
              <div class="popup__title">${title.innerText}</div>
          </div>
          <div class="basic__window__top__right">
              <div class="minimize__popup__button popup__button">
                  <div class="minimize__box"></div>
              </div>
              <div class="close__popup__button popup__button">&#10006</div>
          </div>
      </div>
      <div class="basic__window__middle">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Help</span>
      </div>
  </div>

  <div class="popup__main__section__container">
      <div class="popup__main_section">
          <div class="popup__main__text">
              <h1>Hi! I'm Jacques</h1>
              <p>I'm a 36 year old self-taught front-end developer. Originally from Cape Town, South Africa,
                  I'm
                  currently living in Bangkok,
                  Thailand with my wonderful wife since late 2020</p>
              <p>In 2020 I was laid off from my job as an Application support engineer. I thought to myself
                  that this was the perfect opportunity to change my career path to something that I actually
                  enjoy...development!</p>

              <p>I have since taught myself the Unity engine and C# for game Development, mostly for fun and
                  out of curiosity.</p>
              <p>One of my android games were actually <a target="_blank"
                      href="https://www.pocketgamer.com/golf-in-60-seconds/">nominated for best sport game of
                      2021 on PocketGamer.com.</a> </p>
              <p>I'm currently laser focused on web development and taught myself HTML, CSS, JavaScript,
                  Nodejs with express, and mongoDB.</p>
              <p>I'm fascinated with creating content and user experiences with code.</p>
          </div>
          <div class="popup__main__image">
              <img src="./src/images/other_images/Jacques.jpg" alt="">
          </div>
      </div>
  </div>
  <div class="basic__window__bottom__container">
      <div class="basic__window__bottom_left">1 object(s)</div>
      <div class="basic__window__bottom_rest">
          <div class="basic__window__bottom__rest__text">352 bytes</div>
          <img src="/src/images/win95_icons/3lines.png" alt="">
      </div>
  </div>
</div>`;

    container.insertAdjacentHTML("beforeend", html);
  }
}

function skillsPopup(e) {
  const eventTarget = e.closest(".shortcut");
  const title = eventTarget.querySelector(".shortcut__title");
  const icon = eventTarget.querySelector(".shortcut__icon");
  html = `<div class="skills__popup draggable popup">
  <div class="basic__window__top__container">
      <div class="basic__window_top">
          <div class="basic__window__top__left">
              <img class="popup__icon" src="${icon.src}" alt="">
              <div class="popup__title">${title.innerText}</div>
          </div>
          <div class="basic__window__top__right">
              <div class="minimize__popup__button popup__button">
                  <div class="minimize__box"></div>
              </div>
              <div class="close__popup__button popup__button">&#10006</div>
          </div>
      </div>
  </div>

  <div class="popup__main__section__container">
      <div class="popup__main_section">
          <div class="popup__main__text">
              <p>Microsoft(R) Windows 95</p>
              <p>(C)Copyright Microsoft Corp 1981-1996.</p>
              <p class="skills__cd">C:\\Users\\Jacques></p>
              <p class="skills__dir"></p>
              <div class="skills__list">

              </div>
              <p class='skills__end'></p>
          </div>
      </div>
  </div>
</div>`;
  container.insertAdjacentHTML("beforeend", html);
}

//// EVENT LISTENERS & FUNCTION EXECUTION

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

/* shorcutHelp.addEventListener("dblclick", (e) => {
  console.log("dbl");
  if (!document.querySelector(".help__popup")) {
    whoAmiPopup(e.target);
    const popup = document.querySelector(".help__popup");
    addRemoveToTaskbar(popup);
  } else {
    const popup = document.querySelector(".help__popup");
    toggleHiddenClass(popup);
  }
});
shorcutHelp.addEventListener("touchstart", () => {
  if (!document.querySelector(".help__popup")) {
    whoAmiPopup(e.target);
    const popup = document.querySelector(".help__popup");
    addRemoveToTaskbar(popup);
  } else {
    const popup = document.querySelector(".help__popup");
    toggleHiddenClass(popup);
  }
}); */

shortcuts.forEach((shortcut) => {
  console.log(shortcut);
  // Setting event listener for WHO AM I / Skills shortcut
  if (shortcut.classList.contains("shortcut__help")) {
    shortcut.addEventListener("dblclick", (e) => {
      if (!document.querySelector(".help__popup")) {
        whoAmiPopup(e.target);
        addRemoveToTaskbar(document.querySelector(".help__popup"));
      } else {
        toggleHiddenClass(document.querySelector(".help__popup"));
      }
    });
    shortcut.addEventListener("touchstart", (e) => {
      if (!document.querySelector(".help__popup")) {
        whoAmiPopup(e.target);
        addRemoveToTaskbar(document.querySelector(".help__popup"));
      } else {
        toggleHiddenClass(document.querySelector(".help__popup"));
      }
    });
  }
  // Setting up event listener for SKILLS shortcut
  if (shortcut.classList.contains("shortcut__skills")) {
    shortcut.addEventListener("dblclick", (e) => {
      if (!document.querySelector(".skills__popup")) {
        skillsPopup(e.target);

        /* 
                      <p class= "skills_win95">Microsoft(R) Windows 95</p>
              <p class="skills__copyright">(C)Copyright Microsoft Corp 1981-1996.</p>
              <p class="skills__cd">C:\\Users\\Jacques></p>
              <p class="skills__dir">C:\\Users\\Jacques\\skills>dir</p>
              <div class="skills_list">
                  <div class="left">
                      <p>HTML</p>
                      <p>CSS</p>
                      <p>SCSS & SASS</p>
                      <p>JavaScript</p>
        */

        typeWriter(
          "cd skills",
          document.querySelector(".skills__cd"),
          1000,
          100
        );
        delayedText(
          "C:\\Users\\Jacques\\skills>",
          document.querySelector(".skills__dir"),
          2000,
          false
        );
        typeWriter("dir", document.querySelector(".skills__dir"), 2500, 300);
        delayedText(
          skillsHtml,
          document.querySelector(".skills__list"),
          3400,
          true
        );
        delayedText(
          "C:\\Users\\Jacques\\skills>",
          document.querySelector(".skills__end"),
          3400,
          false
        );

        addRemoveToTaskbar(document.querySelector(".skills__popup"));
      } else {
        toggleHiddenClass(document.querySelector(".skills__popup"));
      }
    });
    shortcut.addEventListener("touchstart", (e) => {
      if (!document.querySelector(".skills__popup")) {
        skillsPopup(e.target);
        addRemoveToTaskbar(document.querySelector(".skills__popup"));
      } else {
        toggleHiddenClass(document.querySelector(".skills__popup"));
      }
    });
  }
});

/* container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false); */

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

document.addEventListener("click", (e) => {
  console.log(e.target);
  // adding event listener to dynamic popup close btns
  if (
    e.target.classList.contains("close__popup__button") ||
    e.target.parentElement.classList.contains("close__popup__button")
  ) {
    const parent = e.target.closest(".popup");
    const trayShortcut = taskbar.querySelector(
      `[data-parent-class='${parent.classList[0]}'`
    );
    trayShortcut.remove();
    parent.remove();
  }

  // adding event listener to dynamic popup minimize btns
  if (
    e.target.classList.contains("minimize__popup__button") ||
    e.target.parentElement.classList.contains("minimize__popup__button")
  ) {
    console.log(e.target);
    const parent = e.target.closest(".popup");
    const trayShortcut = taskbar.querySelector(
      `[data-parent-class='${parent.classList[0]}'`
    );
    trayShortcut.classList.toggle("minimized");
    toggleHiddenClass(parent);
  }
});

setTime();
