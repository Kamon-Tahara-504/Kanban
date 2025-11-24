import { useState, useEffect } from "react";
import type { Category } from "../types";
import "./CategoryManager.css";

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (category: Omit<Category, "id">) => void;
  onUpdate: (id: string, updates: Partial<Category>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const CategoryManager = ({
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onClose,
}: CategoryManagerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#667eea");
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) {
      alert("カテゴリー名を入力してください");
      return;
    }
    onAdd({ name: newName.trim(), color: newColor });
    setNewName("");
    setNewColor("#667eea");
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color || "#667eea");
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) {
      alert("カテゴリー名を入力してください");
      return;
    }
    onUpdate(id, { name: editName.trim(), color: editColor });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditColor("");
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`カテゴリー「${name}」を削除しますか？`)) {
      onDelete(id);
    }
  };

  return (
    <div className="category-manager-overlay" onClick={onClose}>
      <div
        className="category-manager-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="category-manager-header">
          <h2>カテゴリー管理</h2>
          <button className="category-manager-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="category-manager-content">
          {/* カテゴリー追加 */}
          <div className="category-add-section">
            <h3>新しいカテゴリーを追加</h3>
            <div className="category-add-form">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="カテゴリー名"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdd();
                  }
                }}
              />
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="color-picker"
              />
              <button onClick={handleAdd} className="btn-add">
                追加
              </button>
            </div>
          </div>

          {/* カテゴリー一覧 */}
          <div className="category-list-section">
            <h3>カテゴリー一覧</h3>
            <div className="category-list">
              {categories.length === 0 ? (
                <div className="empty-message">カテゴリーがありません</div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="category-item">
                    {editingId === category.id ? (
                      <div className="category-edit-form">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="edit-name-input"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(category.id);
                            } else if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <input
                          type="color"
                          value={editColor}
                          onChange={(e) => setEditColor(e.target.value)}
                          className="color-picker"
                        />
                        <button
                          onClick={() => handleSaveEdit(category.id)}
                          className="btn-save"
                        >
                          保存
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-cancel"
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <div className="category-display">
                        <div className="category-info">
                          <span
                            className="category-color-indicator"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="category-name">{category.name}</span>
                        </div>
                        <div className="category-actions">
                          <button
                            onClick={() => handleStartEdit(category)}
                            className="btn-edit"
                          >
                            編集
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(category.id, category.name)
                            }
                            className="btn-delete"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

