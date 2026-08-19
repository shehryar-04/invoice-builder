# Invoice Generator - Validation Test Plan

## Overview
This document outlines all validation requirements and test cases for the updated invoice generator.

## Modified Files
1. **src/utils/validation.js** - Core validation functions
2. **src/components/InvoiceEditor.jsx** - Real-time validation state management
3. **src/components/InvoiceHeader.jsx** - Header fields with maxLength and min date
4. **src/components/LineItemRow.jsx** - Item fields with maxLength

## Validation Rules

### Client Name Field
- **Requirement**: Required, max 100 characters
- **HTML Constraint**: `maxLength="100"`
- **Validator Function**: `validateClientName()`
- **Real-time**: Yes - errors clear immediately when valid

### Invoice Number Field
- **Requirement**: Auto-generated, max 50 characters
- **HTML Constraint**: `maxLength="50"`, readOnly
- **Validator Function**: `validateInvoiceNumber()`
- **Note**: Read-only field, validated during submission only

### Invoice Date Field
- **Requirement**: Required, within 100 years range (50 years before to 50 years after today)
- **HTML Constraint**: `min` and `max` attributes set dynamically (50 years before/after today), cursor styled as pointer, opening date selector when clicking anywhere on the input field
- **Validator Function**: `validateInvoiceDateField()`
- **Calculation**: `minDate` = `today.getFullYear() - 50`, `maxDate` = `today.getFullYear() + 50`
- **Real-time**: Yes - errors clear immediately when valid

### Item Description
- **Requirement**: Required, max 500 characters
- **HTML Constraint**: `maxLength="500"`
- **Validator Function**: `validateItemDescription()`
- **Real-time**: Yes - errors clear immediately when valid

### Quantity
- **Requirement**: Valid positive number (must be > 0)
- **Validator Function**: `validateQuantity()`
- **Real-time**: Yes - errors clear immediately when valid

### Unit Price
- **Requirement**: Valid non-negative number (must be >= 0)
- **Validator Function**: `validateUnitPrice()`
- **Real-time**: Yes - errors clear immediately when valid

### Tax Percentage
- **Requirement**: Optional, must be between 0 and 100
- **HTML Constraint**: `min="0"`, `max="100"`
- **Validator Function**: `validateTaxPercentage()`
- **Real-time**: Yes - errors clear immediately when valid

### Discount
- **Requirement**: Optional, must be non-negative, cannot exceed 50 digits
- **HTML Constraint**: `min="0"`
- **Validator Function**: `validateDiscount()`
- **Real-time**: Yes - errors clear immediately when valid

---

## Test Cases

### 1. Client Name Validation

#### Test 1.1: Empty Client Name
- **Steps**: 
  1. Leave client name empty
  2. Click "Save Invoice"
- **Expected**: Error: "Client name is required"
- **After Fix**: Type valid name (1+ chars)
- **Expected**: Error disappears immediately

#### Test 1.2: Client Name Exceeds 100 Characters
- **Steps**:
  1. Enter 101+ characters in client name
  2. Click "Save Invoice"
- **Expected**: Error: "Client name must not exceed 100 characters"
- **After Fix**: Delete characters to get 100 or less
- **Expected**: Error disappears immediately

#### Test 1.3: Valid Client Name
- **Steps**:
  1. Enter valid name (1-100 characters)
  2. Fill other required fields
  3. Click "Save Invoice"
- **Expected**: No error, invoice can be saved

---

### 2. Invoice Date Validation

#### Test 2.1: Empty Invoice Date
- **Steps**:
  1. Leave invoice date empty
  2. Click "Save Invoice"
- **Expected**: Error: "Invoice date is required"

#### Test 2.2: Date Older Than 50 Years
- **Current Date**: 2026-08-18
- **Test Date**: 1976-08-17 (more than 50 years old)
- **Steps**:
  1. Enter date older than 50 years
  2. Click "Save Invoice"
- **Expected**: Error: "Invoice date must be within 50 years before or after today"

#### Test 2.3: Date Exactly 50 Years Ago
- **Current Date**: 2026-08-18
- **Test Date**: 1976-08-18 (exactly 50 years old)
- **Steps**:
  1. Enter date exactly 50 years ago
  2. Click "Save Invoice"
- **Expected**: Accepted (no error)

#### Test 2.4: Date Newer Than 50 Years Ago / Recent Date
- **Current Date**: 2026-08-18
- **Test Date**: 2000-01-01 (within 50 years ago)
- **Steps**:
  1. Enter valid recent date
  2. Click "Save Invoice"
- **Expected**: Accepted (no error)

#### Test 2.5: Date in Future (Within 50 Years)
- **Current Date**: 2026-08-18
- **Test Date**: 2030-01-01 (within 50 years future)
- **Steps**:
  1. Enter future date within 50 years
  2. Click "Save Invoice"
- **Expected**: Accepted (no error)

#### Test 2.6: Date in Future (More Than 50 Years)
- **Current Date**: 2026-08-18
- **Test Date**: 2080-01-01 (more than 50 years future)
- **Steps**:
  1. Try to enter date more than 50 years in future
  2. Click "Save Invoice"
- **Expected**: Error: "Invoice date must be within 50 years before or after today"

#### Test 2.7: Real-time Date Validation
- **Steps**:
  1. Select invalid date (> 50 years old)
  2. Observe error displayed
  3. Select valid date
  4. Observe error disappears immediately
- **Expected**: Error clears without clicking Save

---

### 3. Item Description Validation

#### Test 3.1: Empty Description
- **Steps**:
  1. Leave description empty in line item
  2. Click "Save Invoice"
- **Expected**: Error: "Description is required" for that item
- **After Fix**: Type description
- **Expected**: Error disappears immediately

#### Test 3.2: Description Exceeds 500 Characters
- **Steps**:
  1. Enter 501+ characters in description
  2. Click "Save Invoice"
- **Expected**: Error: "Description must not exceed 500 characters"
  
#### Test 3.3: Valid Description
- **Steps**:
  1. Enter valid description (1-500 characters)
  2. Fill other required fields
  3. Click "Save Invoice"
- **Expected**: Item accepted, no error

---

### 4. Quantity Validation

#### Test 4.1: Negative Quantity
- **Steps**:
  1. Enter negative number in quantity field
  2. Click "Save Invoice"
- **Expected**: Error: "Quantity must be greater than 0"

#### Test 4.2: Zero Quantity
- **Steps**:
  1. Enter 0 in quantity field
  2. Click "Save Invoice"
- **Expected**: Error: "Quantity must be greater than 0"

#### Test 4.3: Valid Quantity
- **Steps**:
  1. Enter positive number (e.g., 5)
  2. Fill other required fields
  3. Click "Save Invoice"
- **Expected**: Item accepted, no error

---

### 5. Unit Price Validation

#### Test 5.1: Negative Unit Price
- **Steps**:
  1. Enter negative number in unit price field
  2. Click "Save Invoice"
- **Expected**: Error: "Unit price cannot be negative"

#### Test 5.2: Zero Unit Price
- **Steps**:
  1. Enter 0 in unit price field
  2. Click "Save Invoice"
- **Expected**: No error (zero is acceptable for pricing)

#### Test 5.3: Valid Unit Price
- **Steps**:
  1. Enter positive number (e.g., 100.50)
  2. Fill other required fields
  3. Click "Save Invoice"
- **Expected**: Item accepted, no error

---

### 6. Tax Percentage Validation

#### Test 6.1: Negative Tax Percentage
- **Steps**:
  1. Enter negative tax percentage
  2. Click "Save Invoice"
- **Expected**: Error: "Tax percentage cannot be negative"

#### Test 6.2: Tax Percentage > 100
- **Steps**:
  1. Enter tax percentage > 100 (e.g., 150)
  2. Click "Save Invoice"
- **Expected**: Error: "Tax percentage cannot exceed 100"

#### Test 6.3: Tax Percentage Between 0-100
- **Steps**:
  1. Enter valid tax percentage (e.g., 10)
  2. Fill other required fields
  3. Click "Save Invoice"
- **Expected**: Accepted, no error

#### Test 6.4: Empty Tax (Optional)
- **Steps**:
  1. Leave tax percentage empty
  2. Fill other required fields
  3. Click "Save Invoice"
- **Expected**: Accepted (tax is optional, defaults to 0)

---

### 7. Discount Validation

#### Test 7.1: Negative Discount
- **Steps**:
  1. Enter negative discount
  2. Click "Save Invoice"
- **Expected**: Error: "Discount cannot be negative"

#### Test 7.2: Discount Exceeds 50 Digits
- **Steps**:
  1. Enter a discount with more than 50 digits
  2. Click "Save Invoice"
- **Expected**: Error: "Discount must not exceed 50 digits" (or input prevented)

#### Test 7.3: Discount > 100 and Within 50 Digits
- **Steps**:
  1. Enter discount > 100 (e.g., 150)
  2. Fill other required fields
  3. Click "Save Invoice"
- **Expected**: Accepted, no error

#### Test 7.4: Empty Discount (Optional)
- **Steps**:
  1. Leave discount empty
  2. Fill other required fields
  3. Click "Save Invoice"
- **Expected**: Accepted (discount is optional, defaults to 0)

---

### 8. Multiple Items with Independent Validation

#### Test 8.1: First Item Has Error, Second is Valid
- **Steps**:
  1. Add new line item
  2. Leave first item description empty
  3. Fill second item completely
  4. Click "Save Invoice"
- **Expected**: 
  - First item shows error for description
  - Second item has no errors
  - Save fails due to first item error

#### Test 8.2: Delete Item With Error
- **Steps**:
  1. Create two items, first with error
  2. Delete first item
  3. Click "Save Invoice"
- **Expected**: 
  - Error for deleted item is gone
  - Invoice saves successfully if other fields valid

#### Test 8.3: Add New Item After Errors
- **Steps**:
  1. Have validation errors in existing item
  2. Add new line item
  3. Fill new item properly
  4. Click "Save Invoice"
- **Expected**: 
  - New item starts with no errors
  - Must fix existing item errors to save

---

### 9. Real-time Error Clearing

#### Test 9.1: Error Disappears on Valid Input
- **Steps**:
  1. Leave client name empty, click Save
  2. Observe error appears
  3. Type valid name (without clicking anywhere)
  4. Observe error immediately disappears
- **Expected**: Error clears in real-time as you type

#### Test 9.2: Error Reappears on Invalid Input
- **Steps**:
  1. Enter valid client name (error gone)
  2. Delete the name, clearing field
  3. Observe error message
- **Expected**: Error reappears when field becomes invalid again

#### Test 9.3: Error Independent Per Field
- **Steps**:
  1. Leave client name empty, enter invalid date
  2. Click Save (both errors appear)
  3. Fix client name
  4. Observe only client name error clears, date error remains
- **Expected**: Only the fixed field's error disappears

---

### 10. Complete Valid Invoice Submission

#### Test 10.1: All Valid Data Submits Successfully
- **Steps**:
  1. Enter valid client name
  2. Select valid invoice date (recent, within 50 years)
  3. Enter line item with description (under 500 chars), quantity > 0, price >= 0
  4. Enter tax percentage (0-100 or empty)
  5. Enter discount (0-100 or empty)
  6. Click "Save Invoice"
- **Expected**: 
  - No validation errors appear
  - Success message shown
  - Invoice added to saved list
  - New blank invoice ready

---

## HTML Constraints Summary

| Field | maxLength | min | max | readonly |
|-------|-----------|-----|-----|----------|
| Client Name | 100 | - | - | No |
| Invoice Number | 50 | - | - | Yes |
| Invoice Date | - | Dynamic (50 years ago) | - | No |
| Description | 500 | - | - | No |
| Quantity | - | 0 | - | No |
| Unit Price | - | 0 | - | No |
| Tax % | - | 0 | 100 | No |
| Discount | - | 0 | 100 | No |

---

## Validation State Flow

```
User Input Change
    ↓
Component Handler (handleHeaderChange, handleItemsChange, handleTaxChange, etc.)
    ↓
Invoice State Updated (onInvoiceChange)
    ↓
Field-Specific Validator Called
    ↓
Error State Updated (setValidationErrors)
    ↓
Component Re-renders with/without error message
```

---

## Real-time Validation Flow

```
Field Value Changes
    ↓
Real-time Validator Runs (NOT on Submit)
    ↓
If Invalid: Error Added to State
    ↓
If Valid: Error Removed from State
    ↓
Component Re-renders Immediately
    ↓
Error Message Shown/Hidden Without User Action
```

---

## Submission Validation Flow

```
User Clicks "Save Invoice"
    ↓
validateInvoice() Called (Full Validation)
    ↓
All Errors Collected
    ↓
If Errors Exist:
    ├─ Set All Errors in State
    ├─ Display All Error Messages
    └─ Prevent Submission
    ↓
If No Errors:
    ├─ Clear Error State
    ├─ Call onSave()
    └─ Save to localStorage
```

---

## Edge Cases

1. **Very old dates**: Year 900, 1000 - should be rejected (older than 50 years)
2. **Future dates**: Any date > today - should be rejected
3. **Boundary date**: Exactly 50 years ago - should be ACCEPTED
4. **Max character fields**: Exactly 100 (name), 50 (invoice), 500 (description) - should be ACCEPTED
5. **Empty optional fields**: Tax and Discount empty - should be ACCEPTED (defaults to 0)
6. **Whitespace only**: "   " in name/description - treated as empty, REJECTED
7. **Decimal quantities**: 1.5 items - validated as valid number > 0
8. **Multiple errors same field**: Not possible (one error per field)
9. **Error clearing during input**: Should happen without submit

---

## Known Limitations

- Date validation assumes browser supports HTML5 date input
- Discount can exceed 100 but cannot exceed 50 digits (flat amount, not percentage)
- All validations happen client-side only (no server-side validation)
- No async validation (all synchronous)
