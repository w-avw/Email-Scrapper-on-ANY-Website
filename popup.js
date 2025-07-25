document.getElementById('start').addEventListener('click', () => {
  const file = document.getElementById('csvFile').files[0];
  if (!file) return alert('Selecciona un archivo CSV');

  Papa.parse(file, {
    header: true,
    worker: true,
    complete: results => {
      chrome.storage.local.set({ csvData: results.data, headers: results.meta.fields }, () => {
        chrome.runtime.sendMessage({ action: 'startScraping' });
        document.getElementById('status').textContent =
          `Archivo cargado: ${results.data.length} filas, encabezados: ${results.meta.fields.join(', ')}`;
      });
    },
    error: err => alert(`Error al leer CSV: ${err.message}`)
  });
});
