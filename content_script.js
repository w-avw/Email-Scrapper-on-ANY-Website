(() => {
  const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  const text = document.body.innerText;
  const found = Array.from(new Set(text.match(regex) || []));
  if (found.length > 0) {
    chrome.storage.local.set({ emails: found }, () => {
      console.log('Emails encontrados:', found);
    });
  }
})();
