'use client';

import React, { useEffect, useState } from 'react';

interface FormattedValueProps {
  value: number;
  type?: 'currency' | 'number' | 'percent';
  currency?: string;
  locale?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const FormattedValue: React.FC<FormattedValueProps> = ({
  value,
  type = 'number',
  currency = 'USD',
  locale = 'en-US',
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Fallback for SSR to prevent hydration mismatch
    if (type === 'currency') {
      return <span className={className}>{prefix}${value.toString()}{suffix}</span>;
    }
    if (type === 'percent') {
      return <span className={className}>{prefix}{value.toString()}%{suffix}</span>;
    }
    return <span className={className}>{prefix}{value.toString()}{suffix}</span>;
  }

  const formatOptions: Intl.NumberFormatOptions = {};
  if (type === 'currency') {
    formatOptions.style = 'currency';
    formatOptions.currency = currency;
  } else if (type === 'percent') {
    formatOptions.style = 'percent';
    // If value is 84.2, we want 84.2%, so we divide by 100 for Intl.NumberFormat percent style
    // but the app seems to use raw numbers for percentages in some places.
    // Let's stick to simple formatting if it's already a percentage value.
  }

  try {
    let formatted: string;
    if (type === 'percent') {
      // Custom handling for percent if it's already 0-100
      formatted = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value) + '%';
    } else {
      formatted = new Intl.NumberFormat(locale, formatOptions).format(value);
    }

    return (
      <span className={className}>
        {prefix}{formatted}{suffix}
      </span>
    );
  } catch (error) {
    console.error('Formatting error:', error);
    return <span className={className}>{prefix}{value.toString()}{suffix}</span>;
  }
};
