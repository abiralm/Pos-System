import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function LoginCard() {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
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
                        <Input placeholder="Username" />
                    </Field>

                    <Field>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="pr-10"
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

                    <Button className="w-full p-5">
                        Login
                    </Button>
                </FieldGroup>
            </div>
        </div>
    )
}