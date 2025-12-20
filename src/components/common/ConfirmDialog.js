import React from 'react';
import Modal from './Modal';
import Button from './Button';
import styled from 'styled-components';

const Message = styled.p`
  color: #475569;
  margin-bottom: 1.5rem;
  font-size: 1rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width="400px">
      <Message>{message}</Message>
      <Actions>
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={type} onClick={() => {
          onConfirm();
          onClose();
        }}>
          {confirmText}
        </Button>
      </Actions>
    </Modal>
  );
};

export default ConfirmDialog;
