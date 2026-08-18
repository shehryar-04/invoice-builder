# Invoice Builder

A modern, clean, and professional invoice builder application built with React and Vite. Create, manage, and persist invoices directly in your browser with zero backend required.

## Features

- ✓ **Invoice Creation** - Create invoices with client details, invoice number, and date
- ✓ **Dynamic Line Items** - Add, edit, and delete line items with automatic calculations
- ✓ **Automatic Calculations** - Real-time calculation of line totals, subtotals, tax, and grand totals
- ✓ **Tax & Discount** - Support for percentage-based tax and fixed-amount discounts
- ✓ **Saved Invoices** - Browse and manage all saved invoices in a clean table
- ✓ **Search** - Filter invoices by client name in real-time
- ✓ **Edit Invoices** - Open any saved invoice and modify it without creating duplicates
- ✓ **Local Persistence** - All invoices stored in browser localStorage, survive page refreshes
- ✓ **Form Validation** - Comprehensive validation with clear inline error messages
- ✓ **Responsive Design** - Works great on desktop and mobile devices
- ✓ **Professional UI** - Clean, modern interface with intuitive user experience

## Tech Stack

- **React 19.2.8** - UI library
- **Vite 8.2.0** - Build tool and dev server
- **JavaScript (ES6+)** - No TypeScript, pure JavaScript
- **localStorage** - Browser-based data persistence
- **CSS3** - Modern responsive styling

## Installation

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:5174` (or another port if 5174 is busy).

## Building for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── InvoiceEditor.jsx          # Main editor form with validation
│   ├── InvoiceHeader.jsx          # Client details and invoice number fields
│   ├── LineItems.jsx              # Line items table and add row button
│   ├── LineItemRow.jsx            # Individual line item row
│   ├── InvoiceSummary.jsx         # Tax, discount, and totals display
│   ├── SavedInvoices.jsx          # List of saved invoices
│   └── SearchBar.jsx              # Search input for filtering
│
├── utils/
│   ├── calculations.js            # Calculation functions (totals, tax, etc.)
│   ├── storage.js                 # localStorage management
│   └── validation.js              # Form validation rules
│
├── App.jsx                        # Main app component
├── App.css                        # Styling for invoice builder UI
├── index.css                      # Global styles
└── main.jsx                       # React entry point
```

## Data Model

Invoices are stored with the following structure:

```javascript
{
  id: "uuid",                    // Unique identifier
  clientName: "ABC Company",     // Required field
  invoiceNumber: "INV-001",      // Required field
  invoiceDate: "2026-08-18",     // Required, ISO format date
  
  items: [
    {
      id: "uuid",
      description: "Website Development",
      quantity: 2,
      unitPrice: 50000
    }
  ],
  
  taxPercentage: 10,             // As a percentage (0-100)
  discount: 5000,                // Fixed amount, not percentage
  
  createdAt: "2026-08-18T...",   // ISO timestamp
  updatedAt: "2026-08-18T..."    // ISO timestamp
}
```

## Important Assumptions & Decisions

> These decisions were made based on the specification and represent the actual behavior of the application.

### 1. Discount is a Fixed Amount (Not a Percentage)
- The discount is applied as a **fixed monetary amount**, not a percentage
- This is clearly labeled in the UI as "Discount (amount)"
- Example: A $100,000 subtotal with a $5,000 discount results in $95,000
- This interpretation was chosen because it's more common for real invoicing systems and provides more precise control

### 2. Tax is Calculated from Subtotal (Before Discount)
- Tax is calculated on the subtotal before the discount is applied
- Formula: `taxAmount = subtotal × (taxPercentage / 100)`
- The discount is then subtracted from the total
- Formula: `grandTotal = subtotal + taxAmount - discount`
- This is the standard invoicing practice in most regions

### 3. Grand Total Cannot Be Negative
- The grand total is protected from becoming negative through validation
- If discount exceeds the subtotal + tax, the grand total is set to 0
- Both tax percentage and discount reject negative values

### 4. Calculated Totals Are Never Persisted
- Subtotal, tax amount, and grand total are **calculated dynamically** from line items
- These values are NOT stored in localStorage
- This ensures totals always reflect the current invoice state and cannot become stale
- Modification of line items or tax/discount immediately updates all totals

### 5. Browser localStorage for Persistence (No Backend)
- All invoices are stored in the browser's localStorage
- No server or database is required or used
- Invoices survive browser refreshes and page navigation
- **Limitation**: Invoices are only available in the same browser/device where they were created
- Each browser profile or device has its own separate set of invoices

### 6. Invoice IDs Are Generated Locally
- Uses `crypto.randomUUID()` when available
- Falls back to timestamp + random string for older browsers
- IDs are generated on the client side without any server communication

## Usage Workflow

### Creating an Invoice

1. The app starts with a blank invoice form
2. Enter client name, invoice number, and invoice date (date defaults to today)
3. Fill in line items:
   - Description (required)
   - Quantity (must be > 0)
   - Unit price (must be ≥ 0)
4. Line totals calculate automatically (quantity × unit price)
5. Add more line items with the "+ Add Line Item" button
6. (Optional) Set tax percentage and/or discount amount
7. Review the summary showing subtotal, tax, discount, and grand total
8. Click "Save Invoice"

### Editing an Invoice

1. Find the invoice in the "Saved Invoices" list
2. Click on the invoice row to open it
3. The button changes to "Save Changes"
4. Modify any fields as needed
5. Click "Save Changes" to update the invoice
6. The invoice is updated in place without creating a duplicate

### Searching Invoices

1. Type a client name (or part of it) in the search box
2. Results filter in real-time, case-insensitive
3. Clear the search to see all invoices again

### Creating a New Invoice

- Click "+ New Invoice" button at any time to start a fresh blank invoice
- The editor resets to default values
- Previous unsaved changes are discarded

## Validation Rules

The application validates:

- **Client Name**: Required, cannot be empty
- **Invoice Number**: Required, cannot be empty
- **Invoice Date**: Required, must be a valid date
- **Line Items**: At least one line item required
- **Description**: Each line item must have a description
- **Quantity**: Must be greater than 0
- **Unit Price**: Must be 0 or greater
- **Tax Percentage**: Cannot be negative
- **Discount**: Cannot be negative, cannot exceed subtotal + tax

All validation errors are displayed inline next to the relevant fields for immediate user feedback.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Keyboard Navigation

- Tab through form fields and buttons
- Enter to submit forms
- Focus states clearly visible

## Accessibility

- All form fields have associated labels
- Buttons have meaningful text
- Error messages are clearly marked
- Keyboard navigation fully supported
- Semantic HTML for screen reader compatibility

## Known Limitations

1. **Browser-Only Storage** - Invoices are stored only in the device's localStorage. They won't sync across different browsers or devices.

2. **Storage Capacity** - localStorage typically has a 5-10 MB limit per domain. With ~2-3 KB per invoice, this allows for hundreds of invoices per browser.

3. **No Export** - Currently no PDF export or other format export. Invoices exist only in the browser.

4. **No User Accounts** - No login system. All invoices belong to the browser/device, not a user account.

5. **No Real-Time Sync** - No synchronization between tabs. Each tab has its own copy of data (refreshing will pull fresh data from storage).

## Testing Checklist

The application has been tested for:

- ✓ Creating new invoices with all required fields
- ✓ Adding multiple line items
- ✓ Editing line item values
- ✓ Deleting line items
- ✓ Automatic calculation of line totals
- ✓ Automatic calculation of subtotal
- ✓ Tax calculation with percentage
- ✓ Discount calculation with fixed amount
- ✓ Grand total calculation
- ✓ Form validation with error messages
- ✓ Saving invoices to localStorage
- ✓ Loading invoices from localStorage after refresh
- ✓ Editing existing invoices
- ✓ Searching invoices by client name
- ✓ Empty states (no invoices, no search results)
- ✓ Responsive layout on mobile and desktop
- ✓ Invalid input prevention
- ✓ Duplicate prevention on edit

## Performance Notes

- **Instant UI Updates** - All calculations happen instantly in the browser
- **No Network Requests** - 100% offline capable (after initial load)
- **Efficient Storage** - Uses only browser localStorage, minimal bandwidth
- **Fast Search** - Client-side filtering with instant results

## Future Enhancement Ideas

(Not implemented, kept simple per requirements)

- PDF/Excel export
- Invoice templates
- Client database
- Invoice numbering schemes
- Multi-user support
- Cloud synchronization
- Tax calculation rules by region
- Digital signatures
- Payment tracking

## License

Free to use for personal and commercial projects.

## Support

For issues or questions, review the code in the `src/` directory. The structure is simple and well-organized for easy customization.
