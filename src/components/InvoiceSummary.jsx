import React from 'react';
import { calculateInvoiceTotals } from '../utils/calculations';

export default function InvoiceSummary({ invoice }) {
  const { subtotal, taxAmount, grandTotal } = calculateInvoiceTotals(invoice);

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="invoice-summary">
      <div className="summary-row">
        <span className="label">Subtotal</span>
        <span className="value">{formatCurrency(subtotal)}</span>
      </div>

      {invoice.taxPercentage > 0 && (
        <div className="summary-row">
          <span className="label">Tax ({invoice.taxPercentage}%)</span>
          <span className="value">{formatCurrency(taxAmount)}</span>
        </div>
      )}

      {invoice.discount > 0 && (
        <div className="summary-row">
          <span className="label">Discount</span>
          <span className="value">-{formatCurrency(invoice.discount)}</span>
        </div>
      )}

      <div className="summary-divider"></div>

      <div className="summary-row grand-total">
        <span className="label">Grand Total</span>
        <span className="value">{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
}
