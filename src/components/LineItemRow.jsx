import React from 'react';
import { calculateLineTotal } from '../utils/calculations';

export default function LineItemRow({
  item,
  onUpdate,
  onDelete,
  errors,
  isEditing,
  onEditToggle
}) {
  const handleChange = (field, value) => {
    let numValue = value;
    if (field === 'quantity' || field === 'unitPrice') {
      numValue = value === '' ? 0 : Math.max(0, parseFloat(value) || 0);
    }
    onUpdate({ ...item, [field]: numValue });
  };

  const lineTotal = calculateLineTotal(item.quantity, item.unitPrice);

  return (
    <tr className={errors && Object.keys(errors).length > 0 ? 'row-with-errors' : ''}>
      <td>
        <input
          type="text"
          value={item.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description"
          className={errors?.description ? 'input-error' : ''}
        />
        {errors?.description && (
          <div className="error-message">{errors.description}</div>
        )}
      </td>
      <td>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
          placeholder="0"
          min="0"
          step="1"
          className={errors?.quantity ? 'input-error' : ''}
        />
        {errors?.quantity && (
          <div className="error-message">{errors.quantity}</div>
        )}
      </td>
      <td>
        <input
          type="number"
          value={item.unitPrice}
          onChange={(e) => handleChange('unitPrice', e.target.value)}
          placeholder="0"
          min="0"
          step="0.01"
          className={errors?.unitPrice ? 'input-error' : ''}
        />
        {errors?.unitPrice && (
          <div className="error-message">{errors.unitPrice}</div>
        )}
      </td>
      <td className="line-total">
        {lineTotal.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </td>
      <td className="actions">
        <button
          onClick={onDelete}
          className="btn-delete"
          title="Delete line item"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
