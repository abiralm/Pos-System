import { Button } from "@/components/ui/button"
import {
    Sidebar, SidebarContent, SidebarGroup,
    SidebarGroupContent, SidebarMenuItem, SidebarMenu,
    SidebarMenuButton,
    SidebarHeader,
    SidebarFooter
} from "@/components/ui/sidebar"
import { LogOut, ShoppingBasket, ShoppingCart } from "lucide-react"

export function AppSidebar() {
    return (
        <Sidebar className="">
            <SidebarHeader className="mt-2 mb-1 border-b-2 border-red-500">
                <div className="flex justify-between gap-4 rounded-4xl px-2 items-baseline">
                    <h1 className="text-xl font-bold">POS System</h1>
                    <ShoppingCart className="w-8" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="my-2">
                                <SidebarMenuButton className="border-2 bg-amber-100">Dashboard</SidebarMenuButton>
                                <SidebarMenuButton className="border-2 bg-amber-100">Catalog</SidebarMenuButton>
                                <SidebarMenuButton className="border-2 bg-amber-100">Bills</SidebarMenuButton>
                                <SidebarMenuButton className="border-2 bg-amber-100">Settings</SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="my-2">
                <div className="flex justify-between border-2 rounded-4xl px-4 py-2 items-center">
                    Log Out
                    <Button className="p-2" type="submit" asChild>
                        <LogOut className="w-8" />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}