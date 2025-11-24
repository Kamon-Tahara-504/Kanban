import { Task, PRIORITY_CONFIG } from "../types";
import "./TaskCard.css";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const createdAt = new Date(task.createdAt).toLocaleDateString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
  });
  const deadline = task.deadline
    ? new Date(task.deadline).toLocaleDateString("ja-JP", {
        month: "2-digit",
        day: "2-digit",
      })
    : null;

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4 className="task-card-name">{task.name}</h4>
        {onDelete && (
          <button
            className="task-card-delete"
            onClick={() => onDelete(task.id)}
            aria-label="タスクを削除"
          >
            ×
          </button>
        )}
      </div>
      <div className="task-card-priority">
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityConfig.color }}
        >
          {priorityConfig.label}
        </span>
      </div>
      <div className="task-card-dates">
        <span className="task-date">作成日: {createdAt}</span>
        {deadline && <span className="task-date">締切日: {deadline}</span>}
      </div>
      {task.content && (
        <div className="task-card-content">{task.content}</div>
      )}
      {onEdit && (
        <button
          className="task-card-edit"
          onClick={() => onEdit(task)}
        >
          編集
        </button>
      )}
    </div>
  );
};

