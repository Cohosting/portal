import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { formatDate } from "../../utils/dateUtils";
import { returnStyleBasedOnStatus } from './../../utils/statusStyles';
import { InviteForm } from '../../pages/Client/InviteForm';
import AlertDialog from '../Modal/AlertDialog';
import { supabase } from "../../lib/supabase";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { queryKeys } from "../../hooks/react-query/queryKeys";
import { useSendEmail } from '../../hooks/useEmailApi';
import { ClientInviteSuccessModal } from '../../pages/Client/ClientInviteSuccessModal';

const ClientTable = ({ clients, refetch }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [clientToInvite, setClientToInvite] = useState(null);
    const { sendEmail, loading: sendingEmail } = useSendEmail();

    const handleEditClick = (client) => {
        setClientToEdit(client);
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = (client) => {
        // You might want to refresh the client list here
        setIsEditModalOpen(false);
        setClientToEdit(null);

        console.log({
            client
        })

        setClientToInvite(client);
    };

    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (clientToDelete) {
            try {
                setLoading(true);
                const { error } = await supabase
                    .from('clients')
                    .delete()
                    .eq('id', clientToDelete.id);

                if (error) throw error;
                await refetch();
                setIsDeleteModalOpen(false);

                toast.success('Client deleted successfully');
            } catch (error) {
                console.error("Error deleting client:", error.message);
                // Handle error (e.g., show error message to user)
                toast.error('Error deleting client');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSendEmail = (client) => {
        setClientToInvite(client);
        setIsInviteModalOpen(true);
    };

    return (
        <>
            <div className="-mx-4 mt-4 sm:-mx-0">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                Name
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                            >
                                Added at
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                            >
                                Email
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Status
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {clients.map((client) => {
                            let formatedDate = formatDate(client?.created_at);

                            return (
                                <tr key={client.email}>
                                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                                        {client.name}
                                        <dl className="font-normal lg:hidden">
                                            <dt className="sr-only">Title</dt>
                                            <dt className="sr-only sm:hidden">Email</dt>
                                            <dd className="mt-1 truncate text-gray-500 sm:hidden">{client.email}</dd>
                                            <dd className="mt-1 truncate text-gray-700">{formatedDate}</dd>
                                        </dl>
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{formatedDate}</td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{client.email}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        <span className={`inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium ${returnStyleBasedOnStatus(client.status)}`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <Menu as="div" className="relative inline-block text-left">
                                            <div>
                                                <MenuButton className="inline-flex w-full justify-center rounded-md bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                                    <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                                                </MenuButton>
                                            </div>
                                            <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                    <MenuItem>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm`}
                                                                onClick={() => handleEditClick(client)}
                                                            >
                                                                Edit
                                                            </a>
                                                        )}
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleDeleteClick(client)}>
                                                        {({ active }) => (
                                                            <a
                                                                href=" #"
                                                                className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm`}
                                                            >
                                                                Delete
                                                            </a>
                                                        )}
                                                    </MenuItem>
                                                    {
                                                        client.status !== 'active' && (
                                                            <MenuItem onClick={() => handleSendEmail(client)}>
                                                                {({ active }) => (
                                                                    <a
                                                                        href=" #"
                                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm`}
                                                                    >
                                                                        Sent email
                                                                    </a>
                                                                )}
                                                            </MenuItem>
                                                        )

                                                    }

                                                </div>
                                            </MenuItems>
                                        </Menu>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <AlertDialog
                title={'Are you sure you want to delete this client?'}
                message={'This action cannot be undone.'}
                confirmButtonText={loading ? 'Deleting...' : 'Delete'}
                cancelButtonText={'Cancel'}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                clientToDelete={clientToDelete}
            />
            <InviteForm

                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onToggleSuccess={handleEditSuccess}
                setTemporaryClient={() => { }} // You might want to handle this differently for editing
                isEditing={true}
                clientToEdit={clientToEdit}
            />
            <ClientInviteSuccessModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                client={clientToInvite}
                sendEmail={sendEmail}
                refetch={refetch}
            />
        </>
    );
};

export default ClientTable;