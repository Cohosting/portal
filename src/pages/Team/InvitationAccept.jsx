import React, { Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import InvitationHeader from './components/InvitationHeader';
import InvitationAuthForm from './components/InvitationAuthForm';
import { useInvitationAcceptance } from '../../hooks/useInvitationAcceptance';
import { LogOut, XCircle, CheckCircle } from 'lucide-react';





const AuthToggleButton = ({ isLogin, onToggle }) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="mt-2 w-full text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
        >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
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
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
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
                                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                                    {session?.user?.email}
                                </span>
                            </p>
                            <p className="mt-2 text-center text-sm text-gray-500">
                                Please log out to accept this invitation
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-10">
                            <button
                                onClick={() => navigate('/logout')}
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </button>
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
                                    <button
                                        type="button"
                                        onClick={clearError}
                                        className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
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
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Go to Dashboard
                                </button>
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
                        <button
                            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                        </button>
                    ) : !showAuthForm ? (
                        <button
                            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                        </button>
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