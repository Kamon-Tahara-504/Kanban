import { Status } from "../types";
import "./KanbanBoard.css";

interface KanbanBoardProps {
  statuses: Status[];
  children?: React.ReactNode;
}

export const KanbanBoard = ({ statuses, children }: KanbanBoardProps) => {
  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <input
          type="text"
          placeholder="タスクを検索..."
          className="kanban-search"
        />
      </div>
      <div className="kanban-columns">
        {statuses.map((status) => (
          <div key={status.id} className="kanban-column">
            <div className="kanban-column-header">
              <h3>{status.name}</h3>
            </div>
            <div className="kanban-column-content">
              {/* タスクカードは後で追加 */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

