import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', style, children, ...props }, ref) => {
    const baseStyles: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: 500,
      borderRadius: '8px',
      transition: 'all 0.15s ease',
      cursor: 'pointer',
      border: 'none',
    };

    const variants: Record<string, CSSProperties> = {
      primary: {
        backgroundColor: '#3b82f6',
        color: 'white',
      },
      secondary: {
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: '1px solid #e5e7eb',
      },
      danger: {
        backgroundColor: '#ef4444',
        color: 'white',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#4b5563',
      },
    };

    const sizes: Record<string, CSSProperties> = {
      sm: { padding: '8px 12px', fontSize: '14px', minHeight: '40px' },
      md: { padding: '12px 20px', fontSize: '14px', minHeight: '48px' },
      lg: { padding: '14px 24px', fontSize: '16px', minHeight: '52px' },
    };

    const combinedStyle: CSSProperties = {
      ...baseStyles,
      ...variants[variant],
      ...sizes[size],
      ...style,
    };

    return (
      <button
        ref={ref}
        className={className}
        style={combinedStyle}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
