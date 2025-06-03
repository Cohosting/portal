import React, { Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import InvitationHeader from './components/InvitationHeader';
import InvitationAuthForm from './components/InvitationAuthForm';
import { useInvitationAcceptance } from '../../hooks/useInvitationAcceptance';
import { LogOut, XCircle, CheckCircle } from 'lucide-react';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';





const AuthToggleButton = ({ isLogin, onToggle }) => {
    return (
        <Button
            type="button"
            onClick={onToggle}
            className="mt-2 w-full text-sm"
        >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </Button>
    );
};

const InvitationAccept = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const {
        invitationData,
        showAuthForm,
        isExistingUser,
        password,
        error,
        isValidatingToken,
        isProcessing,
        isAccepted,
        session,
        initiateInvitationAcceptance,
        handleAuthSubmit,
        setPassword,
        setShowAuthForm,
        clearError,
        isCheckingUserExistence,
        isLogin,
        toggleAuthMode
    } = useInvitationAcceptance(token);

    if (isValidatingToken || isCheckingUserExistence) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
               <Loader className="animate-spin" size={46} />
               <p className="text-center text-gray-600 mt-2">Loading...</p>
            </div>
        );
    }
    const signOut = async () => {
        await supabase.auth.signOut();
 
    }


    if (session && session.user.email !== invitationData?.email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                        <div className="px-6 py-8 sm:p-10">
                            <h2 className="text-center text-3xl font-extrabold text-gray-900">
                                Already Logged In
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                You are logged in as{' '}
                                <span className="font-medium text-black hover:text-gray-500">
                                    {session?.user?.email}
                                </span>
                            </p>
                            <p className="mt-2 text-center text-sm text-gray-500">
                                Please log out to accept this invitation
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-10">
                            <Button
                                onClick={signOut}
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <Transition
                    show={!!error}
                    as={Fragment}
                    enter="transform ease-out duration-300 transition"
                    enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                    enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                    <Button
                                        type="button"
                                        onClick={clearError}
                                        className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <XCircle className="h-5 w-5" aria-hidden="true" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>

                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <InvitationHeader
                        inviterName={invitationData?.inviter?.name}
                        teamName={invitationData?.portal?.brand_settings?.brandName}
                        isLoggedIn={!!session}
                        currentUserEmail={session?.user?.email}
                        currentUserName={invitationData?.inviter?.name}
                    />

                    {isAccepted ? (
                        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="bg-green-50 rounded-md p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800">Invitation accepted successfully!</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <Button
                                    onClick={() => navigate('/')}
                                    className="bg-black text-white hover:bg-gray-800 w-full"
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        </div>
                    ) : !invitationData ? (
                        <p className="mt-2 text-center text-sm text-red-600">
                            Invalid or expired invitation. Please check your link or contact the sender.
                        </p>
                    ) : invitationData.is_expired ? (
                        <p className="mt-2 text-center text-sm text-red-600">
                            This invite has expired or been accepted. Please contact the sender for a new invitation.
                        </p>
                    ) : session ? (
                        <Button
                        className='bg-black text-white hover:bg-gray-800 w-full'
                            onClick={initiateInvitationAcceptance}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isProcessing ? 'Processing...' : `Continue as ${session.user.name || session.user.email}`}
                        </Button>
                    ) : !showAuthForm ? (
                        <Button
                        className='bg-black text-white hover:bg-gray-800 w-full'
                            onClick={initiateInvitationAcceptance}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isProcessing ? 'Processing...' : 'Accept Invitation'}
                        </Button>
                    ) : (
                        <>
                            <InvitationAuthForm
                                invitationData={invitationData}
                                isExistingUser={isLogin}
                                email={invitationData.email}
                                password={password}
                                onPasswordChange={(e) => setPassword(e.target.value)}
                                onSubmit={handleAuthSubmit}
                                onBack={() => setShowAuthForm(false)}
                                isProcessing={isProcessing}
                            >
                                <AuthToggleButton
                                    isLogin={isLogin}
                                    onToggle={toggleAuthMode}
                                />
                            </InvitationAuthForm>
                        </>
                    )}

                    <p className="mt-6 text-center text-xs text-gray-500">
                        By accepting this invitation, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InvitationAccept;