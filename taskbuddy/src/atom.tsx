import { atom } from "recoil";

export type TaskStatus = "Todo" | "In-Progress" | "Completed" | "Choose";
export type Category = "Work" | "Personal" | "Category";
export type ActivityType = {
  activity: string;
  date: Date;
};
export type TaskType = {
  id: number;
  title: string;
  description: string;
  category?: Category;
  dueDate: string;
  status: TaskStatus;
  file: {
    name?: string;
    preview?: string;
  };
  activity: ActivityType[];
};
type Search = string | "";
// Recoil atom for storing tasks
export const taskState = atom<TaskType[]>({
  key: "taskState",
  default: [],
});
export const editTaskState = atom<TaskType[]>({
  key: "editTaskState",
  default: [],
});

export const SearchTask = atom<Search>({
  key: "SearchTask",
  default: "",
});
export const LocalName = atom<string>({
  key: "LocalName",
  default: "",
});
export const LocalImage = atom<string>({
  key: "LocalImage",
  default: "",
});