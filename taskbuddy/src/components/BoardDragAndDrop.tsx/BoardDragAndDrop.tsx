import React from "react";
import { BoardColumn } from "../BoardColumn/BoardColumn";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import "./BoardDragAndDrop.css";
import { TaskType, TaskStatus, taskState, LocalName } from "../../atom.tsx";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { db, updateDoc, doc } from "../../firebase/firebase.ts";

interface ChildProps {
  tasks1: TaskType[];
}
export type Column = {
  id: TaskStatus;
  title: string;
};
const COLUMNS: Column[] = [
  { id: "Todo", title: "To Do" },
  { id: "In-Progress", title: "In Progress" },
  { id: "Completed", title: "Completed" },
];
const BoardDragAndDrop: React.FC<ChildProps> = ({ tasks1 }) => {
  const setTasks = useSetRecoilState(taskState);
  const userName = useRecoilValue(LocalName);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as TaskType["status"];
    const docId = String(taskId);
    const taskStatus = doc(db, userName, docId);
    updateDoc(taskStatus, {
      status: newStatus,
    });
    setTasks(() =>
      tasks1.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  return (
    <div className="flex-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        {COLUMNS.map((column) => {
          return (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={tasks1.filter((task) => task.status === column.id)}
            />
          );
        })}
      </DndContext>
    </div>
  );
};
export default BoardDragAndDrop;
