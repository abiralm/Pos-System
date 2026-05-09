import {
    Sidebar, SidebarContent, SidebarGroup,
    SidebarGroupContent, SidebarMenuItem, SidebarMenu,
    SidebarMenuButton
} from "@/components/ui/sidebar"

export function AppSidebar() {
    return (
        <Sidebar className="border-2">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="border-2 bg-amber-100">Dashboard</SidebarMenuButton>
                                <SidebarMenuButton className="border-2 bg-amber-100">Catalog</SidebarMenuButton>
                                <SidebarMenuButton className="border-2 bg-amber-100">Bills</SidebarMenuButton>
                                <SidebarMenuButton className="border-2 bg-amber-100">Settings</SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}