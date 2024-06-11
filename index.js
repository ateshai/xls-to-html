const ExcelJS = require('exceljs');
var fs = require("fs");

const workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile("./files/Buff-Aksesuar_ID.xlsx")
  .then(() => {
    let theData = [];
    let position = 0;
    let products = [];

    workbook.eachSheet((ws, sheetId) => {
      let headers = {};

      // console.log("sheetid", sheetId);
      
      for(let i=1; i <= ws.actualRowCount; i++) {
        headers[i] = ws.getRow(1).getCell(i).value;
      }

      for(let x=2; x <= ws.actualRowCount; x++) {
        const barcode = ws.getRow(x).getCell(1).value;
        // console.log("barcode", barcode.toString())
        if(products.includes(barcode.toString())) continue;

        let theRow = {};
        position++;
        theRow.position = position;
        for(let y=1; y <= ws.actualColumnCount; y++) {
          if(ws.getRow(x).getCell(y).value === null) continue;

          theRow[headers[y]] = ws.getRow(x).getCell(y).value.trim();
        }
        products.push(barcode.toString());
        theData.push(theRow);
      }

    })
    // console.log(theData);
    const jsonData = JSON.stringify({ products: theData });
    fs.writeFile("products.json", jsonData, "utf-8", () => console.log("file created!"))
  }).catch(e => console.log(e));

// console.log(workbook)