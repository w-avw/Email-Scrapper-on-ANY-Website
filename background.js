chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.action === 'startScraping') {
    const { csvData, headers } = await chrome.storage.local.get(['csvData', 'headers']);
    let emailCols = [];
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      const url = row.URL;
      if (!url) continue;
      const tab = await chrome.tabs.create({ url, active: false });
      const emails = await extractEmailsFromTab(tab.id);
      chrome.tabs.remove(tab.id);
      emails.forEach((email, idx) => {
        const colName = idx === 0 ? 'Email' : (emailCols[idx] || (`Email_${idx+1}`));
        row[colName] = email;
        if (!emailCols.includes(colName)) emailCols.push(colName);
      });
      chrome.storage.local.set({ csvData });
      await new Promise(r => setTimeout(r, 1000));
    }
    downloadUpdatedCSV(csvData, headers.concat(emailCols));
  }
});

function extractEmailsFromTab(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
        const text = document.body.innerText;
        return Array.from(new Set(text.match(regex) || []));
      },
    }, results => resolve(results[0].result));
  });
}

async function downloadUpdatedCSV(data, headers) {
  const csvContent = Papa.unparse(data, { columns: headers });
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  await chrome.downloads.download({ url, filename: 'emails-scraped.csv' });
}
