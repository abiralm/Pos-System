import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
export function SearchBar() {
    return (
        <Field orientation="horizontal" className="w-1/3">
            <Input type="search" placeholder="Search for items" />
            <Button asChild><Search className="w-9"/></Button>
        </Field>
    )
}
