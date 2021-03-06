import { jsPDF } from "jspdf";
import domtoimage from "dom-to-image";
import tohtml from "./dom-to-image";

function generate() {
  const element = document.getElementById('main');
  //generatePNG(element).then(dataurl => generatePDF(dataurl));
  generateHTML(element);
}

function generateHTML(element) {
  tohtml.toSvg(element).then((result) => {
    const root = document.createElement('html');
    const body = document.createElement('body');
    body.appendChild(result);
    root.appendChild(body);
    const toSend = root.outerHTML;
    const json = JSON.stringify(toSend);

    fetch("http://localhost:3001/generatePDF", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ html: toSend }),
      responseType: 'blob'
    }).then((response) => {
      if (response.ok) {
        return response.blob();
        //console.log('fetch response');
        //console.log(response);
        //console.log(response.arrayBuffer());
      }
    }).then(blob => {
      //const pdf = new Blob(blob, { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `your-file-name.pdf`
      link.click()
    });
  });
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
  const doc = new jsPDF();

  const i = new Image();
  let imgSize = {};
  i.onload = function () {
    imgSize = { w: i.naturalWidth, h: i.naturalHeight }
    console.log(imgSize, width, height);
    doc.internal.scaleFactor = 4;
    doc.addImage(element, 'jpeg', 10, 10, 189, 233);
    doc.save('my-test-pdf.pdf');
  };
  i.src = element;
}

const button = document.getElementById('toPDF');
button.addEventListener('click', generate);
