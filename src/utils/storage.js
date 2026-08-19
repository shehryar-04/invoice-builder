/**
 * Storage utilities for managing invoices in localStorage
 */

const STORAGE_KEY = 'invoice_builder_invoices';

export function generateInvoiceId() {
  // Use crypto.randomUUID if available, otherwise use a fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for browsers that don't support crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateLineItemId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateInvoiceNumber() {
  // Get the next invoice number based on existing invoices
  const invoices = getAllInvoices();
  
  // Extract numbers from existing invoice numbers (e.g., "INV-001" -> 1)
  const numbers = invoices
    .map(inv => {
      const match = inv.invoiceNumber.match(/INV-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => num > 0);
  
  // Get the maximum number and add 1
  const nextNumber = (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;
  
  // Format as INV-001, INV-002, etc.
  return `INV-${String(nextNumber).padStart(3, '0')}`;
}

export function createNewInvoice() {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    id: generateInvoiceId(),
    clientName: '',
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: today,
    items: [
      {
        id: generateLineItemId(),
        description: '',
        quantity: 1,
        unitPrice: 0
      }
    ],
    taxPercentage: 0,
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function getAllInvoices() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading invoices from storage:', error);
    return [];
  }
}

export function saveInvoice(invoice) {
  try {
    // Convert all input text strings to string using .toString() before saving
    const sanitizedInvoice = {
      ...invoice,
      id: invoice.id ? String(invoice.id).toString() : '',
      clientName: invoice.clientName ? String(invoice.clientName).toString() : '',
      invoiceNumber: invoice.invoiceNumber ? String(invoice.invoiceNumber).toString() : '',
      invoiceDate: invoice.invoiceDate ? String(invoice.invoiceDate).toString() : '',
      items: (invoice.items || []).map(item => ({
        ...item,
        id: item.id ? String(item.id).toString() : '',
        description: item.description ? String(item.description).toString() : ''
      }))
    };

    const invoices = getAllInvoices();
    const existingIndex = invoices.findIndex(inv => inv.id === sanitizedInvoice.id);

    if (existingIndex >= 0) {
      invoices[existingIndex] = {
        ...sanitizedInvoice,
        updatedAt: new Date().toISOString()
      };
    } else {
      invoices.push({
        ...sanitizedInvoice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    return true;
  } catch (error) {
    console.error('Error saving invoice to storage:', error);
    return false;
  }
}

export function getInvoiceById(id) {
  try {
    const invoices = getAllInvoices();
    return invoices.find(inv => inv.id === id) || null;
  } catch (error) {
    console.error('Error retrieving invoice from storage:', error);
    return null;
  }
}

export function deleteInvoice(id) {
  try {
    const invoices = getAllInvoices();
    const filtered = invoices.filter(inv => inv.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting invoice from storage:', error);
    return false;
  }
}

export function searchInvoicesByClientName(searchTerm) {
  try {
    const invoices = getAllInvoices();
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    return invoices.filter(invoice =>
      invoice.clientName.toLowerCase().includes(normalizedSearch)
    );
  } catch (error) {
    console.error('Error searching invoices:', error);
    return [];
  }
}
