import { Status, Task } from "../types";
import { StatusColumn } from "./StatusColumn";
import "./KanbanBoard.css";

interface KanbanBoardProps {
  statuses: Status[];
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const KanbanBoard = ({
  statuses,
  tasks,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) => {
  return (
    <div className="kanban-board">
      <div className="kanban-columns">
        {statuses.map((status) => {
          const statusTasks = tasks.filter(
            (task) => task.statusId === status.id
          );
          return (
            <StatusColumn
              key={status.id}
              status={status}
              tasks={statusTasks}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          );
        })}
      </div>
    </div>
  );
};

