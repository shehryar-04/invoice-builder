import { useState, useEffect } from 'react';
import InvoiceEditor from './components/InvoiceEditor';
import SavedInvoices from './components/SavedInvoices';
import {
  createNewInvoice,
  getAllInvoices,
  saveInvoice,
  deleteInvoice
} from './utils/storage';
import './App.css';

function App() {
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  // Load invoices on mount
  useEffect(() => {
    loadInvoices();
    // Create a new invoice on app start if we don't have one
    setCurrentInvoice(createNewInvoice());
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      loadInvoices();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadInvoices = () => {
    const invoices = getAllInvoices();
    setSavedInvoices(invoices);
  };

  const handleSaveInvoice = async () => {
    setIsSaving(true);
    try {
      const success = saveInvoice(currentInvoice);
      if (success) {
        loadInvoices();
        setEditingId(currentInvoice.id);
        // Show success feedback
        alert('Invoice saved successfully!');
        // Reset to create new
        setTimeout(() => {
          setCurrentInvoice(createNewInvoice());
          setEditingId(null);
        }, 500);
      } else {
        alert('Error saving invoice. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setEditingId(invoice.id);
    setShowEditor(true);
    // Scroll to editor
    setTimeout(() => {
      const editorElement = document.querySelector('.invoice-editor');
      if (editorElement) {
        editorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDeleteInvoice = (id) => {
    const success = deleteInvoice(id);
    if (success) {
      loadInvoices();
      // If the deleted invoice was being edited, reset to new
      if (editingId === id) {
        setCurrentInvoice(createNewInvoice());
        setEditingId(null);
      }
      alert('Invoice deleted successfully!');
    } else {
      alert('Error deleting invoice. Please try again.');
    }
  };

  const handleCreateNew = () => {
    setCurrentInvoice(createNewInvoice());
    setEditingId(null);
    setShowEditor(true);
    // Scroll to editor
    setTimeout(() => {
      const editorElement = document.querySelector('.invoice-editor');
      if (editorElement) {
        editorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Invoice Builder</h1>
          <button
            onClick={handleCreateNew}
            className="btn-new-invoice-header"
          >
            + New Invoice
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="editor-section">
          {currentInvoice && (
            <InvoiceEditor
              invoice={currentInvoice}
              onInvoiceChange={setCurrentInvoice}
              onSave={handleSaveInvoice}
              editingId={editingId}
              isSaving={isSaving}
            />
          )}
        </section>

        <section className="list-section">
          <SavedInvoices
            invoices={savedInvoices}
            onSelectInvoice={handleSelectInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onCreateNew={handleCreateNew}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
