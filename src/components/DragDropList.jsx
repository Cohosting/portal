import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { VStack } from '@chakra-ui/react';
import AppListItem from './AppListItem';

const DragDropList = ({ list, onDragEnd, markAsDisabled, handleDeleteApp }) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
                {(provided) => (
                    <VStack
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        align="stretch"
                        spacing={4}
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
                    </VStack>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DragDropList;