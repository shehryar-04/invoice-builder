/**
 * Calculation utilities for invoice
 */

export function calculateLineTotal(quantity, unitPrice) {
  return quantity * unitPrice;
}

export function calculateSubtotal(items) {
  return items.reduce((sum, item) => {
    return sum + calculateLineTotal(item.quantity, item.unitPrice);
  }, 0);
}

export function calculateTax(subtotal, taxPercentage) {
  return subtotal * (taxPercentage / 100);
}

export function calculateGrandTotal(subtotal, taxAmount, discount) {
  return Math.max(0, subtotal + taxAmount - discount);
}

export function calculateInvoiceTotals(invoice) {
  const subtotal = calculateSubtotal(invoice.items);
  const taxAmount = calculateTax(subtotal, invoice.taxPercentage);
  const grandTotal = calculateGrandTotal(subtotal, taxAmount, invoice.discount);

  return {
    subtotal,
    taxAmount,
    grandTotal
  };
}
