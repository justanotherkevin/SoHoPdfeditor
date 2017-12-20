function openPDF() {
  // Code for REST call
  // var getHeaders = new Headers({
  //     'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value,
  //     'Accept': 'application/json; odata=verbose'
  // })
  //
  // var getOptions = {
  //     method: 'GET',
  //     headers: getHeaders,
  //     credentials: 'include'
  // }
  // fetch(_spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('PDFEditorTestLibrary')/items(1)", getOptions ).then(
  //   function(response) {
  //     if (response.ok) {
  //       console.log(response)
  //       return response.json();
  //     }
  //     else {
  //       console.log(response)
  //       throw new Error('Network response was not ok.');
  //     }
  //   }).then(function(data) {
  //     if (window.console) {
  //       debugger
  //       const dataURI = data.d.File.__deferred.uri
  //       var doc = new jsPDF()
  //       doc.setFontSize(40)
  //       doc.text(35, 25, 'Paranyan loves jsPDF')
  //       doc.addImage(imgData, 'JPEG', 15, 40, 180, 160)
  //     }
  //   }).catch(function(error) {
  //     // Error handling code goes here
  //   })

  const fileURL = 'https://sohodragon.sharepoint.com/sites/Training/allaintest/PDFEditorTestLibrary/TestPDF.pdf'
  const embedTag = document.getElementById('samplePDF')

  if (embedTag.src !== fileURL) {
    embedTag.src = fileURL
  }

}

var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
  backgroundColor: 'rgba(255, 255, 255, 0)',
  penColor: 'rgb(0, 0, 0)'
});
var saveButton = document.getElementById('save');
var cancelButton = document.getElementById('clear');

saveButton.addEventListener('click', function (event) {
  var data = signaturePad.toDataURL('image/png');
  console.log(data);
  // download(data, 'hello.pdf')
// Send data to server instead...
  var doc = new jsPDF('p', 'mm');
  doc.addImage( data, 'PNG', 10, 10 )
  doc.save('sample-file.pdf');
  // window.open(data);
});

cancelButton.addEventListener('click', function (event) {
  signaturePad.clear();
});

function previewFile() {
  let getPDF = {};
  getPDF.file = document.querySelector('input[type=file]').files[0];

  var reader = new FileReader();

  reader.addEventListener("load", function () { 
    getPDF.dataURI = reader.result;
    console.log(reader.result);
  }, false);

  if (getPDF.file) {
		reader.readAsDataURL(getPDF.file)
  }

}

