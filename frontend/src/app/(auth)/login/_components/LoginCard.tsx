import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginCard() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex flex-col w-full max-w-md p-8 border-2 border-red-500 rounded-lg shadow-lg">
                
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome Back!
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Please login to continue
                    </p>
                </div>

                <FieldGroup className="space-y-2">
                    <Field>
                        <Input placeholder="Username" />
                    </Field>

                    <Field>
                        <Input
                            type="password"
                            placeholder="Password"
                        />
                    </Field>

                    <Button className="w-full">
                        Login
                    </Button>
                </FieldGroup>
            </div>
        </div>
    )
}