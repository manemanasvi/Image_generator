document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username") || "User";
  const welcomeUserEl = document.getElementById("welcomeUser");
  if (welcomeUserEl) {
    welcomeUserEl.textContent = username;
  }
});
