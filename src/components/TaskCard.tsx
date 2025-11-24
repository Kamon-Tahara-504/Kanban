import type { Task } from "../types";
import { PRIORITY_CONFIG } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./TaskCard.css";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div className="task-card-header">
        <h4 className="task-card-name">{task.name}</h4>
        {onDelete && (
          <button
            className="task-card-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
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
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
        >
          編集
        </button>
      )}
    </div>
  );
};

