import { useState, useEffect } from "react";
import type { Category, Status, Task, GradientTheme } from "../types";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_STATUSES,
  DEFAULT_GRADIENT_THEME,
} from "../types";

// localStorageのキー
const STORAGE_KEYS = {
  CATEGORIES: "kanban_categories",
  STATUSES: "kanban_statuses",
  TASKS: "kanban_tasks",
  THEME: "kanban_theme",
} as const;

// データの初期化
const initializeData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // デフォルト値を保存
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
};

// カテゴリー管理フック
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(() =>
    initializeData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES)
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories:", error);
    }
  }, [categories]);

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory.id;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return {
    categories,
    setCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

// ステータス管理フック
export const useStatuses = () => {
  const [statuses, setStatuses] = useState<Status[]>(() =>
    initializeData(STORAGE_KEYS.STATUSES, DEFAULT_STATUSES)
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(statuses));
    } catch (error) {
      console.error("Error saving statuses:", error);
    }
  }, [statuses]);

  const addStatus = (status: Omit<Status, "id">) => {
    const maxOrder = Math.max(...statuses.map((s) => s.order), -1);
    const newStatus: Status = {
      ...status,
      id: `status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: status.order ?? maxOrder + 1,
    };
    setStatuses((prev) => [...prev, newStatus]);
    return newStatus.id;
  };

  const updateStatus = (id: string, updates: Partial<Status>) => {
    setStatuses((prev) =>
      prev.map((status) => (status.id === id ? { ...status, ...updates } : status))
    );
  };

  const deleteStatus = (id: string) => {
    setStatuses((prev) => prev.filter((status) => status.id !== id));
  };

  const reorderStatuses = (newOrder: Status[]) => {
    const reordered = newOrder.map((status, index) => ({
      ...status,
      order: index,
    }));
    setStatuses(reordered);
  };

  // 順序でソートされたステータスを取得
  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);

  return {
    statuses: sortedStatuses,
    setStatuses,
    addStatus,
    updateStatus,
    deleteStatus,
    reorderStatuses,
  };
};

// タスク管理フック
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() =>
    initializeData(STORAGE_KEYS.TASKS, [])
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }, [tasks]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask.id;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // カテゴリーIDでフィルタリング
  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter((task) => task.categoryId === categoryId);
  };

  // ステータスIDでフィルタリング
  const getTasksByStatus = (statusId: string) => {
    return tasks.filter((task) => task.statusId === statusId);
  };

  // カテゴリーとステータスでフィルタリング
  const getTasksByCategoryAndStatus = (categoryId: string, statusId: string) => {
    return tasks.filter(
      (task) => task.categoryId === categoryId && task.statusId === statusId
    );
  };

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByCategory,
    getTasksByStatus,
    getTasksByCategoryAndStatus,
  };
};

// テーマ管理フック
export const useTheme = () => {
  const [theme, setTheme] = useState<GradientTheme>(() =>
    initializeData(STORAGE_KEYS.THEME, DEFAULT_GRADIENT_THEME)
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }, [theme]);

  const updateTheme = (updates: Partial<GradientTheme>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setTheme(DEFAULT_GRADIENT_THEME);
  };

  // グラデーションCSS文字列を生成
  const getGradientCSS = () => {
    return `linear-gradient(${theme.angle}deg, ${theme.color1} 0%, ${theme.color2} 50%, ${theme.color3} 100%)`;
  };

  return {
    theme,
    setTheme,
    updateTheme,
    resetTheme,
    getGradientCSS,
  };
};

