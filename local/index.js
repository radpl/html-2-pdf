(function () {
  function toPDFServer() {
    const element = document.getElementById('main');
    genPDFServer(element);
  }

  function toPDFClient() {
    const element = document.getElementById('main');
    genPDFClient(element);
  }

  function genPDFServer(element) {
    domtoimage2.toSvg(element).then((result) => {
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

  function genPDFClient(element) {
    generatePNG(element).then(dataurl => generatePDF(dataurl));
  }

  function generatePNG(element) {
    return domtoimage.toPng(element)
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-test-image.png';
        link.href = dataUrl;
        link.click();
        return dataUrl;
      });
  }

  function generatePDF(element) {
    console.log('generate PDF');
    const doc = new jspdf.jsPDF();

    const i = new Image();
    let imgSize = {};
    i.onload = function () {
      imgSize = { w: i.naturalWidth, h: i.naturalHeight };
      const scale = (imgSize.w / (+doc.internal.pageSize.getWidth() * 0.9));
      const width = imgSize.w / scale;
      const height = imgSize.h / scale;
      doc.internal.scaleFactor = 4;
      doc.addImage(element, 'jpeg', 10, 10, width, height);
      doc.save('my-test-pdf.pdf');
    };
    i.src = element;
  }

  const button1 = document.getElementById('toPDFClient');
  button1.addEventListener('click', toPDFClient);

  const button2 = document.getElementById('toPDFServer');
  button2.addEventListener('click', toPDFServer);
})();