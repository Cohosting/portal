"use client"
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSelectedPortal } from '../../store/slices/authSlice';
import { Box, ChevronsUpDown, Plus } from 'lucide-react';

// Import shadcn components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';

import { 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  useSidebar 
} from "@/components/ui/sidebar";

const PortalSwitcher = () => {
  const dispatch = useDispatch();
  const { currentSelectedPortal, user } = useSelector(state => state.auth);
  const { isMobile } = useSidebar();

  const handleSelect = (portalId) => {
    if (portalId !== currentSelectedPortal) {
      dispatch(setCurrentSelectedPortal(portalId));
    }
  };

  let portals = user?.portals || [];
  const selectedPortalData = portals.find(portal => portal.id === currentSelectedPortal);

  if (!selectedPortalData) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex bg-black text-white aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Box className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{selectedPortalData?.brand_settings?.brandName}</span>
                <span className="truncate text-xs">
                  {user?.default_portal === selectedPortalData?.id ? "Default" : "Enterprise"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className=" bg-white w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
            
            {portals.map((portal, index) => (
              <DropdownMenuItem 
                key={portal.id}
                onClick={() => handleSelect(portal.id)} 
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Box className="size-4 shrink-0" />
                </div>
                {portal?.brand_settings?.brandName}
                {currentSelectedPortal === portal.id && (
                  <div className="ml-auto flex h-4 w-4 items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                  </div>
                )}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default PortalSwitcher;