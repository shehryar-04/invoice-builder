import { formatDateForInput } from '../utils/validation';

export default function InvoiceHeader({ invoice, onHeaderChange, errors }) {
  const handleChange = (field, value) => {
    onHeaderChange(field, value);
  };

  // Calculate minimum and maximum allowed date (50 years ago and 50 years in the future from today)
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 50, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() + 50, today.getMonth(), today.getDate());
  const minDateString = formatDateForInput(minDate);
  const maxDateString = formatDateForInput(maxDate);

  return (
    <div className="invoice-header">
      <h2>Invoice Details</h2>
      <div className="header-grid">
        <div className="form-group">
          <label htmlFor="clientName">Client Name *</label>
          <input
            id="clientName"
            type="text"
            value={invoice.clientName}
            onChange={(e) => handleChange('clientName', e.target.value)}
            placeholder="Enter client name"
            maxLength="100"
            className={errors?.clientName ? 'input-error' : ''}
          />
          {errors?.clientName && (
            <span className="error-message">{errors.clientName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="invoiceNumber">Invoice Number</label>
          <input
            id="invoiceNumber"
            type="text"
            value={invoice.invoiceNumber}
            readOnly
            maxLength="50"
            className="invoice-number-readonly"
          />
          <small style={{ color: '#999', fontSize: '0.85rem' }}>Auto-generated</small>
        </div>

        <div className="form-group">
          <label htmlFor="invoiceDate">Invoice Date *</label>
          <input
            id="invoiceDate"
            type="date"
            value={invoice.invoiceDate}
            onChange={(e) => handleChange('invoiceDate', e.target.value)}
            min={minDateString}
            max={maxDateString}
            onClick={(e) => {
              if (typeof e.target.showPicker === 'function') {
                try {
                  e.target.showPicker();
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            onFocus={(e) => {
              if (typeof e.target.showPicker === 'function') {
                try {
                  e.target.showPicker();
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            style={{ cursor: 'pointer' }}
            className={errors?.invoiceDate ? 'input-error' : ''}
          />
          {errors?.invoiceDate && (
            <span className="error-message">{errors.invoiceDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}
