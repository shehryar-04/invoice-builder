import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import { calculateInvoiceTotals } from '../utils/calculations';

export default function SavedInvoices({
  invoices,
  onSelectInvoice,
  onDeleteInvoice,
  onCreateNew
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFields, setExpandedFields] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleExpand = (invoiceId, field) => {
    const key = `${invoiceId}-${field}`;
    setExpandedFields(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredInvoices = useMemo(() => {
    if (!searchTerm.trim()) {
      return invoices;
    }
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return invoices.filter(invoice =>
      invoice.clientName.toLowerCase().includes(normalizedSearch)
    );
  }, [invoices, searchTerm]);

  const handleRowClick = (invoiceId) => {
    setSelectedIds(prev => {
      if (prev.includes(invoiceId)) {
        return prev.filter(id => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
  };

  const handleSelectAllToggle = () => {
    if (selectedIds.length === filteredInvoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInvoices.map(inv => inv.id));
    }
  };

  const handleEditSelected = () => {
    if (selectedIds.length === 1) {
      const selectedInvoice = invoices.find(inv => inv.id === selectedIds[0]);
      if (selectedInvoice) {
        onSelectInvoice(selectedInvoice);
      }
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) {
      if (confirm(`Are you sure you want to delete the ${selectedIds.length} selected invoice(s)?`)) {
        onDeleteInvoice(selectedIds);
        setSelectedIds([]);
      }
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
      </div>

      <div className="saved-invoices-actions-toolbar">
        <button onClick={onCreateNew} className="btn-action-create">
          + Create Invoice
        </button>
        <button 
          onClick={handleEditSelected} 
          className="btn-action-edit"
          disabled={selectedIds.length !== 1}
        >
          Edit Selected
        </button>
        <button 
          onClick={handleDeleteSelected} 
          className="btn-action-delete"
          disabled={selectedIds.length === 0}
        >
          Delete Selected
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
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={filteredInvoices.length > 0 && selectedIds.length === filteredInvoices.length}
                    onChange={handleSelectAllToggle}
                  />
                </th>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const { grandTotal } = calculateInvoiceTotals(invoice);
                const isSelected = selectedIds.includes(invoice.id);
                return (
                  <tr
                    key={invoice.id}
                    onClick={() => handleRowClick(invoice.id)}
                    className={`invoice-row ${isSelected ? 'selected' : ''}`}
                  >
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowClick(invoice.id)}
                      />
                    </td>
                    <td>{invoice.invoiceNumber}</td>
                    <td className="truncate-cell">
                      {invoice.clientName.length > 25 ? (
                        <div className="tooltip-container">
                          {expandedFields[`${invoice.id}-client`] ? (
                            <span className="expanded-text">{invoice.clientName}</span>
                          ) : (
                            <span className="truncate-text">{invoice.clientName}</span>
                          )}
                          <span className="tooltip-text">Client: {invoice.clientName}</span>
                          <button
                            type="button"
                            className="btn-show-more"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(invoice.id, 'client');
                            }}
                          >
                            {expandedFields[`${invoice.id}-client`] ? 'Show Less' : 'Show More'}
                          </button>
                        </div>
                      ) : (
                        invoice.clientName
                      )}
                    </td>
                    <td>{formatDate(invoice.invoiceDate)}</td>
                    <td className="text-right">
                      {formatCurrency(grandTotal)}
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
