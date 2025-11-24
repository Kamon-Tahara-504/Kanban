import { Category } from "../types";
import "./Sidebar.css";

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  onManageCategories?: () => void;
}

export const Sidebar = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onManageCategories,
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
      {onManageCategories && (
        <div className="sidebar-footer">
          <button className="sidebar-manage-btn" onClick={onManageCategories}>
            カテゴリーを管理
          </button>
        </div>
      )}
    </div>
  );
};

