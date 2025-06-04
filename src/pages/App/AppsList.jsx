import React from 'react';
import { Layout } from '../Dashboard/Layout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import DragDropList from '../../components/DragDropList';
import { useApps } from '../../hooks/useApps';
import PageHeader from '@/components/internal/PageHeader';
import { Button } from '@/components/ui/button';
import BottomActionBar from '@/components/ui/BottomActionBar';
import DashboardSkeleton from '@/components/SkeletonLoading';

export const AppsList = () => {
  const navigate = useNavigate();

  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);

  const {
    list,
    setList,
    handleDeleteApp,
    handleUpdate,
    markAsDisabled,
    hasChanges,
    previousList,
    isLoading
  } = useApps(portal);

  const handleDragEnd = result => {
    if (!result.destination) return;

    const newList = Array.from(list);
    const movedItem = newList[result.source.index];
    newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);

    // Update the index property of all items
    newList.forEach((item, index) => {
      item.index = index;
    });

    setList(newList);
  };

  if (!portal) return <DashboardSkeleton />

  return (
    <Layout hideMobileNav headerName='Apps'>
      <div className="">
        <div>
          <PageHeader
            title={'Apps'}
            description={'Here you can see all the apps you have created. You can also edit or delete them.'}
            action={
              <Button
                variant="primary"
                onClick={() => navigate('new')}
                className="bg-black hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create new app
              </Button>
            }
          />
          
          <div className=' '>
            <DragDropList
              list={list}
              onDragEnd={handleDragEnd}
              handleDeleteApp={handleDeleteApp}
              markAsDisabled={markAsDisabled}
            />
          </div>
        </div>
      </div>

      {hasChanges && (
    
        <BottomActionBar
          onCancel={() => {
            setList(previousList);
          }}
          onSave={handleUpdate}
          isLoading={isLoading}
          saveText={'Save Changes'}
          cancelText={'Cancel'}
          isDisabled={!hasChanges}
        />

      )}
    </Layout>
  );
};