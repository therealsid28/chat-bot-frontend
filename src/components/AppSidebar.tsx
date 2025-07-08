import {
  Bot,
  ChartNoAxesColumnIcon,
  Files,
  Home,
  Inbox,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import SidebarLogout from './SidebarLogout';

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/dashboard/home',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '/inbox',
    icon: Inbox,
  },
  {
    title: 'Documents Manager',
    url: '/fileUpload',
    icon: Files,
  },
  {
    title: 'Chatbot Tester',
    url: '/chatbot',
    icon: Bot,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: ChartNoAxesColumnIcon,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarLogout />
    </Sidebar>
  );
}
