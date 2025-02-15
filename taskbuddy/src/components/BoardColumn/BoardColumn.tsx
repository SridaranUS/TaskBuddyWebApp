import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "../TaskCard/TaskCard";
import "./BoardColumn.css";
import { TaskType, TaskStatus, SearchTask } from "../../atom.tsx";
import { useRecoilValue } from "recoil";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export type Column = {
  id: TaskStatus;
  title: string;
};
type ColumnProps = {
  column: Column;
  tasks: TaskType[];
};

export function BoardColumn({ column, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  let search = useRecoilValue(SearchTask);
  return (
    <div className="boardCard-container">
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <button className={`text-heading-${column.id}`}>{column.title}</button>
        {tasks.length == 0 && (
          <p className="board-no-content">No Task in {column.title}</p>
        )}
        <div ref={setNodeRef} className="card-container">
          {tasks
            .filter((task) => {
              return search.toLowerCase() === ""
                ? task
                : task.title.toLowerCase().includes(search);
            })
            .map((task) => {
              return <TaskCard key={task.id} task={task} />;
            })}
        </div>
      </SortableContext>
    </div>
  );
}
