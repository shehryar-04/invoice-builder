import React from 'react';
import LineItemRow from './LineItemRow';
import { generateLineItemId } from '../utils/storage';

export default function LineItems({
  items,
  onItemsChange,
  errors,
  generalError
}) {
  const handleUpdateItem = (index, updatedItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onItemsChange(newItems);
  };

  const handleDeleteItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      onItemsChange(newItems);
    }
  };

  const handleAddItem = () => {
    const newItems = [...items];
    newItems.push({
      id: generateLineItemId(),
      description: '',
      quantity: 1,
      unitPrice: 0
    });
    onItemsChange(newItems);
  };

  const itemErrors = errors?.itemErrors || [];
  const errorMap = {};
  itemErrors.forEach(error => {
    errorMap[error.index] = error.errors;
  });

  return (
    <div className="line-items-section">
      <h2>Line Items</h2>
      
      {generalError && (
        <div className="error-message" style={{ marginBottom: '1rem' }}>
          {generalError}
        </div>
      )}

      <div className="line-items-table-wrapper">
        <table className="line-items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <LineItemRow
                key={item.id}
                item={item}
                onUpdate={(updatedItem) => handleUpdateItem(index, updatedItem)}
                onDelete={() => handleDeleteItem(index)}
                errors={errorMap[index] || {}}
                isEditing={true}
              />
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleAddItem}
        className="btn-add-row"
      >
        + Add Line Item
      </button>
    </div>
  );
}
