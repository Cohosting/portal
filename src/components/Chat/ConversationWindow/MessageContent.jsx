import React, { useState, useEffect } from 'react'
import TextArea from '../../UI/TextArea'
import Button from '../../UI/Button/Button';
import { Check, Checks, Clock } from '@phosphor-icons/react';

const MessageContent = ({
    isEditing,
    content,
    isOwn,
    handleCancelEdit,
    handleUpdateEdit,
    status,
    id
}) => {
    console.log({ content })
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editedContent, setEditedContent] = useState(content);

    useEffect(() => {
        setEditedContent(content);
    }, [content]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'sent':
                return <Check className="w-4 h-4 text-gray-500" />;
            case 'delivered':
                return <Checks className="w-4 h-4 text-gray-500" />;
            case 'seen':
                return <Checks className="w-4 h-4 text-blue-500" />;
            default:
                return null;
        }
    };

    const onCancelEdit = () => {
        setEditedContent(content);
        handleCancelEdit();
    }

    const onUpdateEdit = async () => {
        setIsLoading(true);
        try {
            const updateMessage = await handleUpdateEdit(id, editedContent);
            console.log(updateMessage);

            handleCancelEdit();
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isEditing ? (
                <div className="flex flex-col">
                    <TextArea
                        className="w-full p-2 text-sm leading-6 text-gray-500 border rounded"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={3}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    <div className="self-end mt-2 flex gap-2">
                        <Button onClick={onCancelEdit} variant={'ghost'}>
                            Cancel
                        </Button>
                        <Button onClick={onUpdateEdit}>
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-sm leading-6 text-gray-500">{editedContent}</p>
            )}
            {isOwn && !isEditing && (
                <div className="self-end mt-1 flex items-center">
                    {getStatusIcon(status)}
                </div>
            )}
        </>
    )
}

export default MessageContent