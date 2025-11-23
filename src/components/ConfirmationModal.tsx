'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';

type ConfirmationModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  isLoading?: boolean;
};

export const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  isLoading = false,
}: ConfirmationModalProps) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <div className="space-y-4 p-4">
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <p>{content}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={handleCancel} isDisabled={isLoading}>
              {cancelText}
            </Button>
            <Button color={confirmColor} onPress={onConfirm} isLoading={isLoading}>
              {confirmText}
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
};
