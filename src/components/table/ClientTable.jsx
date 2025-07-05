import React, { useState } from "react";
import {
    MoreVertical,
    Pencil,
    Trash2,
    Mail
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { formatDate } from "../../utils/dateUtils";
import { InviteForm } from '../../pages/Client/InviteForm';
import AlertDialog from '../Modal/AlertDialog';
import { supabase } from "../../lib/supabase";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { useSendEmail } from '../../hooks/useEmailApi';
import { ClientInviteSuccessModal } from '../../pages/Client/ClientInviteSuccessModal';
import { Cable } from "lucide-react";

const ClientTable = ({ clients, portal, refetch }) => {
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
      setIsEditModalOpen(false);
      setClientToEdit(null);
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
                    .update({
                      status: 'archived',
                      is_deleted: true
                    })
                    .eq('id', clientToDelete.id);

          if (error) throw error;
          await refetch();
          setIsDeleteModalOpen(false);
          toast.success('Client deleted successfully');
      } catch (error) {
          console.error("Error deleting client:", error.message);
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

    const StatusBadge = ({ status }) => {
        let bgColor = 'bg-green-100';
        let textColor = 'text-green-800';

        switch (status) {
            case 'pending':
                bgColor = 'bg-amber-100';
                textColor = 'text-amber-800';
                break;
            case 'inactive':
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
                break;
            case 'active':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                break;
            case 'restricted':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                break;
            default:
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
        }

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${bgColor} ${textColor}`}>
                {status}
            </span>
        );
    };

    const StripeConnectionBadge = ({ customerId }) => {
        const isConnected = Boolean(customerId);
        return (
            <div className="flex items-center ml-2">
                <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-xs font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                    {isConnected ? 'Connected' : 'Not Connected'}
                </span>
            </div>
        );
    };

    return (
        <>
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="sm:-mx-0">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">
                                    Name
                                </th>
                              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                                  Added at
                              </th>
                              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                                  Email
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                  Status
                              </th>
                              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                                  Stripe Connection
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                  <span className="sr-only">Actions</span>
                              </th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                          {clients.map((client) => (
                              <tr key={client.id} className="hover:bg-gray-50">
                                  <td className="w-full max-w-0 py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none">
                                      {client.name}
                          <dl className="font-normal lg:hidden">
                              <div className="flex items-center mt-1">
                                  <dt className="sr-only">Added at</dt>
                                  <dd className="text-gray-500">{formatDate(client.created_at)}</dd>
                              </div>
                              <dt className="sr-only sm:hidden">Email</dt>
                              <div className="sm:hidden mt-1">
                                  <dd className="text-gray-500">{client.email}</dd>
                              </div>
                              <div className="md:hidden mt-1">
                                  <dt className="sr-only">Stripe Connection</dt>
                         <div className="flex items-center">
                         <p className="text-md font-semibold"> Stripe:</p> <StripeConnectionBadge customerId={client.customer_id} />

                         </div>
                                  
                              </div>
                          </dl>
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                          {formatDate(client.created_at)}
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                          {client.email}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                          <StatusBadge status={client.status} />
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                       <StripeConnectionBadge customerId={client.customer_id} />
                      </td>
                      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <DropdownMenu>
                              <DropdownMenuTrigger className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                  <span className="sr-only">Open options</span>
                                  <MoreVertical className="h-5 w-5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-42 bg-white p-0">
                                {
                                   portal.stripe_connect_account_id && !client.customer_id && (
                                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0 focus:outline-none">
                                        <button
                                            onClick={() => handleDeleteClick(client)}
                                            className="w-full text-left flex items-center px-3 text-sm leading-6 text-gray-900"
                                        >
                                            <Cable className="h-5 w-5 text-green-500 mr-2" />
                                            Connect to stripe
                                        </button>
                                    </DropdownMenuItem>
                                    ) 
                                }
                        
                                 {
                                    client.status !== 'active' && (
                                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0 focus:outline-none">
                                        <button
                                            onClick={() => handleEditClick(client)}
                                            className="w-full text-left flex items-center px-3 text-sm leading-6 text-gray-900"
                                        >
                                            <Pencil className="h-5 w-5 mr-2" />
                                            Edit
                                        </button>
                                    </DropdownMenuItem>
                                    )
                                 }
   
                                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0 focus:outline-none">
                                      <button
                                          onClick={() => handleDeleteClick(client)}
                                          className="w-full text-left flex items-center px-3 text-sm leading-6 text-gray-900"
                                      >
                                          <Trash2 className="h-5 w-5 text-red-500 mr-2" />
                                          Delete
                                      </button>
                                  </DropdownMenuItem>
                                  {
                                    (client.status === 'pending' || client.status === 'restricted')  && (
                                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0 focus:outline-none">
                                        <button
                                          onClick={() => handleSendEmail(client)}
                                          className="w-full text-left flex items-center px-3 text-sm leading-6 text-gray-900"
                                        >
                                          <Mail className="h-5 w-5 text-green-500 mr-2" />
                                          Invite
                                        </button>
                                      </DropdownMenuItem>
                                    )
                                  }
 
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </td>
                  </tr>
              ))}
                      </tbody>
                  </table>
              </div>
          </div>

          <AlertDialog
              title={'Are you sure you want to delete this client?'}
              message={'This action cannot be undone.'}
              confirmButtonText={loading ? 'Deleting...' : 'Yes, delete'}
              cancelButtonText={'Cancel'}
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleDeleteConfirm}
              clientToDelete={clientToDelete}
              confirmButtonColor="bg-red-500"
          />

          <InviteForm
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onToggleSuccess={handleEditSuccess}
              setTemporaryClient={() => { }}
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