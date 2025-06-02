import { 
  AlertDialog as ShadcnAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '../ui/button';

const AlertDialog = ({
  isOpen,
  onClose,
  title,
  icon,
  message,
  confirmButtonText,
  cancelButtonText = 'Cancel',
  onConfirm,
  iconColor = 'text-red-600',
  iconBgColor = 'bg-red-100',
  confirmButtonColor = 'bg-red-600 hover:bg-red-500',
}) => {
  // Use useEffect to properly handle cleanup when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Reset any stacking context or focus issues when dialog closes
      setTimeout(() => {
        document.body.style.pointerEvents = '';
      }, 100);
    }
    
    // Handle Escape key press
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    // Handle outside click for mobile
    const handleOutsideClick = (e) => {
      const dialogContent = document.querySelector('.alert-dialog-content');
      if (dialogContent && !dialogContent.contains(e.target) && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);
  
  // If not open, don't render anything to avoid interfering with other UI elements
  if (!isOpen) return null;
  
  return (
    <ShadcnAlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogOverlay className="fixed inset-0 bg-black/25" onClick={onClose} />
      <AlertDialogContent 
        className=" bg-white alert-dialog-content fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-lg z-[99999]  data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-300"
      >
        <div className="absolute right-4 top-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="sm:flex sm:items-start">
          <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBgColor} sm:mx-0 sm:h-10 sm:w-10`}>
            {icon || <AlertTriangle className={`h-6 w-6 ${iconColor}`} />}
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-semibold leading-6 text-gray-900">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="  text-sm text-gray-500">
                {message}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>
        
        <AlertDialogFooter className=" ">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-base text-white shadow-sm  sm:w-auto ${confirmButtonColor}`}
          >
            {confirmButtonText}
          </Button>

        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadcnAlertDialog>
  );
};

export default AlertDialog;