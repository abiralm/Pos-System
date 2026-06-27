import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
}

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
    return (
        <Field orientation="horizontal" className="w-1/3">
            <Input
                type="search"
                placeholder="Search for items"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
            <Button onClick={onSearch}>
                <Search className="w-9" />
            </Button>
        </Field>
    )
}