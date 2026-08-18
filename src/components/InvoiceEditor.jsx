import React, { useState } from 'react';
import InvoiceHeader from './InvoiceHeader';
import LineItems from './LineItems';
import InvoiceSummary from './InvoiceSummary';
import { validateInvoice, validateTaxPercentage, validateDiscount } from '../utils/validation';

export default function InvoiceEditor({
  invoice,
  onInvoiceChange,
  onSave,
  editingId,
  isSaving
}) {
  const [validationErrors, setValidationErrors] = useState({});

  const handleHeaderChange = (field, value) => {
    onInvoiceChange({
      ...invoice,
      [field]: value
    });
    // Clear error for this field
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  const handleItemsChange = (items) => {
    onInvoiceChange({
      ...invoice,
      items
    });
    // Clear items error
    if (validationErrors.items || validationErrors.itemErrors) {
      const newErrors = { ...validationErrors };
      delete newErrors.items;
      delete newErrors.itemErrors;
      setValidationErrors(newErrors);
    }
  };

  const handleTaxChange = (value) => {
    const numValue = value === '' ? 0 : Math.max(0, parseFloat(value) || 0);
    const error = validateTaxPercentage(numValue);
    
    onInvoiceChange({
      ...invoice,
      taxPercentage: numValue
    });

    if (error) {
      setValidationErrors({ ...validationErrors, taxPercentage: error });
    } else {
      const newErrors = { ...validationErrors };
      delete newErrors.taxPercentage;
      setValidationErrors(newErrors);
    }
  };

  const handleDiscountChange = (value) => {
    const numValue = value === '' ? 0 : Math.max(0, parseFloat(value) || 0);
    const error = validateDiscount(numValue);
    
    onInvoiceChange({
      ...invoice,
      discount: numValue
    });

    if (error) {
      setValidationErrors({ ...validationErrors, discount: error });
    } else {
      const newErrors = { ...validationErrors };
      delete newErrors.discount;
      setValidationErrors(newErrors);
    }
  };

  const handleSave = () => {
    const errors = validateInvoice(invoice);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onSave();
  };

  const headerErrors = validationErrors.header || {};

  return (
    <div className="invoice-editor">
      <InvoiceHeader
        invoice={invoice}
        onHeaderChange={handleHeaderChange}
        errors={headerErrors}
      />

      <LineItems
        items={invoice.items}
        onItemsChange={handleItemsChange}
        errors={validationErrors}
        generalError={validationErrors.items}
      />

      <div className="tax-discount-section">
        <div className="form-group">
          <label htmlFor="taxPercentage">Tax Percentage</label>
          <div className="input-with-suffix">
            <input
              id="taxPercentage"
              type="number"
              value={invoice.taxPercentage}
              onChange={(e) => handleTaxChange(e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
              className={validationErrors.taxPercentage ? 'input-error' : ''}
            />
            <span className="suffix">%</span>
          </div>
          {validationErrors.taxPercentage && (
            <span className="error-message">{validationErrors.taxPercentage}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="discount">Discount (amount)</label>
          <input
            id="discount"
            type="number"
            value={invoice.discount}
            onChange={(e) => handleDiscountChange(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className={validationErrors.discount ? 'input-error' : ''}
          />
          {validationErrors.discount && (
            <span className="error-message">{validationErrors.discount}</span>
          )}
        </div>
      </div>

      <InvoiceSummary invoice={invoice} />

      <div className="editor-actions">
        <button
          onClick={handleSave}
          className="btn-save"
          disabled={isSaving}
        >
          {editingId ? 'Save Changes' : 'Save Invoice'}
        </button>
      </div>
    </div>
  );
}
