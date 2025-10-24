async function generateBarcodes(barcodeArr) {

    if(barcodeArr[barcodeArr.length-1] == ''){
        barcodeArr.pop()
    }

    $('#totalBarcodes').text(barcodeArr.length.toString())

    const chunkSize = 1;
    for (let i = 0; i < barcodeArr.length; i += chunkSize) {
        $('#completedBarcodes').text(i+1)
        const chunk = barcodeArr.slice(i, i + chunkSize)
        await processBarcodeChunk(chunk)
        if(i == barcodeArr.length - 1){
            $('#barcode-container').attr('style', 'opacity:1;')
            $('.spinner-bg').attr('style', 'display:none;')
            $('.spinner-container').attr('style', 'display:none;')
        }
    }
}

async function processBarcodeChunk(chunk) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            chunk.forEach(barcode => {
                if (barcode === '') {
                    return
                } else {
                    const barcodeWidth = localStorage.getItem('barcode-width')
                    const barcodeHeight = localStorage.getItem('barcode-height')
                    const barcodeRowMargin = localStorage.getItem('barcode-row-margin')
                    const barcodeColumnMargin = localStorage.getItem('barcode-column-margin')
                    $('#barcode-container').append(`<img class="barcode-img" id="barcode-${barcode}">`)
                    $('.barcode-img').attr('style', `width: ${barcodeWidth}px; height: ${barcodeHeight}px; padding-left: ${barcodeRowMargin}px; padding-bottom: ${barcodeColumnMargin}`)
                    JsBarcode(`#barcode-${barcode}`, `${barcode}`)
                }
            });
            resolve()
        }, 0)
    })
}

let updateBarcodeSize = () => {
    let barcodeWidth = localStorage.getItem('barcode-width')
    let barcodeHeight = localStorage.getItem('barcode-height')
    let barcodeRowMargin = localStorage.getItem('barcode-row-margin')
    let barcodeColumnMargin = localStorage.getItem('barcode-column-margin')
    $('.barcode-img').attr('style', `width: ${barcodeWidth}px; height: ${barcodeHeight}px; padding-left: ${barcodeRowMargin}px; padding-bottom: ${barcodeColumnMargin}px;`)
}

let checkLocalStorage = () => {
    if(localStorage.getItem('barcode-width') == undefined || localStorage.getItem('barcode-width') == ''){
        localStorage.setItem('barcode-width', '150')
    }
    if(localStorage.getItem('barcode-height') == undefined || localStorage.getItem('barcode-height') == ''){
        localStorage.setItem('barcode-height', '100')
    }
    if(localStorage.getItem('barcode-row-margin') == undefined || localStorage.getItem('barcode-row-margin') == ''){
        localStorage.setItem('barcode-row-margin', '4')
    }
    if(localStorage.getItem('barcode-column-margin') == undefined || localStorage.getItem('barcode-column-margin') == ''){
        localStorage.setItem('barcode-column-margin', '4')
    }
    $('#barcode-width-input').val(localStorage.getItem('barcode-width'))
    $('#barcode-height-input').val(localStorage.getItem('barcode-height'))
    $('#barcode-row-margin-input').val(localStorage.getItem('barcode-row-margin'))
    $('#barcode-column-margin-input').val(localStorage.getItem('barcode-column-margin'))
}

async function processCSV(file) {
    return new Promise((resolve, reject) => {
        $('#barcode-container').attr('style', 'opacity:0.2;')
        $('.spinner-bg').attr('style', 'display:block;')
        $('.spinner-container').attr('style', 'display:block;')

        var reader = new FileReader()
        reader.onload = function (e) {
            var csvData = e.target.result
            csvData = csvData.split(' ').join('')
            csvData = csvData.split('\r').join('')
            csvData = csvData.split('\n').join(',')
            if (csvData.length < 1 || csvData == ' ') {
                alert('csv file is empty')
                return
            }
            generateBarcodes(csvData.split(','))
                .then(() => resolve())
                .catch(error => reject(error))
        }
        reader.onerror = function (event) {
            reject(event.target.error)
        }

        reader.readAsText(file)
    })
}

$(document).ready(function(){

    checkLocalStorage()

    $('#barcode-input').change(async function(e){
        var file = e.target.files[0]
        if (!file) {
            return
        }

        if (file.type !== 'text/csv') {
            alert('selected file is not a csv')
            return
        }

        try {
            await processCSV(file)
        } catch (error) {
            console.error('Error processing CSV:', error)
        }
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
        if(selectedInput == 'barcode-row-margin-input'){
            localStorage.setItem('barcode-row-margin', selectedValue)
        }
        if(selectedInput == 'barcode-column-margin-input'){
            localStorage.setItem('barcode-column-margin', selectedValue)
        }
        updateBarcodeSize()
    })

    $('#hide-input-icon').on('click', () => {
        $('#input-container').slideToggle()
    })

    $('#print-icon').on('click', () => {
        $('#input-container').attr('style', 'display:none')
        $('.icon').attr('style', 'display:none')
        window.print()
    })

    window.onafterprint = function() {
        $('#input-container').attr('style', 'display:block')
        $('.icon').attr('style', 'display:block')
    }
})