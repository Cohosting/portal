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

// Maximum characters before truncation (including ellipsis)
const MAX_NAME_LENGTH = 10;

export default function PortalSwitcher() {
  const dispatch = useDispatch();
  const { currentSelectedPortal, user } = useSelector(state => state.auth);
  const { isMobile } = useSidebar();

  const portals = user?.portals || [];
  const selectedPortal = portals.find(p => p.id === currentSelectedPortal);
  if (!selectedPortal) return null;

  // Programmatic truncation
  const rawName = selectedPortal.brand_settings?.brandName || '';
  const portalName = rawName.length > MAX_NAME_LENGTH
    ? rawName.slice(0, MAX_NAME_LENGTH - 1) + '…'
    : rawName;

  const handleSelect = (portalId) => {
    if (portalId !== currentSelectedPortal) {
      dispatch(setCurrentSelectedPortal(portalId));
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full max-w-full overflow-hidden data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center gap-3 w-full overflow-hidden">
                {/* Icon */}
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Box className="size-4" />
                </div>

                {/* Truncated Portal Name */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div
                    className="text-sm font-semibold"
                    title={rawName}
                  >
                    {portalName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.default_portal === selectedPortal.id ? 'Default' : 'Enterprise'}
                  </div>
                </div>

                {/* Chevron */}
                <ChevronsUpDown className="ml-auto shrink-0" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="bg-white w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
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
                {portal.brand_settings?.brandName}
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
}
