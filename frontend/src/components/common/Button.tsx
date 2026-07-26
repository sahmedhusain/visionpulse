import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const getClassName = () => {
    switch (variant) {
      case 'secondary': return 'btn-secondary';
      case 'danger': return 'btn-danger';
      default: return 'btn-primary';
    }
  };

  return (
    <button
      className={`${getClassName()} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
