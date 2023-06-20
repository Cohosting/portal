import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React, { useRef } from 'react';

export const DeleteTeamMember = ({
  isOpen,
  onClose,
  handleDelete,
  teamMemberName,
  isMemberDeleting,
}) => {
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Team Member
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete <strong>{teamMemberName}</strong>?
            This action cannot be undone.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={isMemberDeleting}
              colorScheme="red"
              onClick={handleDelete}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
