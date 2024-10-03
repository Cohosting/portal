import { useState, Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { useSelector } from 'react-redux'
import bcrypt from 'bcryptjs'
import { usePortalData } from '../../hooks/react-query/usePortalData'
import { generateSecurePassword } from '../../utils'
import { supabase } from '../../lib/supabase'

export const ClientInviteSuccessModal = ({ isOpen, onClose, client, sendEmail, refetch }) => {
  const { currentSelectedPortal } = useSelector(state => state.auth)
  const { data: portal } = usePortalData(currentSelectedPortal)
  const [isLoading, setIsLoading] = useState(false)

  const handleInvitation = async () => {
    try {
      setIsLoading(true)
      let password = client.status === 'restricted' ? generateSecurePassword() : null;
      let newStatus = 'pending';

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        await supabase
          .from('clients')
          .update({ status: newStatus, password: hashedPassword })
          .match({ id: client.id })
      }

      const emailSubject = client.status === 'restricted' ? 'Invitation to join' : 'Reminder: Complete your registration';
      const emailContent = `
        <p>Hello ${client.name},</p>
        <p>${client.status === 'restricted' ? 'You have been invited to join our portal.' : 'This is a reminder to complete your registration.'}</p>
        <p>Please use the following credentials to log in:</p>
        <p>Email: ${client.email}</p>
        ${password ? `<p>Temporary Password: ${password}</p>` : 'For security reasons, your password is not displayed here. Check your invitation email for your password.'}
        <p>Portal URL: ${portal.portal_url}</p>
      `;

      await sendEmail(client.email, emailSubject, emailContent);

      await refetch();
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </TransitionChild>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md rounded bg-white p-6">
              <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
                {client?.status === 'restricted' ? 'Send Invitation' : 'Send Reminder'}
              </DialogTitle>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {client?.status === 'restricted'
                    ? 'Do you want to send an invitation email to the client?'
                    : 'Do you want to send a reminder email to the client?'}
                </p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  onClick={handleInvitation}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Yes, send email'}
                </button>
                <button
                  type="button"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  onClick={onClose}
          >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition >

  )
}