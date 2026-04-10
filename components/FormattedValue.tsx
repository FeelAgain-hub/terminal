'use client';

import React from 'react';

interface FormattedValueProps {
  value: number;
  type?: 'currency' | 'percent' | 'number';
  currency?: string;
}

export const FormattedValue: React.FC<FormattedValueProps> = ({ value, type = 'number', currency = 'USD' }) => {
  if (type === 'currency') {
    return (
      <span>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)}
      </span>
    );
  }

  if (type === 'percent') {
    return <span>{value.toFixed(1)}%</span>;
  }

  return <span>{new Intl.NumberFormat('en-US').format(value)}</span>;
};
