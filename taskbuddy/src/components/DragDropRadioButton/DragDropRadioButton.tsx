import { useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "../Column/Column";
import { TaskType } from "../../atom.tsx";
interface ChildProps {
  tasks1: TaskType[];
}

const DragDropRadioButton: React.FC<ChildProps> = ({ tasks1 }) => {
  const [tasks, setTasks] = useState<TaskType[]>(tasks1);

  useEffect(() => {
    setTasks(tasks1);
  }, [tasks1]);
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

  const getTaskPos = (id: any) => tasks.findIndex((task) => task.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setTasks((tasks) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);

      return arrayMove(tasks, originalPos, newPos);
    });
  };

  return (
    <div className="taskListContainer">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <Column tasks={tasks} />
      </DndContext>
    </div>
  );
};

export default DragDropRadioButton;
