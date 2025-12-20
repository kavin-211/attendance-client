import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};

  &:hover {
    ${props => props.onClick && `
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `}
  }
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
`;

const Footer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.875rem;
  color: #64748b;
`;

const Card = ({ title, value, footer, onClick, children }) => {
  return (
    <CardContainer onClick={onClick}>
      {children ? (
        children
      ) : (
        <>
          <Title>{title}</Title>
          <Value>{value}</Value>
          {footer && <Footer>{footer}</Footer>}
        </>
      )}
    </CardContainer>
  );
};

export default Card;
