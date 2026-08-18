import React, { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import { calculateInvoiceTotals } from '../utils/calculations';

export default function SavedInvoices({
  invoices,
  onSelectInvoice,
  onDeleteInvoice,
  onCreateNew
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = useMemo(() => {
    if (!searchTerm.trim()) {
      return invoices;
    }
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return invoices.filter(invoice =>
      invoice.clientName.toLowerCase().includes(normalizedSearch)
    );
  }, [invoices, searchTerm]);

  const handleRowClick = (invoice) => {
    onSelectInvoice(invoice);
  };

  const handleDelete = (e, invoiceId) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this invoice?')) {
      onDeleteInvoice(invoiceId);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="saved-invoices">
      <div className="saved-invoices-header">
        <h2>Saved Invoices</h2>
        <button onClick={onCreateNew} className="btn-new-invoice">
          + New Invoice
        </button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search by client name..."
      />

      {invoices.length === 0 ? (
        <div className="empty-state">
          <h3>No invoices yet</h3>
          <p>Create your first invoice to get started.</p>
          <button onClick={onCreateNew} className="btn-primary">
            Create Invoice
          </button>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="empty-state">
          <h3>No invoices found</h3>
          <p>No invoices match "{searchTerm}".</p>
        </div>
      ) : (
        <div className="invoices-table-wrapper">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Grand Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const { grandTotal } = calculateInvoiceTotals(invoice);
                return (
                  <tr
                    key={invoice.id}
                    onClick={() => handleRowClick(invoice)}
                    className="invoice-row"
                  >
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.clientName}</td>
                    <td>{formatDate(invoice.invoiceDate)}</td>
                    <td className="text-right">
                      {formatCurrency(grandTotal)}
                    </td>
                    <td className="actions">
                      <button
                        onClick={(e) => handleDelete(e, invoice.id)}
                        className="btn-delete-small"
                        title="Delete invoice"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
