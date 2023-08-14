/* Enables Dark Mode */
const modeButton = document.getElementById("mode-button");
const sideBar = document.querySelector(".sidebar");
modeButton.addEventListener("click", (e) => {
  console.log("clicked");
  if (sideBar.classList.contains("light-mode")) {
    modeButton.innerHTML = "Switch to Light Mode";
    sideBar.classList.remove("light-mode");
    sideBar.classList.add("dark-mode");
  } else {
    modeButton.innerHTML = "Switch to Dark Mode";
    sideBar.classList.add("light-mode");
    sideBar.classList.remove("dark-mode");
  }
});
