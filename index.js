let exportPlugin

let  data = [
  ['ID', 'FAMILY', 'HPO', 'DATE', 'SAVE'],
  []
]

createTable(data)

document.getElementById('import_btn').addEventListener('change', event => {
  let reader = new FileReader()
  reader.onload = (event => {
    let object = JSON.parse(event.target.result)
    convertObjectToArray(object.PATIENTS)
  })
  reader.readAsText(event.target.files[0])
})

function convertObjectToArray(object) {
  if (object.length <= 0) {
    return
  }

  let data = []

  let headers = Object.keys(object[0])
  data.push(headers)

  object.forEach(o => {
    let pData = []
    headers.forEach(h => {
      pData.push(o[h])
    })

    data.push(pData)
  })

  createTable(data)
}

function createTable(data) {
  const container = document.getElementById('example')
  container.innerHTML = ''

  const hot = new Handsontable(container, {
    data: data,
    rowHeaders: false,
    colHeaders: false,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
  })

  exportPlugin = hot.getPlugin('exportFile')
}

document.getElementById('export_btn').addEventListener('click', () => {
  const exportedString = exportPlugin.exportAsString('csv', {
    bom: false,
    columnDelimiter: ',',
    columnHeaders: false,
    exportHiddenColumns: false,
    exportHiddenRows: false,
    rowDelimiter: '\r\n',
    rowHeaders: false
  })

  convertArrayToObject(exportedString.split('\r\n'))
})

function convertArrayToObject(array) {
  if (array.length <= 0) {
    return
  }

  let patientsData = []
  let headers = array[0].split(',')
  array.shift()

  array.forEach(a => {
    let pData = {}

    let data = a.split(',')
    data.forEach((d, i) => {
      pData[headers[i]] = d
    })

    patientsData.push(pData)
  })

  exportFile({PATIENTS: patientsData})
}

function exportFile(object) {
  let data = `text/json;charset=utf-8,` +
             `${encodeURIComponent(JSON.stringify(object, null, 4))}`

  let a = document.createElement('a')
  a.href = `data:${data}`
  a.download = `patients_${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
}