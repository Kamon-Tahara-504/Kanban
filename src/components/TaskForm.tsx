import { useState, useEffect } from "react";
import type { Task, Category, Status, Priority } from "../types";
import "./TaskForm.css";

interface TaskFormProps {
  task?: Task | null;
  categories: Category[];
  statuses: Status[];
  onSubmit: (taskData: Omit<Task, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export const TaskForm = ({
  task,
  categories,
  statuses,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const [name, setName] = useState(task?.name || "");
  const [priority, setPriority] = useState<Priority>(task?.priority || 2);
  const [categoryId, setCategoryId] = useState(
    task?.categoryId || categories[0]?.id || ""
  );
  const [statusId, setStatusId] = useState(
    task?.statusId || statuses[0]?.id || ""
  );
  const [deadline, setDeadline] = useState(
    task?.deadline ? task.deadline.split("T")[0] : ""
  );
  const [content, setContent] = useState(task?.content || "");

  useEffect(() => {
    if (task) {
      setName(task.name);
      setPriority(task.priority);
      setCategoryId(task.categoryId);
      setStatusId(task.statusId);
      setDeadline(task.deadline ? task.deadline.split("T")[0] : "");
      setContent(task.content);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("タスク名を入力してください");
      return;
    }
    if (!categoryId) {
      alert("カテゴリーを選択してください");
      return;
    }
    if (!statusId) {
      alert("ステータスを選択してください");
      return;
    }

    onSubmit({
      name: name.trim(),
      priority,
      categoryId,
      statusId,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      content: content.trim(),
    });
  };

  return (
    <div className="task-form-overlay" onClick={onCancel}>
      <div className="task-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="task-form-header">
          <h2>{task ? "タスクを編集" : "新しいタスクを追加"}</h2>
          <button className="task-form-close" onClick={onCancel}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="task-name">タスク名 *</label>
            <input
              id="task-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="タスク名を入力"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-category">カテゴリー *</label>
              <select
                id="task-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-status">ステータス *</label>
              <select
                id="task-status"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                required
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>優先度 *</label>
            <div className="priority-buttons">
              <button
                type="button"
                className={`priority-btn ${priority === 3 ? "active high" : ""}`}
                onClick={() => setPriority(3)}
              >
                高
              </button>
              <button
                type="button"
                className={`priority-btn ${priority === 2 ? "active medium" : ""}`}
                onClick={() => setPriority(2)}
              >
                中
              </button>
              <button
                type="button"
                className={`priority-btn ${priority === 1 ? "active low" : ""}`}
                onClick={() => setPriority(1)}
              >
                低
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-deadline">締切日</label>
              <input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-content">内容</label>
            <textarea
              id="task-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="タスクの詳細を入力"
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              キャンセル
            </button>
            <button type="submit" className="btn-submit">
              {task ? "更新" : "追加"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

