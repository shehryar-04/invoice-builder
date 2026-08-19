import { useState, useEffect } from 'react';
import InvoiceEditor from './components/InvoiceEditor';
import SavedInvoices from './components/SavedInvoices';
import Modal from './components/Modal';
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
  const [originalInvoice, setOriginalInvoice] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Load invoices on mount
  useEffect(() => {
    loadInvoices();
    // Create a new invoice on app start if we don't have one
    setCurrentInvoice(createNewInvoice());
    setOriginalInvoice(null);
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      loadInvoices();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Open modal with message
   */
  const openModal = (title, message, type = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  /**
   * Close modal
   */
  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '', type: 'info' });
  };

  const loadInvoices = () => {
    const invoices = getAllInvoices();
    setSavedInvoices(invoices);
  };

  const handleSaveInvoice = async () => {
    // Check if there are any changes before saving an edited invoice
    if (editingId && originalInvoice) {
      const hasChanges = JSON.stringify(currentInvoice) !== JSON.stringify(originalInvoice);
      if (!hasChanges) {
        openModal('Error', "You haven't made any changes to the invoice yet.", 'error');
        return;
      }
    }

    setIsSaving(true);
    try {
      const success = saveInvoice(currentInvoice);
      if (success) {
        loadInvoices();
        setEditingId(currentInvoice.id);
        setOriginalInvoice(null);
        // Show success feedback
        openModal('Success', 'Invoice saved successfully!', 'success');
        // Reset to create new
        setTimeout(() => {
          setCurrentInvoice(createNewInvoice());
          setEditingId(null);
        }, 500);
      } else {
        openModal('Error', 'Error saving invoice. Please try again.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setEditingId(invoice.id);
    setOriginalInvoice(JSON.parse(JSON.stringify(invoice)));
    setShowEditor(true);
    // Scroll to editor
    setTimeout(() => {
      const editorElement = document.querySelector('.invoice-editor');
      if (editorElement) {
        editorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDeleteInvoice = (idOrIds) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const success = deleteInvoice(ids);
    if (success) {
      loadInvoices();
      // If the deleted invoice was being edited, reset to new
      if (ids.includes(editingId)) {
        setCurrentInvoice(createNewInvoice());
        setEditingId(null);
      }
      openModal('Success', 'Invoice(s) deleted successfully!', 'success');
    } else {
      openModal('Error', 'Error deleting invoice(s). Please try again.', 'error');
    }
  };

  const handleCreateNew = () => {
    setCurrentInvoice(createNewInvoice());
    setEditingId(null);
    setOriginalInvoice(null);
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

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;
