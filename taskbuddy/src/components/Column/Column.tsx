import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskType, SearchTask } from "../../atom.tsx";

interface ChildProps {
  tasks: TaskType[];
}

import { Task } from "../Task/Task";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import "./column.css";
export const Column: FC<ChildProps> = ({ tasks }) => {
  let search = useRecoilValue(SearchTask);
  return (
    <div className="column">
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks
          .filter((task) => {
            return search.toLowerCase() === ""
              ? task
              : task.title.toLowerCase().includes(search);
          })
          .map((task: TaskType) => (
            <Task key={task.id} id={task.id} task={task} />
          ))}
      </SortableContext>
    </div>
  );
};
