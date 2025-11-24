import { useState, useMemo } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { KanbanBoard } from "./components/KanbanBoard";
import { TaskForm } from "./components/TaskForm";
import { useCategories, useStatuses, useTasks } from "./hooks/useLocalStorage";
import { Task } from "./types";

function App() {
    const { categories } = useCategories();
    const { statuses } = useStatuses();
    const { tasks, addTask, updateTask, deleteTask } = useTasks();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
        categories.length > 0 ? categories[0].id : null
    );
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showTaskForm, setShowTaskForm] = useState(false);

    // 選択されたカテゴリーのタスクのみをフィルタリング
    const filteredTasks = useMemo(() => {
        if (!selectedCategoryId) return [];
        return tasks.filter((task) => task.categoryId === selectedCategoryId);
    }, [tasks, selectedCategoryId]);

    const handleAddTask = () => {
        setEditingTask(null);
        setShowTaskForm(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setShowTaskForm(true);
    };

    const handleSubmitTask = (taskData: Omit<Task, "id" | "createdAt">) => {
        if (editingTask) {
            updateTask(editingTask.id, taskData);
        } else {
            addTask(taskData);
        }
        setShowTaskForm(false);
        setEditingTask(null);
    };

    const handleDeleteTask = (taskId: string) => {
        if (window.confirm("このタスクを削除しますか？")) {
            deleteTask(taskId);
        }
    };

    const handleCancelTaskForm = () => {
        setShowTaskForm(false);
        setEditingTask(null);
    };

    return (
        <div className="app-container">
            <Sidebar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
            />
            <div className="main-content">
                <div className="main-header">
                    <button className="add-task-btn" onClick={handleAddTask}>
                        + タスクを追加
                    </button>
                </div>
                <KanbanBoard
                    statuses={statuses}
                    tasks={filteredTasks}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                />
            </div>
            {showTaskForm && (
                <TaskForm
                    task={editingTask}
                    categories={categories}
                    statuses={statuses}
                    onSubmit={handleSubmitTask}
                    onCancel={handleCancelTaskForm}
                />
            )}
        </div>
    );
}

export default App;
