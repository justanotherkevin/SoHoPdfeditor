// window.onload = function(){
//   var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
//     backgroundColor: 'rgba(255, 255, 255, 0)',
//     penColor: 'rgb(0, 0, 0)'
//   });
//   var saveButton = document.getElementById('save');
//   var cancelButton = document.getElementById('clear');
//   const embedTag = document.getElementById('samplePDF')
//
//   // EventListener for save button
//   saveButton.addEventListener('click', function (event) {
//     let getPDF = {};
//     getPDF.file = document.querySelector('input[type=file]').files[0];
//
//     var reader = new FileReader();
//
//     reader.addEventListener("load", function () { 
//       // write PDF (jdPDF)
//       var doc = new jsPDF();
//       getPDF.dataURI = reader.result;
//       doc.addImage( getPDF.dataURI, 'PNG', 10, 10 )
//       var data = signaturePad.toDataURL('image/png');
//       // console.log(data);
//       // download(data, 'hello.pdf')
//       // Send data to server instead...
//       doc.addImage( data, 'PNG', 10, 10 )
//       doc.save('sample-file.pdf');
//
//     }, false);
//
//     if (getPDF.file) {
//       reader.readAsDataURL(getPDF.file)
//     }
//
//     // window.open(data);
//   });
//   // EventListener for cancel button
//   cancelButton.addEventListener('click', function (event) {
//     signaturePad.clear();
//   });
//
// }
// function openPDF() {
//   const fileURL = 'https://sohodragon.sharepoint.com/sites/Training/allaintest/PDFEditorTestLibrary/TestPDF.pdf'
//   // const embedTag = document.getElementById('samplePDF')
//   debugger
//   if (embedTag.src !== fileURL) {
//     embedTag.src = fileURL
//   }
//
// }
// function previewFile() {
//   let getPDF = {};
//   getPDF.file = document.querySelector('input[type=file]').files[0];
//
//   var reader = new FileReader();
//
//   reader.addEventListener("load", function () { 
//     getPDF.dataURI = reader.result;
//     console.log(reader.result);
//   }, false);
//
//   if (getPDF.file) {
// 		reader.readAsDataURL(getPDF.file)
//   }
//
// }
console.log('helllo');
var __PDF_DOC,
	__CURRENT_PAGE,
	__TOTAL_PAGES,
	__PAGE_RENDERING_IN_PROGRESS = 0,
	__CANVAS = $('#pdf-canvas').get(0),
	__CANVAS_CTX = __CANVAS.getContext('2d');

function showPDF(pdf_url) {
	const upbutton = document.getElementById('pdf-loader')

	upbutton.style.visibility = 'visible'
	// $("#pdf-loader").show();

	PDFJS.getDocument({ url: pdf_url }).then(function(pdf_doc) {
		__PDF_DOC = pdf_doc;
		__TOTAL_PAGES = __PDF_DOC.numPages;

		// Hide the pdf loader and show pdf container in HTML
		$("#pdf-loader").hide();
		$("#pdf-contents").show();
		$("#pdf-total-pages").text(__TOTAL_PAGES);

		// Show the first page
		showPage(1);
	}).catch(function(error) {
		// If error re-show the upload button
		$("#pdf-loader").hide();
		$("#upload-button").show();

		alert(error.message);
	});;
}

function showPage(page_no) {
	__PAGE_RENDERING_IN_PROGRESS = 1;
	__CURRENT_PAGE = page_no;

	// Disable Prev & Next buttons while page is being loaded
	$("#pdf-next, #pdf-prev").attr('disabled', 'disabled');

	// While page is being rendered hide the canvas and show a loading message
	$("#pdf-canvas").hide();
	$("#page-loader").show();

	// Update current page in HTML
	$("#pdf-current-page").text(page_no);

	// Fetch the page
	__PDF_DOC.getPage(page_no).then(function(page) {
		// As the canvas is of a fixed width we need to set the scale of the viewport accordingly
		var scale_required = __CANVAS.width / page.getViewport(1).width;

		// Get viewport of the page at required scale
		var viewport = page.getViewport(scale_required);

		// Set canvas height
		__CANVAS.height = viewport.height;

		var renderContext = {
			canvasContext: __CANVAS_CTX,
			viewport: viewport
		};

		// Render the page contents in the canvas
		page.render(renderContext).then(function() {
			__PAGE_RENDERING_IN_PROGRESS = 0;

			// Re-enable Prev & Next buttons
			$("#pdf-next, #pdf-prev").removeAttr('disabled');

			// Show the canvas and hide the page loader
			$("#pdf-canvas").show();
			$("#page-loader").hide();
		});
	});
}

// when select pdf is clicked, triger a file select at input-tag
$("#upload-button").on('click', function() {
	$("#file-to-upload").trigger('click');
});

// When user chooses a PDF file
$("#file-to-upload").on('change', function() {
	const uploadedFile = document.getElementById('file-to-upload').files[0]
	// Validate whether PDF
    if(['application/pdf'].indexOf(uploadedFile.type) == -1) {
        alert('Error : Not a PDF');
        return;
    }

	$("#upload-button").hide();

	// run showPDF; Send the object url of the pdf
	showPDF(URL.createObjectURL(uploadedFile));
});

// Previous page of the PDF
$("#pdf-prev").on('click', function() {
	if(__CURRENT_PAGE != 1)
		showPage(--__CURRENT_PAGE);
});

// Next page of the PDF
$("#pdf-next").on('click', function() {
	if(__CURRENT_PAGE != __TOTAL_PAGES)
		showPage(++__CURRENT_PAGE);
});
