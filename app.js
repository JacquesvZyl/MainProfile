const time = document.querySelector(".time");

// Generates time in taskbar
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

setTime();
