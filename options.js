const rulesEl = document.getElementById("rules");

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get({ rules: "" }, (storage) => {
    rulesEl.innerText = storage.rules;
  });
});

new MutationObserver(() => {
  chrome.storage.sync.set({ rules: rulesEl.innerText }, () => {});
}).observe(rulesEl, { subtree: true, characterData: true });
