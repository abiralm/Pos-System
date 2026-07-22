"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Sidebar, SidebarContent, SidebarGroup,
    SidebarGroupContent, SidebarMenuItem, SidebarMenu,
    SidebarMenuButton,
    SidebarHeader,
    SidebarFooter
} from "@/components/ui/sidebar"
import { LogOut, ShoppingCart } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { logout } from "../services/auth_api"
import { useAuthStore } from "../store/authStore"
import { useRouter } from "next/navigation";

export function AppSidebar() {
    const logout = useAuthStore((s) => s.logout)
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await logout()
            router.push("/login")
        } catch (e: any) {
            console.log("Invalid username or password")
        }
    }
    return (
        <Sidebar className="">
            <SidebarHeader className="mt-2 mb-1 border-b-2 border-emerald-600">
                <div className="flex justify-between gap-4 rounded-4xl px-2 items-baseline">
                    <h1 className="text-xl font-bold">BasketPOS</h1>
                    <ShoppingCart className="w-8" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="my-2">
                                <SidebarMenuButton className="hover:bg-emerald-600/60" asChild><Link href="/">Dashboard</Link></SidebarMenuButton>
                                <SidebarMenuButton className="hover:bg-emerald-600/60" asChild><Link href="/catalog">Catalog</Link></SidebarMenuButton>
                                <SidebarMenuButton className="hover:bg-emerald-600/60" asChild><Link href="/orders">Orders</Link></SidebarMenuButton>
                                <SidebarMenuButton className="hover:bg-emerald-600/60" asChild><Link href="/settings">Settings</Link></SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="my-2">

                <div className="flex justify-between border-2 rounded-4xl px-4 py-2 items-center ">
                    <Avatar>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <Button className="p-2 hover:bg-emerald-600" type="submit" asChild onClick={() => handleLogout()}>
                        <LogOut className="w-8" />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}