'use client';

import { useState } from 'react';

interface QuantitySelectorProps {
  onChange?: (quantity: number) => void;
}

const QuantitySelector = ({ onChange }: QuantitySelectorProps) => {
  const [quantity, setQuantity] = useState(1);

  const changeQuantity = (delta: number) => {
    setQuantity((prev) => {
      const next = Math.max(1, prev + delta);
      onChange?.(next);
      return next;
    });
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <button
        type="button"
        onClick={() => changeQuantity(-1)}
        style={{
          width: 40,
          height: 40,
          borderRadius: 16,
          border: '1px solid #d0d0d0',
          background: '#f3f6fb',
          cursor: 'pointer',
          fontSize: 20,
        }}
      >
        -
      </button>
      <div style={{ minWidth: 32, textAlign: 'center', fontSize: 16,width: 40, height: 40, borderRadius: 16,border: '1px solid #d0d0d0',background: '#f3f6fb', }}>
        {quantity}
      </div>
      <button
        type="button"
        onClick={() => changeQuantity(1)}
        style={{
          width: 40,
          height: 40,
          borderRadius: 16,
          border: '1px solid #d0d0d0',
          background: '#f3f6fb',
          cursor: 'pointer',
          fontSize: 20,
        }}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;