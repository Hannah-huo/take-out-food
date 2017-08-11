loadAllItems = require('./items')
loadPromotions = require('./promotions')

const promotions = loadPromotions()
const items = loadAllItems()

module.exports = function bestCharge(inputs) {
  let priceInfo = {total:0, discount:0};
  let summary = ''
  let list = []
  for (let i of inputs) {
    let kv = i.split('x')
    let k = kv[0].trim()
    let p = items.find(r => r.id === k)
    list.push({
      id: k,
      price: p.price,
      name: p.name,
      count: parseInt(kv[1].trim())
    })
  }

  summary += getDetailSummary(list, priceInfo);

  summary += getDiscountSummary(list, priceInfo);

  summary += "总计：" + (priceInfo.total - priceInfo.discount) + "元\n" +
    "==================================="

  return summary;
}

function getDetailSummary(list, priceInfo) {
  let summary = ''
  let subTotal = 0;
  summary += '============= 订餐明细 =============\n';
  for (let i of list) {
    subTotal = i.count * i.price;
    priceInfo.total += subTotal;
    summary += i.name + " x " + i.count + " = " + subTotal + "元\n";
  }
  summary += '-----------------------------------\n';
  return summary;
}

function getDiscountSummary(list, priceInfo) {
  let summary = '';
  let discount1 = 0;
  let discount2 = 0;

  let discountItems = [];
  for (let p of promotions) {
    if (p.items) {
      //discount1
      for (let l of list) {
        for(let v of p.items){
          if(v === l.id){
            discount1 += l.price / 2 * l.count;
            discountItems.push(l.name)
          }
        }
      }
    } else {
      if (priceInfo.total > 30) {
        discount2 = 6;
      }
    }
  }

  if (discount1 > 0 || discount2 > 0) {
    if (discount1 > discount2) {
      summary += "使用优惠:\n" + promotions[1].type + "(";
      for (let i = 0; i < discountItems.length; i++) {
        summary += discountItems[i]
        if (i !== discountItems.length - 1) {
          summary += "，"
        }
      }
      summary += ")，省" + discount1 + "元\n" +
        "-----------------------------------\n"
      priceInfo.discount = discount1
    } else {
      summary += "使用优惠:\n" + promotions[0].type + "，省" + discount2 + "元\n"+
        "-----------------------------------\n"
      priceInfo.discount = discount2
    }
  }
  return summary;
}
