'use client';

import React from 'react';
import {
  SidebarFooter,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { clearAuthFromLocalStorage } from '@/api/auth';

function SidebarLogout() {
  return (
    <SidebarFooter>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" onClick={clearAuthFromLocalStorage}>
                <LogOut />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarFooter>
  );
}

export default SidebarLogout;
