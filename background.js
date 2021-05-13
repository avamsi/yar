/**
 * Converts multiple lines of rules of the pattern `old > new` to a two
 * dimensional array of the format [[old, new], ..].
 * @param {string} rulesString
 * @return {!Array<string>}
 */
const rulesStringToArray = rulesString =>
    rulesString.split('\n')
        .map(rule => rule.split('>'))
        .filter(parts => parts.length == 2)
        .map(([part1, part2]) => [part1.trim(), part2.trim()])
        .filter(([part1, part2]) => part1 !== '' && part2 !== '');

let rules = [];

chrome.storage.sync.get({'rules': ''}, (storage) => {
  rules = rulesStringToArray(storage.rules);
});

chrome.storage.onChanged.addListener(changes => {
  rules = rulesStringToArray(changes.rules.newValue);
});

chrome.webRequest.onBeforeRequest.addListener(details => {
  if (details.type === 'main_frame') {
    for (const [old, replacement] of rules) {
      if (details.url.startsWith(old)) {
        return {redirectUrl: details.url.replace(old, replacement)};
      }
    }
  }
}, {urls: ['<all_urls>']}, ['blocking']);
