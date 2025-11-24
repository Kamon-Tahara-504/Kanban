import { useState, useMemo } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { KanbanBoard } from "./components/KanbanBoard";
import { useCategories, useStatuses, useTasks } from "./hooks/useLocalStorage";
import { Task } from "./types";

function App() {
    const { categories } = useCategories();
    const { statuses } = useStatuses();
    const { tasks, deleteTask } = useTasks();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
        categories.length > 0 ? categories[0].id : null
    );

    // 選択されたカテゴリーのタスクのみをフィルタリング
    const filteredTasks = useMemo(() => {
        if (!selectedCategoryId) return [];
        return tasks.filter((task) => task.categoryId === selectedCategoryId);
    }, [tasks, selectedCategoryId]);

    const handleDeleteTask = (taskId: string) => {
        if (window.confirm("このタスクを削除しますか？")) {
            deleteTask(taskId);
        }
    };

    return (
        <div className="app-container">
            <Sidebar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
            />
            <KanbanBoard
                statuses={statuses}
                tasks={filteredTasks}
                onDeleteTask={handleDeleteTask}
            />
        </div>
    );
}

export default App;
