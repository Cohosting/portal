import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AppListItem from './AppListItem';

const DragDropList = ({ list, onDragEnd, markAsDisabled, handleDeleteApp }) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex flex-col space-y-4"
                    >
                        <div className='divide-y divide-gray-100'>

                        {list.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                    <AppListItem
                                        item={item}
                                        index={index}
                                        provided={provided}
                                        markAsDisabled={markAsDisabled}
                                        handleDeleteApp={handleDeleteApp}
                                    />

                                )}
                            </Draggable>
                        ))}
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DragDropList;