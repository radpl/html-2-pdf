(function () {

  this.toPDFServer = genPDFServer;

  function genPDFServer(element) {
    domtoimage2.toSvg(element, { imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2P4////fwAJ+wP9BUNFygAAAABJRU5ErkJggg==' }).then((result) => {
      const root = document.createElement('html');
      const body = document.createElement('body');
      body.appendChild(result);
      root.appendChild(body);
      return root.outerHTML
    }).then(downloadPDF);
  }

  function downloadPDF(html) {
    fetch("http://localhost:3001/generatePDF", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ html }),
      responseType: 'blob'
    }).then((response) => {
      if (response.ok) {
        return response.blob();
      }
    }).then(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'example-pdf-server.pdf';
      link.click();
    });
  }
})();