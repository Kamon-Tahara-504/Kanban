import { useState, useMemo, useEffect } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { KanbanBoard } from "./components/KanbanBoard";
import { TaskForm } from "./components/TaskForm";
import { CategoryManager } from "./components/CategoryManager";
import { StatusManager } from "./components/StatusManager";
import { ThemeSettings } from "./components/ThemeSettings";
import {
  useCategories,
  useStatuses,
  useTasks,
  useTheme,
} from "./hooks/useLocalStorage";
import type { Task } from "./types";

function App() {
    const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
    const { statuses, addStatus, updateStatus, deleteStatus, reorderStatuses } = useStatuses();
    const { tasks, addTask, updateTask, deleteTask } = useTasks();
    const { theme, updateTheme, resetTheme } = useTheme();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [showStatusManager, setShowStatusManager] = useState(false);
    const [showThemeSettings, setShowThemeSettings] = useState(false);

    // カテゴリーが変更されたら、選択中のカテゴリーが存在するか確認
    useEffect(() => {
        if (categories.length > 0) {
            if (!selectedCategoryId || !categories.find((c) => c.id === selectedCategoryId)) {
                // 選択中のカテゴリーが存在しない場合、最初のカテゴリーを選択
                setSelectedCategoryId(categories[0].id);
            }
        } else {
            setSelectedCategoryId(null);
        }
    }, [categories, selectedCategoryId]);

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

    const handleTaskMove = (taskId: string, newStatusId: string) => {
        updateTask(taskId, { statusId: newStatusId });
    };

    const handleDeleteCategory = (categoryId: string) => {
        // カテゴリーに関連するタスクを削除
        const relatedTasks = tasks.filter((task) => task.categoryId === categoryId);
        relatedTasks.forEach((task) => deleteTask(task.id));
        deleteCategory(categoryId);
    };

    const handleDeleteStatus = (statusId: string) => {
        // ステータスに関連するタスクを削除
        const relatedTasks = tasks.filter((task) => task.statusId === statusId);
        relatedTasks.forEach((task) => deleteTask(task.id));
        deleteStatus(statusId);
    };

    const getCategoryTaskCount = (categoryId: string) => {
        return tasks.filter((task) => task.categoryId === categoryId).length;
    };

    const getStatusTaskCount = (statusId: string) => {
        return tasks.filter((task) => task.statusId === statusId).length;
    };

    return (
        <div className="app-container">
            <Sidebar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                onManageCategories={() => setShowCategoryManager(true)}
                onOpenThemeSettings={() => setShowThemeSettings(true)}
            />
            <div className="main-content">
                <div className="main-header">
                    <button className="add-task-btn" onClick={handleAddTask}>
                        + タスクを追加
                    </button>
                    <button
                        className="manage-status-btn"
                        onClick={() => setShowStatusManager(true)}
                    >
                        ステータスを管理
                    </button>
                </div>
                <KanbanBoard
                    statuses={statuses}
                    tasks={filteredTasks}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onTaskMove={handleTaskMove}
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
            {showCategoryManager && (
                <CategoryManager
                    categories={categories}
                    taskCount={getCategoryTaskCount}
                    onAdd={addCategory}
                    onUpdate={updateCategory}
                    onDelete={handleDeleteCategory}
                    onClose={() => setShowCategoryManager(false)}
                />
            )}
            {showStatusManager && (
                <StatusManager
                    statuses={statuses}
                    taskCount={getStatusTaskCount}
                    onAdd={addStatus}
                    onUpdate={updateStatus}
                    onDelete={handleDeleteStatus}
                    onReorder={reorderStatuses}
                    onClose={() => setShowStatusManager(false)}
                />
            )}
            {showThemeSettings && (
                <ThemeSettings
                    theme={theme}
                    onUpdate={updateTheme}
                    onReset={resetTheme}
                    onClose={() => setShowThemeSettings(false)}
                />
            )}
        </div>
    );
}

export default App;
