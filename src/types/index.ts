// 優先度の型定義
export type Priority = 1 | 2 | 3; // 1: 低, 2: 中, 3: 高

// カテゴリーの型定義
export interface Category {
  id: string;
  name: string;
  color?: string; // オプションの色
}

// ステータスの型定義
export interface Status {
  id: string;
  name: string;
  order: number; // 表示順序
}

// タスクの型定義
export interface Task {
  id: string;
  name: string;
  priority: Priority;
  categoryId: string;
  statusId: string;
  createdAt: string; // ISO形式の日付文字列
  deadline: string | null; // ISO形式の日付文字列、null可
  content: string; // タスクの詳細内容
}

// デフォルトカテゴリー
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Personal Tasks", color: "#667eea" },
  { id: "cat-2", name: "Group Tasks", color: "#f093fb" },
  { id: "cat-3", name: "Front/Back", color: "#f093fb" },
];

// デフォルトステータス
export const DEFAULT_STATUSES: Status[] = [
  { id: "status-1", name: "未着手", order: 0 },
  { id: "status-2", name: "進行中", order: 1 },
  { id: "status-3", name: "完了", order: 2 },
];

// 優先度のラベルと色のマッピング
export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  3: { label: "高", color: "#10b981" }, // 緑色
  2: { label: "中", color: "#f59e0b" }, // オレンジ色
  1: { label: "低", color: "#6b7280" }, // グレー
};

