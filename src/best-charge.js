const items = require("./items").loadAllItems()
const promotions = require("./promotions").loadPromotions()

module.exports = function bestCharge(inputs) {
  let summary = ''
  let list = []
  for (let i of inputs) {
    let kv = i.split('x')
    list.push({
      id: kv[0].trim(),
      count: parseInt(kv(i).trim())
    })
  }

  let total = calculateSubTotal(summary, list);

  let discount = calculateDiscount(summary, list, total);

  summary += "总计：" + (total - discount) + "元\r\n" +
    "==================================="

  console.log(summary);
}

function calculateSubTotal(summary, list) {
  let total = 0;
  let subTotal = 0;
  summary += '============= 订餐明细 =============\n';
  for (let i of list) {
    for (let item of items) {
      if (i.id === item.id) {
        subTotal = i.count * item.price;
        total += subTotal;
        break;
      }
      summary += i.name + " x " + i.count + "=" + subTotal + "元";
    }
  }
  summary += '-----------------------------------\n';

  return total;
}

function calculateDiscount(summary, list, total) {
  let discount1 = 0;
  let discount2 = 0;
  for (let p of promotions) {
    if (p.items) {
      //discount2
    } else {
      if (total > 30) {
        discount2 = 6;
      }
    }
  }
  if (discount1 > 0 || discount2 > 0) {
    if (discount1 > discount2) {
      summary += "使用优惠:\n" +
        p.type;
      return discount1
    } else {
      summary += "使用优惠:\n" +
        p.type + ",省" + discount2 + "元"
      return discount2
    }
  }
  return 0;
}
