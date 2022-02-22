// 1. ELEMENT VARIABLES
let draggableItems = document.querySelectorAll(".draggable");
const time = document.querySelector(".time");
const container = document.querySelector(".container");
const startMenuBtn = document.querySelector(".start__btn");
const startMenu = document.querySelector(".start__menu");
const shortcuts = document.querySelectorAll(".shortcut");
const shorcutHelp = document.querySelector(".shortcut__help");
const popupHelp = document.querySelector(".help__popup");
const allPopups = document.getElementsByClassName(".popup");
const taskbar = document.querySelector(".taskbar");
// 2. GLOBAL VARIABLES
let dragMovement = 0;
const elementTypes = ["textarea", "input"];
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

// handle contact form submission
async function handleSubmit(event, form) {
  event.preventDefault();

  const status = document.getElementById("status");
  status.textContent = "";
  status.classList.remove("error", "success");
  const data = new FormData(event.target);
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        status.innerHTML = "Thanks for your submission!";
        form.reset();
        status.classList.add("success");
      } else {
        response.json().then((data) => {
          if (Object.hasOwn(data, "errors")) {
            status.innerHTML = data["errors"]
              .map((error) => error["message"])
              .join(", ");
          } else {
            status.innerHTML = "Oops! There was a problem submitting your form";
          }
          status.classList.add("error");
        });
      }
    })
    .catch((error) => {
      status.innerHTML = "Oops! There was a problem submitting your form";
    });

  form.addEventListener("submit", handleSubmit);
}

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
      eventTarget.closest(".draggable") === item &&
      !elementTypes.includes(eventTarget.localName)
    ) {
      console.dir(eventTarget);
      item.classList.add("being__dragged");
      return item;
    }
  }
}

function dragStart(e) {
  // only prevent default if target is not an input, otherwise focus on click wont work
  if (!elementTypes.includes(e.target.localName)) e.preventDefault();

  dragMovement = 0;
  // this is the item we are interacting with
  activeItem = setDraggableClass(e.target);
  if (activeItem && activeItem.classList.contains("draggable")) {
    active = true;
    if (!activeItem.xOffset) {
      activeItem.xOffset = 0;
    }

    if (!activeItem.yOffset) {
      activeItem.yOffset = 0;
    }

    activeItem.initialX = e.clientX - activeItem.xOffset;
    activeItem.initialY = e.clientY - activeItem.yOffset;
  }
}

function drag(e) {
  if (active) {
    //adding to dragMovement var when dragged. Ths variable can then be used later to prevent a click event to trigger after drag
    dragMovement++;

    activeItem.xOffset = activeItem.currentX = e.clientX - activeItem.initialX;
    activeItem.yOffset = activeItem.currentY = e.clientY - activeItem.initialY;

    setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
  }
}

function dragEnd(e) {
  if (activeItem) {
    activeItem.initialX = activeItem.currentX;
    activeItem.initialY = activeItem.currentY;

    //removes 'draggable' class
    setTimeout(() => {});
    draggableItems.forEach((element) =>
      element.classList.remove("being__dragged")
    );
  }

  active = false;
  activeItem = null;
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
    const html = `<div class="taskbar__popup win95__border__clicked close" data-parent-class="${
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
    html = `<div class="help__popup draggable popup win95__border">
  <div class="basic__window__top__container">
      <div class="basic__window_top">
          <div class="basic__window__top__left">
              <img class="popup__icon" src="${icon.src}" alt="">
              <div class="popup__title">${title.innerText}</div>
          </div>
          <div class="basic__window__top__right">
              <div class="minimize__popup__button popup__button win95__border">
                  <div class="minimize__box"></div>
              </div>
              <div class="close__popup__button popup__button win95__border">&#10006</div>
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
      <div class="basic__window__bottom_left win95__border__invert">1 object(s)</div>
      <div class="basic__window__bottom_rest win95__border__invert">
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
  html = `<div class="skills__popup draggable popup win95__border">
  <div class="basic__window__top__container">
      <div class="basic__window_top">
          <div class="basic__window__top__left">
              <img class="popup__icon" src="${icon.src}" alt="">
              <div class="popup__title">${title.innerText}</div>
          </div>
          <div class="basic__window__top__right">
              <div class="minimize__popup__button popup__button win95__border">
                  <div class="minimize__box"></div>
              </div>
              <div class="close__popup__button popup__button win95__border">&#10006</div>
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

function contactFormPopup(e) {
  const eventTarget = e.closest(".shortcut");
  const title = eventTarget.querySelector(".shortcut__title");
  const icon = eventTarget.querySelector(".shortcut__icon");
  const html = `<div class="email__popup draggable popup win95__border">
  <div class="basic__window__top__container">
      <div class="basic__window_top">
          <div class="basic__window__top__left">
              <img class="popup__icon" src="${icon.src}" alt="">
              <div class="popup__title">${title.innerText}</div>
          </div>
          <div class="basic__window__top__right">
              <div class="minimize__popup__button popup__button win95__border">
                  <div class="minimize__box"></div>
              </div>
              <div class="close__popup__button popup__button win95__border">&#10006</div>
          </div>
      </div>
  </div>
  <form id="contact__form" action="https://formspree.io/f/xoqrdpbb" method="POST">
      <div class="email__button__container">
          <button id="form__submit" type="submit">
              <img src="./src/images/win95_icons/Letter.ico" alt="">
              <span>Send</span>
          </button>
          <div id="status"></div>
      </div>
      <div class="email__inputs">
          <h2>New Message</h2>
          <p>To: <span>Jacques</span> </p>
          <div>
              <label for="email">From:</label>
              <input type="email" autocomplete="off" id="email" name="email">
          </div>
          <div>
              <label for="subject">Subject:</label>
              <input type="text" autocomplete="off" id="subject" name="subject">
          </div>

          <textarea name="message" id="message" style="resize: none;"></textarea>
      </div>
  </form>
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

shortcuts.forEach((shortcut) => {
  // Setting event listener for WHO AM I / Skills shortcut
  if (shortcut.classList.contains("shortcut__help")) {
    shortcut.addEventListener("click", (e) => {
      if (dragMovement <= 10) {
        if (!startMenu.classList.contains("hidden")) {
          startMenuBtn.classList.toggle("clicked");
          toggleHiddenClass(startMenu);
        }
        if (!document.querySelector(".help__popup")) {
          whoAmiPopup(e.target);
          addRemoveToTaskbar(document.querySelector(".help__popup"));
        } else {
          toggleHiddenClass(document.querySelector(".help__popup"));
          const trayShortcut = taskbar.querySelector(
            `[data-parent-class='${
              document.querySelector(".help__popup").classList[0]
            }'`
          );
          trayShortcut.classList.toggle("minimized");
        }
      }
    });
  }
  // Setting up event listener for SKILLS shortcut
  if (shortcut.classList.contains("shortcut__skills")) {
    shortcut.addEventListener("click", (e) => {
      if (dragMovement <= 10) {
        if (!startMenu.classList.contains("hidden")) {
          startMenuBtn.classList.toggle("clicked");
          toggleHiddenClass(startMenu);
        }
        if (!document.querySelector(".skills__popup")) {
          skillsPopup(e.target);
          const skillsCd = document.querySelector(".skills__cd");
          const skillsDr = document.querySelector(".skills__dir");
          const skillsList = document.querySelector(".skills__list");
          const skillsEnd = document.querySelector(".skills__end");
          typeWriter("cd skills", skillsCd, 1000, 100);
          delayedText("C:\\Users\\Jacques\\skills>", skillsDr, 2000, false);
          typeWriter("dir", skillsDr, 2500, 300);
          delayedText(skillsHtml, skillsList, 3400, true);
          delayedText("C:\\Users\\Jacques\\skills>", skillsEnd, 3400, false);
          addRemoveToTaskbar(document.querySelector(".skills__popup"));
        } else {
          toggleHiddenClass(document.querySelector(".skills__popup"));
          const trayShortcut = taskbar.querySelector(
            `[data-parent-class='${
              document.querySelector(".skills__popup").classList[0]
            }'`
          );
          trayShortcut.classList.toggle("minimized");
        }
      }
    });
  }
  // Setting up event listener for CONTACT/EMAIL shortcut
  if (shortcut.classList.contains("shortcut__contact")) {
    shortcut.addEventListener("click", (e) => {
      if (dragMovement <= 10) {
        if (!startMenu.classList.contains("hidden")) {
          startMenuBtn.classList.toggle("clicked");
          toggleHiddenClass(startMenu);
        }
        if (!document.querySelector(".email__popup")) {
          contactFormPopup(e.target);
          addRemoveToTaskbar(document.querySelector(".email__popup"));
        } else {
          toggleHiddenClass(document.querySelector(".email__popup"));
          const trayShortcut = taskbar.querySelector(
            `[data-parent-class='${
              document.querySelector(".email__popup").classList[0]
            }'`
          );
          trayShortcut.classList.toggle("minimized");
        }
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
    const parent = e.target.closest(".popup");
    const trayShortcut = taskbar.querySelector(
      `[data-parent-class='${parent.classList[0]}'`
    );
    trayShortcut.classList.toggle("minimized");
    toggleHiddenClass(parent);
  }

  // adding event listener to contact form submiission btn
  if (
    e.target.id === "form__submit" ||
    e.target.parentElement.id === "form__submit"
  ) {
    const form = document.getElementById("contact__form");
    console.log(form);
    form.addEventListener("submit", (e) => {
      handleSubmit(e, form);
    });
  }
});

setTime();

// sets clippy container to hidden after animation has played
setTimeout(() => {
  document.querySelector(".clippy__container").classList.add("hidden");
}, 6000);
