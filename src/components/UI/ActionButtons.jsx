import React from 'react';
import Button from './Button';

export const ActionButtons = ({
  cancelText = 'Cancel',
  updateText = 'Update',
  onCancel,
  onUpdate,
  shouldShow = true,
  isLoading,

}) => {
  if (!shouldShow) return null;

  return (
    <div className="flex justify-end items-center px-4 py-4 border-b border-gray-200">
      <Button
        onClick={onCancel}
        variant="soft"
        className="mr-3"
      >
        {cancelText}
      </Button>
      <Button
        onClick={onUpdate}
        variant="primary"
        isLoading={isLoading}
      >
        {
          isLoading ? 'Updating...' : updateText
        }
      </Button>
    </div>
  );
};
