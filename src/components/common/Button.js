import React from 'react';
import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => props.variant === 'primary' && css`
    background-color: var(--primary-color);
    color: white;
    &:hover:not(:disabled) {
      background-color: var(--primary-hover);
    }
  `}

  ${props => props.variant === 'secondary' && css`
    background-color: white;
    border-color: var(--border-color);
    color: var(--text-secondary);
    &:hover:not(:disabled) {
      background-color: var(--bg-primary);
      border-color: #cbd5e1;
    }
  `}

  ${props => props.variant === 'danger' && css`
    background-color: var(--danger-color);
    color: white;
    &:hover:not(:disabled) {
      background-color: #dc2626;
    }
  `}

  ${props => props.variant === 'success' && css`
    background-color: var(--success-color);
    color: white;
    &:hover:not(:disabled) {
      background-color: #059669;
    }
  `}

  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

const Button = ({ children, variant = 'primary', ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
