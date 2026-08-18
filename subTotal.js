const invoice = [
  {
    description: "Website",
    quantity: 2,
    unitPrice: 500
  },
  {
    description: "Hosting",
    quantity: 1,
    unitPrice: 100
  }
]
// Always add the 0 at the end as the initial value
function calculateSubtotal(items) {
  return items.reduce((accumulator, currentItem) => {
    return accumulator + (currentItem.quantity * currentItem.unitPrice);
  }, 0);
}

function calculateTax(subtotal,taxPercent){
  taxPercent = taxPercent/100
  const tax = subtotal*taxPercent

  return tax
}

function calculate_total(subtotal,calTAX,discount){
const total = (subtotal+calTAX)-discount
return total
}
const subtotal = calculateSubtotal(invoice);
const TAX = calculateTax(1100,12)
const total = calculate_total(subtotal,TAX,32)
console.log(subtotal)
console.log(TAX)
console.log(total)