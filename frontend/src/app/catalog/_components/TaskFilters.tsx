import { Toggle } from "@/components/ui/toggle";
import { categoryType } from "@/src/types/product_types";
interface TaskFiltersProps {
    categories: categoryType[];
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}

export function TaskFilters({ categories, selectedCategory, onSelectCategory }: TaskFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Toggle 
                variant="outline" 
                aria-label="Toggle All"
                pressed={selectedCategory === null}
                onPressedChange={() => onSelectCategory(null)}
            >
                All
            </Toggle>
            {categories.map((category) => (
                <Toggle 
                    key={category.id}
                    variant="outline" 
                    aria-label={`Toggle ${category.name}`}
                    pressed={selectedCategory === category.id}
                    onPressedChange={(pressed) => onSelectCategory(pressed ? category.id : null)}
                >
                    {category.name}
                </Toggle>
            ))}
        </div>
    )
}