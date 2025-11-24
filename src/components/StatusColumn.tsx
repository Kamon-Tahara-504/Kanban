import { Status, Task } from "../types";
import { TaskCard } from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import "./StatusColumn.css";

interface StatusColumnProps {
  status: Status;
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const StatusColumn = ({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
}: StatusColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`status-column ${isOver ? "drag-over" : ""}`}
    >
      <div className="status-column-header">
        <h3>{status.name}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="status-column-content">
        {tasks.length === 0 ? (
          <div className="empty-column">タスクがありません</div>
        ) : (
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};

