import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SearchBar() {
    return (
        <Field orientation="horizontal" className="w-1/3">
            <Input type="search" placeholder="Search for items" />
            <Button>Search</Button>
        </Field>
    )
}
