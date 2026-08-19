import { useState } from 'react';
import InvoiceHeader from './InvoiceHeader';
import LineItems from './LineItems';
import InvoiceSummary from './InvoiceSummary';
import {
  validateInvoice,
  validateClientName,
  validateInvoiceDateField,
  validateItemDescription,
  validateQuantity,
  validateUnitPrice,
  validateTaxPercentage,
  validateDiscount,
  isWithinMaxDigits
} from '../utils/validation';

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

    // Real-time validation for each header field
    const newErrors = { ...validationErrors };

    if (field === 'clientName') {
      const error = validateClientName(value);
      if (error) {
        newErrors.clientName = error;
      } else {
        delete newErrors.clientName;
      }
    } else if (field === 'invoiceDate') {
      const error = validateInvoiceDateField(value);
      if (error) {
        newErrors.invoiceDate = error;
      } else {
        delete newErrors.invoiceDate;
      }
    }

    // Preserve header errors object structure
    const headerErrors = newErrors.header || {};
    const filteredHeaderErrors = Object.keys(headerErrors).reduce((acc, key) => {
      if (key !== field) acc[key] = headerErrors[key];
      return acc;
    }, {});

    if (Object.keys(filteredHeaderErrors).length > 0) {
      newErrors.header = filteredHeaderErrors;
    } else {
      delete newErrors.header;
    }

    setValidationErrors(newErrors);
  };

  const handleItemsChange = (items) => {
    onInvoiceChange({
      ...invoice,
      items
    });

    // Real-time validation for all item fields
    const itemErrors = [];
    items.forEach((item, index) => {
      const errors = {};

      const descError = validateItemDescription(item.description);
      if (descError) errors.description = descError;

      const qtyError = validateQuantity(item.quantity);
      if (qtyError) errors.quantity = qtyError;

      const priceError = validateUnitPrice(item.unitPrice);
      if (priceError) errors.unitPrice = priceError;

      if (Object.keys(errors).length > 0) {
        itemErrors.push({ index, errors });
      }
    });

    // Update validation errors
    const newErrors = { ...validationErrors };
    if (itemErrors.length > 0) {
      newErrors.itemErrors = itemErrors;
    } else {
      delete newErrors.itemErrors;
    }
    delete newErrors.items; // Clear general items error when there are specific item errors

    setValidationErrors(newErrors);
  };

  const handleTaxChange = (value) => {
    const numValue = value === '' ? 0 : parseFloat(value) || 0;

    onInvoiceChange({
      ...invoice,
      taxPercentage: numValue
    });

    const error = validateTaxPercentage(numValue);
    const newErrors = { ...validationErrors };

    if (error) {
      newErrors.taxPercentage = error;
    } else {
      delete newErrors.taxPercentage;
    }

    setValidationErrors(newErrors);
  };

  const handleDiscountChange = (value) => {
    if (!isWithinMaxDigits(value, 50)) {
      return;
    }
    const numValue = value === '' ? 0 : parseFloat(value) || 0;

    onInvoiceChange({
      ...invoice,
      discount: numValue
    });

    const error = validateDiscount(numValue);
    const newErrors = { ...validationErrors };

    if (error) {
      newErrors.discount = error;
    } else {
      delete newErrors.discount;
    }

    setValidationErrors(newErrors);
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
              max="100"
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
          <label htmlFor="discount">Discount</label>
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
