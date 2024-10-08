const ExcelJS = require('exceljs');
var fs = require("fs");

const workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile("./files/ZoreAksesuarID.xlsx")
  .then(() => {
    let theData = [];
    let position = 0;
    let products = [];

    workbook.eachSheet((ws, sheetId) => {
      if(sheetId === 1) return;
      // let headers = {};

      // console.log("sheetid", sheetId);
      
      // for(let i=1; i <= ws.actualRowCount; i++) {
      //   headers[i] = ws.getRow(1).getCell(i).value;
      //   console.log("header", headers[i]);
      // }

      for(let x=2; x <= ws.actualRowCount; x++) {
        const barcode = ws.getRow(x).getCell(1).value;
        if(barcode === null) continue;
        // console.log("barcode", barcode.toString())
        if(products.includes(barcode.toString())) continue;

        let theRow = {};
        
        for(let y=1; y <= ws.actualColumnCount; y++) {
          let value = ws.getRow(x).getCell(y).value;
          if(value === null) continue;

          value = value.toString();
          theRow[getHeader(y)] = value?.trim();
        }

        // console.log("tr", theRow);
        
        if(theRow["data"]) {
          position++;
          theRow.position = position;
          products.push(barcode.toString());
          theData.push(theRow);
        }
      }

    })
    // console.log(theData);
    const jsonData = JSON.stringify({ products: theData });
    fs.writeFile("products.json", jsonData, "utf-8", () => console.log("JSON created!"))
    // console.log(jsonData);

    createHTML(theData);
    
  }).catch(e => console.log(e));

// console.log(workbook)

function getHeader(col) {
  // console.log("col", col);
  const headers = [
    "barcode"
    , "model"
    , "seller"
    , "color"
    , "data"
    , "product-name"
    , "products-model"
    , "brand"
    , "category"
    , "compatible"
  ];
  return headers[col - 1];
}

function createHTML(data) {
  const htmlString = data.map(product => {
    return `
    <a href="" class="card" data-item-id="${product['data']}" data-category="${product['category'].replace('Aksesuarlar-', '')}" data-brand="${product['brand']}" data-compatible="${product['compatible']}">
      <div class="card__container">
        <div class="card__image">
          <img src="" class="xml-image" alt="${product['product-name']}" />
        </div>
        <div class="card__text">
          <h2 class="card__text-title xml-h2-title">${product['product-name']}</h2>
          <div class="card__text-pricearea">
            <p class="card__text-price xml-sales-price"></p>
          </div>
        </div>
      </div>
      <div class="card__ribbon"></div>
    </a>\n`; 
  }).join("");
  fs.writeFile("products.html", htmlString, "utf-8", () => console.log("HTML created!"))
}