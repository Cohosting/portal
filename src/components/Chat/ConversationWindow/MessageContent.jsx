import React, { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const MessageContent = ({
    isEditing,
    content,
    handleCancelEdit,
    handleUpdateEdit,
    id,colorSettings
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editedContent, setEditedContent] = useState(content);
    const {loginButtonColor, loginButtonTextColor} = colorSettings || {};

    useEffect(() => {
        setEditedContent(content);
    }, [content]);


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

let inlineStyles = {};

if (loginButtonColor) {
  inlineStyles.backgroundColor = loginButtonColor;
}

if (loginButtonTextColor) {
  inlineStyles.color = loginButtonTextColor;
}

// If no colors provided, set defaults
if (!loginButtonColor) {
  inlineStyles.backgroundColor = '#000000'; // black
}

if (!loginButtonTextColor) {
  inlineStyles.color = '#ffffff'; // white
}

    
     return (
        <>
            {isEditing ? (
                <div className="flex flex-col">
                    <Textarea
                        className="w-full p-2 text-sm leading-6   border rounded"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={3}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    <div className="self-end mt-2 flex gap-2">
                        <Button onClick={onCancelEdit} variant={'ghost'}>
                            Cancel
                        </Button>
                        <Button  style={inlineStyles} onClick={onUpdateEdit}>
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-sm leading-6 text-gray-500">{editedContent}</p>
            )}

        </>
    )
}

export default MessageContent