/**
 * Validation utilities for invoice
 */

/**
 * Calculate the minimum allowed date (50 years ago from today)
 */
function getMinimumAllowedDate() {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 50, today.getMonth(), today.getDate());
  return minDate;
}

/**
 * Calculate the maximum allowed date (50 years in the future from today)
 */
function getMaximumAllowedDate() {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() + 50, today.getMonth(), today.getDate());
  return maxDate;
}

/**
 * Format date as YYYY-MM-DD for HTML date input
 */
export function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if invoice date is within 100 years range (50 years before to 50 years after today)
 */
function isValidInvoiceDate(dateString) {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return false;
    
    // Date must not be more than 50 years in the future
    const maxDate = getMaximumAllowedDate();
    if (date > maxDate) return false;
    
    // Date must not be more than 50 years old
    const minDate = getMinimumAllowedDate();
    if (date < minDate) return false;
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate client name field
 */
export function validateClientName(clientName) {
  if (!clientName || clientName.trim() === '') {
    return 'Client name is required';
  }
  if (clientName.length > 100) {
    return 'Client name must not exceed 100 characters';
  }
  return '';
}

/**
 * Validate invoice number field
 */
export function validateInvoiceNumber(invoiceNumber) {
  if (!invoiceNumber || invoiceNumber.trim() === '') {
    return 'Invoice number is required';
  }
  if (invoiceNumber.length > 50) {
    return 'Invoice number must not exceed 50 characters';
  }
  return '';
}

/**
 * Validate invoice date field
 */
export function validateInvoiceDateField(invoiceDate) {
  if (!invoiceDate || invoiceDate.trim() === '') {
    return 'Invoice date is required';
  }
  if (!isValidInvoiceDate(invoiceDate)) {
    return 'Invoice date must be within 50 years before or after today';
  }
  return '';
}

/**
 * Validate item description
 */
export function validateItemDescription(description) {
  if (!description || description.trim() === '') {
    return 'Description is required';
  }
  if (description.length > 500) {
    return 'Description must not exceed 500 characters';
  }
  return '';
}

/**
 * Count the number of digits in a number (excluding decimal point and sign)
 */
function countDigits(value) {
  // Convert to string and remove decimal point and negative sign
  const str = String(value).replace(/[.-]/g, '');
  return str.length;
}

/**
 * Enforce 20-digit maximum for numeric input
 * Returns false if value exceeds 20 digits, true otherwise
 * This can be used to prevent input in onChange handlers
 */
export function isWithinMaxDigits(value, maxDigits = 20) {
  if (value === '' || value === null || value === undefined) {
    return true;
  }
  
  // Remove spaces and convert to string
  const str = String(value).trim();
  
  // Extract just the digits (remove decimal point and minus sign)
  const digitsOnly = str.replace(/[^0-9]/g, '');
  
  return digitsOnly.length <= maxDigits;
}

/**
 * Validate quantity field
 * - Must be a valid positive number
 * - Must not exceed 20 digits
 */
export function validateQuantity(quantity) {
  const num = parseFloat(quantity);
  if (isNaN(num)) {
    return 'Quantity must be a valid number';
  }
  if (num <= 0) {
    return 'Quantity must be greater than 0';
  }
  if (countDigits(num) > 20) {
    return 'Quantity must not exceed 20 digits';
  }
  return '';
}

/**
 * Validate unit price field
 * - Must be a valid non-negative number
 * - Must not exceed 20 digits
 */
export function validateUnitPrice(unitPrice) {
  const num = parseFloat(unitPrice);
  if (isNaN(num)) {
    return 'Unit price must be a valid number';
  }
  if (num < 0) {
    return 'Unit price cannot be negative';
  }
  if (countDigits(num) > 20) {
    return 'Unit price must not exceed 20 digits';
  }
  return '';
}

/**
 * Validate tax percentage field
 */
export function validateTaxPercentage(value) {
  if (value === '' || value === null || value === undefined) {
    return ''; // Tax is optional
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Tax percentage must be a valid number';
  }
  if (num < 0) {
    return 'Tax percentage cannot be negative';
  }
  if (num > 100) {
    return 'Tax percentage cannot exceed 100';
  }
  return '';
}

/**
 * Validate discount field
 */
export function validateDiscount(value) {
  if (value === '' || value === null || value === undefined) {
    return ''; // Discount is optional
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Discount must be a valid number';
  }
  if (num < 0) {
    return 'Discount cannot be negative';
  }
  if (countDigits(num) > 50) {
    return 'Discount must not exceed 50 digits';
  }
  return '';
}

/**
 * Validate a single line item
 */
export function validateLineItem(item) {
  const errors = {};

  const descError = validateItemDescription(item.description);
  if (descError) errors.description = descError;

  const qtyError = validateQuantity(item.quantity);
  if (qtyError) errors.quantity = qtyError;

  const priceError = validateUnitPrice(item.unitPrice);
  if (priceError) errors.unitPrice = priceError;

  return errors;
}

/**
 * Validate header fields
 */
export function validateHeaderFields(clientName, invoiceNumber, invoiceDate) {
  const errors = {};

  const nameError = validateClientName(clientName);
  if (nameError) errors.clientName = nameError;

  const numError = validateInvoiceNumber(invoiceNumber);
  if (numError) errors.invoiceNumber = numError;

  const dateError = validateInvoiceDateField(invoiceDate);
  if (dateError) errors.invoiceDate = dateError;

  return errors;
}

/**
 * Validate the entire invoice before submission
 */
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
    const itemErrors = invoice.items
      .map((item, index) => ({
        index,
        errors: validateLineItem(item)
      }))
      .filter(result => Object.keys(result.errors).length > 0);

    if (itemErrors.length > 0) {
      errors.itemErrors = itemErrors;
    }
  }

  // Validate tax percentage
  const taxError = validateTaxPercentage(invoice.taxPercentage);
  if (taxError) {
    errors.taxPercentage = taxError;
  }

  // Validate discount
  const discountError = validateDiscount(invoice.discount);
  if (discountError) {
    errors.discount = discountError;
  }

  return errors;
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
