/**
 * Validation utilities for invoice
 */

export function validateHeaderFields(clientName, invoiceNumber, invoiceDate) {
  const errors = {};

  if (!clientName || clientName.trim() === '') {
    errors.clientName = 'Client name is required';
  }

  // Invoice number is auto-generated, no need to validate user input

  if (!invoiceDate || invoiceDate.trim() === '') {
    errors.invoiceDate = 'Invoice date is required';
  }

  return errors;
}

export function validateLineItem(item) {
  const errors = {};

  if (!item.description || item.description.trim() === '') {
    errors.description = 'Description is required';
  }

  if (item.quantity <= 0) {
    errors.quantity = 'Quantity must be greater than 0';
  }

  if (item.unitPrice < 0) {
    errors.unitPrice = 'Unit price cannot be negative';
  }

  return errors;
}

export function validateTaxPercentage(value) {
  if (value < 0) {
    return 'Tax percentage cannot be negative';
  }
  return '';
}

export function validateDiscount(value) {
  if (value < 0) {
    return 'Discount cannot be negative';
  }
  return '';
}

export function validateInvoice(invoice) {
  const errors = {};

  // Validate header
  const headerErrors = validateHeaderFields(
    invoice.clientName,
    invoice.invoiceNumber,
    invoice.invoiceDate
  );
  if (Object.keys(headerErrors).length > 0) {
    errors.header = headerErrors;
  }

  // Validate line items
  if (!invoice.items || invoice.items.length === 0) {
    errors.items = 'At least one line item is required';
  } else {
    const itemErrors = invoice.items.map((item, index) => ({
      index,
      errors: validateLineItem(item)
    })).filter(result => Object.keys(result.errors).length > 0);

    if (itemErrors.length > 0) {
      errors.itemErrors = itemErrors;
    }
  }

  // Validate tax and discount
  const taxError = validateTaxPercentage(invoice.taxPercentage);
  if (taxError) {
    errors.taxPercentage = taxError;
  }

  const discountError = validateDiscount(invoice.discount);
  if (discountError) {
    errors.discount = discountError;
  }

  return errors;
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
