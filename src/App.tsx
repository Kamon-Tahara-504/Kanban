import { useState } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { KanbanBoard } from "./components/KanbanBoard";
import { useCategories } from "./hooks/useLocalStorage";
import { useStatuses } from "./hooks/useLocalStorage";

function App() {
    const { categories } = useCategories();
    const { statuses } = useStatuses();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
        categories.length > 0 ? categories[0].id : null
    );

    return (
        <div className="app-container">
            <Sidebar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
            />
            <KanbanBoard statuses={statuses} />
        </div>
    );
}

export default App;
