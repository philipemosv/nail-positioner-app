import { forwardRef, type InputHTMLAttributes, type CSSProperties } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, suffix, className = '', style, ...props }, ref) => {
    const containerStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    };

    const labelStyle: CSSProperties = {
      fontSize: '14px',
      color: '#4b5563',
    };

    const inputWrapperStyle: CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    };

    const inputStyle: CSSProperties = {
      width: '100%',
      padding: '12px 16px',
      paddingRight: suffix ? '56px' : '16px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      color: '#111827',
      fontSize: '14px',
      minHeight: '48px',
      outline: 'none',
      transition: 'border-color 0.15s ease',
      ...style,
    };

    const suffixStyle: CSSProperties = {
      position: 'absolute',
      right: '16px',
      color: '#9ca3af',
      fontSize: '14px',
      pointerEvents: 'none',
    };

    return (
      <div style={containerStyle}>
        {label && (
          <label style={labelStyle}>{label}</label>
        )}
        <div style={inputWrapperStyle}>
          <input
            ref={ref}
            className={className}
            style={inputStyle}
            {...props}
          />
          {suffix && (
            <span style={suffixStyle}>
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
