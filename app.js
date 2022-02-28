// 1. ELEMENT VARIABLES
let draggableItems = document.querySelectorAll(".draggable");
const time = document.querySelector(".time");
const container = document.querySelector(".container");
const startMenuBtn = document.querySelector(".start__btn");
const startMenu = document.querySelector(".start__menu");
const shorcutHelp = document.querySelector(".shortcut__help");
const popupHelp = document.querySelector(".help__popup");
const allPopups = document.getElementsByClassName(".popup");
const taskbar = document.querySelector(".taskbar");

/// Custom Class ///
class App {
  #html;
  #popup;
  #dragMovement = 0;
  #active = false;
  #activeItem = null;
  #elementTypes = ["textarea", "input"];
  #skillsHtml = `
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
  constructor() {
    // drag event listeners
    container.addEventListener("mousedown", this._dragStart.bind(this));
    container.addEventListener("mouseup", this._dragEnd.bind(this));
    container.addEventListener("mousemove", this._drag.bind(this));
    // app functionality event listeners
    container.addEventListener("click", this._newPopup.bind(this));
    container.addEventListener("click", this._toggleTaskbarMinimize.bind(this));
    container.addEventListener("click", this._togglePopupMinimize.bind(this));
    container.addEventListener("click", this._toggleStartMenu.bind(this));
    container.addEventListener("click", this._closePopup.bind(this));
    container.addEventListener("submit", this._handleFormSubmit.bind(this));
    this._setTime();
    this._removeClippy();
  }

  // Remove clippy after animation
  _removeClippy() {
    setTimeout(() => {
      document.querySelector(".clippy__container").classList.add("hidden");
    }, 10000);
  }
  //Set taskbar time
  _setTime() {
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
  _toggleHiddenClass(element) {
    element.classList.toggle("hidden");
  }

  _togglePopupMinimizeClass(element) {
    element.classList.toggle("minimized");
  }

  _toggleStartMenu(e) {
    if (e.target.closest(".start__btn")) {
      this._toggleHiddenClass(startMenu);
    } else {
      if (!startMenu.classList.contains("hidden"))
        this._toggleHiddenClass(startMenu);
    }
  }

  _newPopup(e) {
    function addToTaskbar(popupName, icon, title) {
      const popup = document.querySelector(popupName);
      console.dir(popup);
      // Add to taskbar id popup if visible
      if (popup && !popup.classList.contains("hidden")) {
        //prettier-ignore
        const html = `<div class="taskbar__popup win95__border__clicked close" data-parent="${popup.classList[0]}">
      <img src=${icon.src} alt="">
      <span>${title.innerText}</span>
    </div>`;
        startMenuBtn.insertAdjacentHTML("afterend", html);
      }
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

    if (e.target.closest(".shortcut")) {
      const eventTarget = e.target.closest(".shortcut");
      const title = eventTarget.querySelector(".shortcut__title");
      const icon = eventTarget.querySelector(".shortcut__icon");

      if (eventTarget.classList.contains("shortcut__skills")) {
        this.#popup = ".skills__popup";
        this.#html = `<div class="skills__popup draggable popup win95__border">
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
      }
      if (eventTarget.classList.contains("shortcut__help")) {
        this.#popup = ".help__popup";
        this.#html = `<div class="help__popup draggable popup win95__border">
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
                        Thailand with my wonderful wife since late 2020.</p>
                    <p>In 2020 I was retrenched from my job as an Application support engineer. I thought to myself
                        that this was the perfect opportunity to change my career path to something that I actually
                        enjoy...development!</p>
      
                    <p>I have since taught myself the Unity engine and C# for game Development, mostly for fun and
                        out of curiosity.</p>
                    <p>One of my android games was actually <a target="_blank"
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
      }
      if (eventTarget.classList.contains("shortcut__contact")) {
        this.#popup = ".email__popup";
        this.#html = `<div class="email__popup draggable popup win95__border">
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
      }
      //only create popup if it doesnt currently exist && if its currently not being dragged
      if (!document.querySelector(this.#popup) && this.#dragMovement <= 10) {
        container.insertAdjacentHTML("beforeend", this.#html);
        addToTaskbar(this.#popup, icon, title);
        // if the popup is the skills popup, run animations
        if (this.#popup === ".skills__popup") {
          const skillsCd = document.querySelector(".skills__cd");
          const skillsDr = document.querySelector(".skills__dir");
          const skillsList = document.querySelector(".skills__list");
          const skillsEnd = document.querySelector(".skills__end");
          typeWriter("cd skills", skillsCd, 1000, 100);
          //prettier-ignore
          delayedText("C:\\Users\\Jacques\\skills>",skillsDr,2000,false);
          typeWriter("dir", skillsDr, 2500, 300);
          delayedText(this.#skillsHtml, skillsList, 3400, true);
          //prettier-ignore
          delayedText("C:\\Users\\Jacques\\skills>",skillsEnd,3400,false);
        }
      }
    }
  }

  _toggleTaskbarMinimize(e) {
    if (e.target.closest(".taskbar__popup")) {
      const currentTaskbar = e.target.closest(".taskbar__popup");
      const popup = currentTaskbar.dataset.parent;
      const popupElement = document.querySelector(`.${popup}`);
      this._toggleHiddenClass(popupElement);
      this._togglePopupMinimizeClass(currentTaskbar);
    }
  }

  _togglePopupMinimize(e) {
    if (e.target.closest(".minimize__popup__button")) {
      const popup = e.target.closest(".popup");
      //prettier-ignore
      const taskbarShortcut = taskbar.querySelector(`[data-parent='${popup.classList[0]}'`);
      console.log(popup.classList);
      this._togglePopupMinimizeClass(taskbarShortcut);
      this._toggleHiddenClass(popup);
    }
  }

  _closePopup(e) {
    if (e.target.closest(".close__popup__button")) {
      const popup = e.target.closest(".popup");
      //prettier-ignore
      const taskbarShortcut = taskbar.querySelector(`[data-parent='${popup.classList[0]}'`);
      popup.remove();
      taskbarShortcut.remove();
    }
  }

  _dragStart(e) {
    // only prevent default if target is not an input or textarea, otherwise focus on click wont work
    if (!this.#elementTypes.includes(e.target.localName)) e.preventDefault();

    this.#dragMovement = 0;
    // this is the item we are interacting with
    this.#activeItem = this._setDraggableClass(e.target);
    if (this.#activeItem && this.#activeItem.classList.contains("draggable")) {
      this.#active = true;
      if (!this.#activeItem.xOffset) {
        this.#activeItem.xOffset = 0;
      }

      if (!this.#activeItem.yOffset) {
        this.#activeItem.yOffset = 0;
      }

      this.#activeItem.initialX = e.clientX - this.#activeItem.xOffset;
      this.#activeItem.initialY = e.clientY - this.#activeItem.yOffset;
    }
  }

  _drag(e) {
    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    if (this.#active) {
      //adding to dragMovement var when dragged. Ths variable can then be used later to prevent a click event to trigger after drag
      this.#dragMovement++;

      this.#activeItem.xOffset = this.#activeItem.currentX =
        e.clientX - this.#activeItem.initialX;
      this.#activeItem.yOffset = this.#activeItem.currentY =
        e.clientY - this.#activeItem.initialY;

      setTranslate(
        this.#activeItem.currentX,
        this.#activeItem.currentY,
        this.#activeItem
      );
    }
  }

  _dragEnd(e) {
    if (this.#activeItem) {
      this.#activeItem.initialX = this.#activeItem.currentX;
      this.#activeItem.initialY = this.#activeItem.currentY;

      //removes 'draggable' class

      draggableItems.forEach((element) =>
        element.classList.remove("being__dragged")
      );
    }

    this.#active = false;
    this.#activeItem = null;
  }

  // if eventTarget is in shotcuts array, add class to that shortcut element so that we can call it later
  _setDraggableClass(eventTarget) {
    draggableItems = document.querySelectorAll(".draggable");
    for (const item of draggableItems) {
      if (
        eventTarget.closest(".draggable") === item &&
        !this.#elementTypes.includes(eventTarget.localName)
      ) {
        item.classList.add("being__dragged");
        return item;
      }
    }
  }

  // handle contact form submission
  async _handleFormSubmit(event) {
    event.preventDefault();
    const form = document.querySelector("#contact__form");
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
              status.innerHTML =
                "Oops! There was a problem submitting your form";
            }
            status.classList.add("error");
          });
        }
      })
      .catch((error) => {
        status.innerHTML = "Oops! There was a problem submitting your form";
      });
  }
}

const app = new App();
