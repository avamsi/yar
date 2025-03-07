const rulesEl = document.getElementById("rules");

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get({ rules: "" }, (storage) => {
    rulesEl.innerText = storage.rules;
  });
});

rulesEl.addEventListener("input", () => {
  rulesEl.classList.add("dirty");
  chrome.storage.sync.set({ rules: rulesEl.innerText }, () => {
    rulesEl.classList.remove("dirty");
    rulesEl.classList.add("saved");
    setTimeout(() => {
      rulesEl.classList.remove("saved");
    }, 500);
  });
});
