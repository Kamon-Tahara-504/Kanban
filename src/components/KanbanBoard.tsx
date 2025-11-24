import type { Status, Task } from "../types";
import { StatusColumn } from "./StatusColumn";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import "./KanbanBoard.css";

interface KanbanBoardProps {
  statuses: Status[];
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onTaskMove?: (taskId: string, newStatusId: string) => void;
}

export const KanbanBoard = ({
  statuses,
  tasks,
  onEditTask,
  onDeleteTask,
  onTaskMove,
}: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !onTaskMove) return;

    const taskId = active.id as string;
    const newStatusId = over.id as string;

    // ステータスカラムにドロップされた場合のみ更新
    if (statuses.some((status) => status.id === newStatusId)) {
      onTaskMove(taskId, newStatusId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
      <DragOverlay>
        {activeTask ? (
          <div className="task-card-dragging">
            <div className="task-card-header">
              <h4 className="task-card-name">{activeTask.name}</h4>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

