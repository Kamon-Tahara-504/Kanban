import { Status, Task } from "../types";
import { TaskCard } from "./TaskCard";
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
  return (
    <div className="status-column">
      <div className="status-column-header">
        <h3>{status.name}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="status-column-content">
        {tasks.length === 0 ? (
          <div className="empty-column">タスクがありません</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

