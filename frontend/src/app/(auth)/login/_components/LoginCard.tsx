"use client'"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/store/authStore";

export function LoginCard() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const login = useAuthStore((s) => s.login)
    const router = useRouter()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleLogin = async () => {
        setError("")
        setIsLoading(true)
        try {
            await login(username, password)
            router.push("/catalog")
        } catch (e: any) {
            setError(e?.response?.data?.detail || "Invalid username or password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen flex items-center justify-center  bg-gray-100">
            <div className="flex flex-col w-full max-w-md p-8 border-2 border-gray-600 rounded-lg shadow-lg">

                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome Back!
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Please login to continue
                    </p>
                </div>

                <FieldGroup className="-space-y-1">
                    <Field>
                        <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                    </Field>

                    <Field>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="pr-10"
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            />

                            {!showPassword ? (
                                <EyeOff
                                    size={18}
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                                />
                            ) : (
                                <Eye
                                    size={18}
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                                />
                            )}
                        </div>
                    </Field>

                    <Button className="w-full p-5" type="submit" onClick={handleLogin}>
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </FieldGroup>
            </div>
        </div>
    )
}