'use strict';
var totalPrice = 0.00;
var save = 0.00;
function printReceipt(inputs) {
    let allItems = loadAllItems();
    let promotItems = loadPromotions();
    //console.log(allItems);
    let itemMap = solveItems(allItems, inputs, promotItems);
    //console.log(itemMap.size);
    let itemStr = formatInfo(itemMap);
    let printResult = printFormat(itemStr);
    console.log(printResult);

}
function solveItems(allItems, inputs, promotItems) {
    let countMap = new Map();
    for (let i = 0; i < inputs.length; i++) {
        let code = inputs[i].substring(0, 10);
        if (!countMap.has(code)) {
            if (inputs[i].indexOf("-") !== -1) {
                countMap.set(code, parseFloat(inputs[i].substring(11)));
            } else {
                countMap.set(code, 1);
            }
        } else {
            if (inputs[i].indexOf("-") !== -1) {
                countMap.set(code, countMap.get(code) + parseFloat(inputs[i].substring(11)));
            } else {
                countMap.set(code, countMap.get(code) + 1);
            }
        }
    }
    let promotMap = new Map();
    for (let i = 0; i < promotItems.length; i++) {
        promotMap.set(promotItems[i]["type"], promotItems[i]["barcodes"]);
    }

    let itemMap = new Map();
    for (let j = 0; j < allItems.length; j++) {
        let temp = allItems[j];
        if (countMap.has(temp["barcode"])) {
            let saveTemp = 0.00;
            if (promotMap.get("BUY_TWO_GET_ONE_FREE").indexOf(temp["barcode"]) !== -1) {
                saveTemp=Math.floor(countMap.get(temp["barcode"]) / 3) * temp["price"];
                save += saveTemp;
            }
            totalPrice += (temp["price"] * countMap.get(temp["barcode"]));
            itemMap.set(temp["barcode"], {
                "name": temp["name"],
                "count": countMap.get(temp["barcode"]),
                "unit": temp["unit"],
                "price": temp["price"].toFixed(2),
                "diviTotal": (temp["price"] * countMap.get(temp["barcode"])
                    - saveTemp).toFixed(2)
            })


        }
    }
    return itemMap;
}
function formatInfo(itemMap) {
    let itemStr = "";
    itemMap.forEach(function (value) {
        itemStr += ("名称：" + value["name"] + "，数量：" + value["count"]
            + value["unit"] + "，单价：" + value["price"]
            + "(元)，小计：" + value["diviTotal"] + "(元)\n")
    })
    return itemStr; 
}
function printFormat(itemStr) {
    let printResult = "***<没钱赚商店>收据***\n";
    printResult += itemStr;
    printResult += "----------------------\n";
    printResult += ("总计：" + (totalPrice-save).toFixed(2) + "(元)\n");
    printResult += ("节省：" + save.toFixed(2) + "(元)\n");
    printResult += "**********************";
    return printResult;
}
