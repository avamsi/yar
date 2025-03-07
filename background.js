function dnrRules(rawRules) {
  return rawRules
    .split("\n")
    .map((rule) => rule.split(">"))
    .filter((parts) => parts.length === 2)
    .map(([oldPrefix, newPrefix], i) => ({
      id: i + 1,
      priority: i + 1,
      action: {
        type: "redirect",
        redirect: {
          regexSubstitution: newPrefix.trim() + "\\1",
        },
      },
      condition: {
        regexFilter: "^" + oldPrefix.trim() + "(.*)$",
        resourceTypes: ["main_frame"],
      },
    }));
}

function updateRules(rawRules) {
  chrome.declarativeNetRequest.getDynamicRules((oldRules) => {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRules.map((rule) => rule.id),
      addRules: dnrRules(rawRules),
    });
  });
}

chrome.storage.sync.get({ rules: "" }, (storage) => {
  updateRules(storage.rules);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.rules) {
    updateRules(changes.rules.newValue);
  }
});
