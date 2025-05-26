import React, { useLayoutEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import AppListItem from './AppListItem';

const DragDropList = ({ list, onDragEnd, markAsDisabled, handleDeleteApp }) => {
    const sortableRef = useRef(null);
    const sortableInstance = useRef(null);

    // Use useLayoutEffect to ensure DOM is ready before trying to initialize Sortable
    useLayoutEffect(() => {
        if (!sortableRef.current || list.length === 0) return;

        // Cleanup previous instance
        if (sortableInstance.current) {
            try {
                sortableInstance.current.destroy();
            } catch (error) {
                console.error("Error destroying previous Sortable instance:", error);
            }
        }

        try {
            // Create new Sortable instance
            sortableInstance.current = Sortable.create(sortableRef.current, {
                animation: 150,
                handle: '.drag-handle',
                onEnd: (evt) => {
                    if (evt.oldIndex !== evt.newIndex) {
                        const result = {
                            source: { index: evt.oldIndex },
                            destination: { index: evt.newIndex }
                        };
                        onDragEnd(result);
                    }
                }
            });
        } catch (error) {
            console.error("Failed to initialize Sortable:", error);
        }

        // Cleanup on unmount
        return () => {
            if (sortableInstance.current) {
                try {
                    sortableInstance.current.destroy();
                } catch (error) {
                    console.error("Failed to destroy Sortable instance:", error);
                }
            }
        };
    }, [list, onDragEnd]);

    if (list.length === 0) {
        return <div className="py-4 text-center text-gray-500">No apps found</div>;
    }

    return (
        <div 
            ref={sortableRef}
            className="flex flex-col space-y-0 divide-y divide-gray-100"
        >
            {list.map((item, index) => (
                <AppListItem
                    key={item.id}
                    item={item}
                    index={index}
                    markAsDisabled={markAsDisabled}
                    handleDeleteApp={handleDeleteApp}
                />
            ))}
        </div>
    );
};

export default DragDropList;