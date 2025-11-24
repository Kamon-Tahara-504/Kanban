import { useState, useEffect } from "react";
import type { Status } from "../types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./StatusManager.css";

interface StatusManagerProps {
  statuses: Status[];
  taskCount?: (statusId: string) => number;
  onAdd: (status: Omit<Status, "id">) => void;
  onUpdate: (id: string, updates: Partial<Status>) => void;
  onDelete: (id: string) => void;
  onReorder: (statuses: Status[]) => void;
  onClose: () => void;
}

interface SortableStatusItemProps {
  status: Status;
  editingId: string | null;
  editName: string;
  taskCount?: number;
  onStartEdit: (status: Status) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string, name: string) => void;
  onNameChange: (name: string) => void;
}

const SortableStatusItem = ({
  status,
  editingId,
  editName,
  taskCount,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onNameChange,
}: SortableStatusItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: status.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="status-item">
      <div className="status-drag-handle" {...attributes} {...listeners}>
        ⋮⋮
      </div>
      {editingId === status.id ? (
        <div className="status-edit-form">
          <input
            type="text"
            value={editName}
            onChange={(e) => onNameChange(e.target.value)}
            className="edit-name-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSaveEdit(status.id);
              } else if (e.key === "Escape") {
                onCancelEdit();
              }
            }}
            autoFocus
          />
          <button onClick={() => onSaveEdit(status.id)} className="btn-save">
            保存
          </button>
          <button onClick={onCancelEdit} className="btn-cancel">
            キャンセル
          </button>
        </div>
      ) : (
        <div className="status-display">
          <span className="status-name">
            {status.name}
            {taskCount !== undefined && taskCount > 0 && (
              <span className="status-task-count"> ({taskCount})</span>
            )}
          </span>
          <div className="status-actions">
            <button
              onClick={() => onStartEdit(status)}
              className="btn-edit"
            >
              編集
            </button>
            <button
              onClick={() => onDelete(status.id, status.name)}
              className="btn-delete"
            >
              削除
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const StatusManager = ({
  statuses,
  taskCount,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onClose,
}: StatusManagerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState("");
  const [localStatuses, setLocalStatuses] = useState(statuses);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    if (!newName.trim()) {
      alert("ステータス名を入力してください");
      return;
    }
    const maxOrder = Math.max(...localStatuses.map((s) => s.order), -1);
    onAdd({ name: newName.trim(), order: maxOrder + 1 });
    setNewName("");
  };

  const handleStartEdit = (status: Status) => {
    setEditingId(status.id);
    setEditName(status.name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) {
      alert("ステータス名を入力してください");
      return;
    }
    onUpdate(id, { name: editName.trim() });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleDelete = (id: string, name: string) => {
    const count = taskCount ? taskCount(id) : 0;
    const message = count > 0
      ? `ステータス「${name}」を削除しますか？\nこのステータスには${count}個のタスクが含まれています。タスクも削除されます。`
      : `ステータス「${name}」を削除しますか？`;
    
    if (window.confirm(message)) {
      onDelete(id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localStatuses.findIndex((s) => s.id === active.id);
      const newIndex = localStatuses.findIndex((s) => s.id === over.id);

      const newStatuses = arrayMove(localStatuses, oldIndex, newIndex);
      setLocalStatuses(newStatuses);
      onReorder(newStatuses);
    }
  };

  // ステータスが変更されたらローカル状態を更新
  useEffect(() => {
    setLocalStatuses(statuses);
  }, [statuses]);

  return (
    <div className="status-manager-overlay" onClick={onClose}>
      <div
        className="status-manager-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="status-manager-header">
          <h2>ステータス管理</h2>
          <button className="status-manager-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="status-manager-content">
          {/* ステータス追加 */}
          <div className="status-add-section">
            <h3>新しいステータスを追加</h3>
            <div className="status-add-form">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="ステータス名"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdd();
                  }
                }}
              />
              <button onClick={handleAdd} className="btn-add">
                追加
              </button>
            </div>
          </div>

          {/* ステータス一覧 */}
          <div className="status-list-section">
            <h3>ステータス一覧（ドラッグで順序変更）</h3>
            {localStatuses.length === 0 ? (
              <div className="empty-message">ステータスがありません</div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localStatuses.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="status-list">
                    {localStatuses.map((status) => (
                      <SortableStatusItem
                        key={status.id}
                        status={status}
                        editingId={editingId}
                        editName={editName}
                        taskCount={taskCount ? taskCount(status.id) : undefined}
                        onStartEdit={handleStartEdit}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onDelete={handleDelete}
                        onNameChange={setEditName}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

