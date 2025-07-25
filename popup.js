document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('emailList');
  chrome.storage.local.get('emails', data => {
    const emails = data.emails || [];
    if (emails.length === 0) {
      list.innerHTML = '<li>No se encontraron emails</li>';
    } else {
      emails.forEach(email => {
        const li = document.createElement('li');
        li.textContent = email;
        list.appendChild(li);
      });
    }
  });
  document.getElementById('clear').addEventListener('click', () => {
    chrome.storage.local.clear(() => {
      list.innerHTML = '<li>Lista vaciada</li>';
    });
  });
});
