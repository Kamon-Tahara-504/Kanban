import type { Category } from "../types";
import "./Sidebar.css";

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  onManageCategories?: () => void;
  onOpenThemeSettings?: () => void;
}

export const Sidebar = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onManageCategories,
  onOpenThemeSettings,
}: SidebarProps) => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`sidebar-item ${
              selectedCategoryId === category.id ? "active" : ""
            }`}
            onClick={() => onSelectCategory(category.id)}
            style={{
              color: selectedCategoryId === category.id ? category.color : undefined,
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="sidebar-footer">
        {onManageCategories && (
          <button className="sidebar-manage-btn" onClick={onManageCategories}>
            カテゴリーを管理
          </button>
        )}
        {onOpenThemeSettings && (
          <button
            className="sidebar-settings-btn"
            onClick={onOpenThemeSettings}
          >
            背景テーマ設定
          </button>
        )}
      </div>
    </div>
  );
};

