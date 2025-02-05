import React from 'react';
import { Dialog, DialogBackdrop, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
const MediaModal = ({ isOpen, onClose, mediaType, mediaUrl }) => {

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-[100] overflow-y-auto"
                onClose={onClose}
            >
                <div className="min-h-screen px-4 text-center">
                    <DialogBackdrop className="fixed inset-0 bg-black opacity-75" />
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <button
                            type="button"
                            className="absolute z-10 top-4 right-4 p-1 bg-white rounded-full shadow-lg"
                            onClick={onClose}
                        >
                            <XMarkIcon className="h-6 w-6 text-gray-600" />
                        </button>
                        <div className="w-full h-[80vh] flex items-center justify-center">
                            {mediaType === 'image' && (
                                <img
                                    src={mediaUrl}
                                    alt="Expanded"
                                    className="max-w-full max-h-full object-contain"
                                />
                            )}
                            {mediaType === 'video' && (
                                <video
                                    controls
                                    src={mediaUrl}
                                    className="max-w-full max-h-full object-contain"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            {mediaType === 'pdf' && (
                                <iframe
                                    src={mediaUrl}
                                    title="PDF Viewer"
                                    className="w-full h-full"
                                >
                                    This browser does not support PDFs. Please download the PDF to view it.
                                </iframe>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default MediaModal