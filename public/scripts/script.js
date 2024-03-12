let generateBarcodes = (barcodeArr) => {
    barcodeArr.forEach(barcode => {
        if(barcode == ''){
            return
        }else{
            let barcodeWidth = localStorage.getItem('barcode-width')
            let barcodeHeight = localStorage.getItem('barcode-height')
            let barcodeMargin = localStorage.getItem('barcode-margin')
            $('#barcode-container').append(`<img class="barcode-img" id="barcode-${barcode}">`)
            $('.barcode-img').attr('style', `width: ${barcodeWidth}px; height: ${barcodeHeight}px; padding-left: ${barcodeMargin}px;`)
            JsBarcode(`#barcode-${barcode}`, `${barcode}`)
        }
    })
}

let updateBarcodeSize = () => {
    let barcodeWidth = localStorage.getItem('barcode-width')
    let barcodeHeight = localStorage.getItem('barcode-height')
    let barcodeMargin = localStorage.getItem('barcode-margin')
    $('.barcode-img').attr('style', `width: ${barcodeWidth}px; height: ${barcodeHeight}px; padding-left: ${barcodeMargin}px;`)
}

let checkLocalStorage = () => {
    if(localStorage.getItem('barcode-width') == undefined || localStorage.getItem('barcode-width') == ''){
        localStorage.setItem('barcode-width', '200')
    }
    if(localStorage.getItem('barcode-height') == undefined || localStorage.getItem('barcode-height') == ''){
        localStorage.setItem('barcode-height', '160')
    }
    if(localStorage.getItem('barcode-margin') == undefined || localStorage.getItem('barcode-margin') == ''){
        localStorage.setItem('barcode-margin', '0')
    }
    $('#barcode-width-input').val(localStorage.getItem('barcode-width'))
    $('#barcode-height-input').val(localStorage.getItem('barcode-height'))
    $('#barcode-margin-input').val(localStorage.getItem('barcode-margin'))
}

$(document).ready(function(){

    checkLocalStorage()

    $('#barcode-input').change(function(e){
        var file = e.target.files[0]
        if (!file) {
            return
        }

        if (file.type !== 'text/csv') {
            alert('selected file is not a csv')
            return
        }
        
        var reader = new FileReader()
        reader.onload = function(e){
            var csvData = e.target.result
            csvData = csvData.split(' ').join('')
            csvData = csvData.split('\r').join('')
            csvData = csvData.split('\n').join(',')
            if(csvData.length < 1 || csvData == ' '){
                alert('csv file is empty')
                return
            }
            generateBarcodes(csvData.split(','))
        }
        reader.readAsText(file)
    })

    $('.barcode-size-input').on('input', function() {
        let selectedInput = $(this).attr('id')
        let selectedValue = $(this).val()
        if(selectedInput == 'barcode-width-input'){
            localStorage.setItem('barcode-width', selectedValue)
        }
        if(selectedInput == 'barcode-height-input'){
            localStorage.setItem('barcode-height', selectedValue)
        }
        if(selectedInput == 'barcode-margin-input'){
            localStorage.setItem('barcode-margin', selectedValue)
        }
        updateBarcodeSize()
    })
})