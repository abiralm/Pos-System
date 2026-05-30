import { Toggle } from "@/components/ui/toggle";

export function TaskFilters() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Toggle variant="outline" aria-label="Toggle italic">
                Food
            </Toggle>
            <Toggle variant="outline" aria-label="Toggle bold">
                Drinks
            </Toggle>
        </div>
    )
}
