import { useDraggable } from "@dnd-kit/core";
import "./TaskCard.css";
import { LocalName, TaskType, taskState } from "../../atom.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import EditTodoTask from "../EditTodoTask/EditTodoTask.tsx";
import { useRecoilState, useRecoilValue } from "recoil";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

type TaskCardProps = {
  task: TaskType;
};

export function TaskCard({ task }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [tasks, setTasks] = useRecoilState(taskState);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userName = useRecoilValue(LocalName);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (showMenu) setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  function onClickHandler() {
    setShowMenu(!showMenu);
  }

  function handleClickEdit() {
    setEditTask(!editTask);
    setShowMenu(!showMenu);
  }

  function PopUpComponent() {
    setEditTask(!editTask);
  }
  function handleClickDelete(): void {
    setTasks(tasks.filter((taskdata) => taskdata.id !== task.id));
    const docId = String(task.id);
    deleteDoc(doc(db, userName, docId));
    setShowMenu(!showMenu);
  }
  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="draggable-card"
        style={style}
      >
        <header className="card-headerContainer">
          <h3 className="card-title">{task.title}</h3>
          <div className="moreOption-container">
            <Popup
              contentStyle={{ width: "100px", height: "70px" }}
              trigger={
                <button
                  draggable="false"
                  className="card-moreOption"
                  onClick={onClickHandler}
                >
                  <FontAwesomeIcon icon={faEllipsis} />
                </button>
              }
              position="left center"
              on="hover"
            >
              <button name="Edit" onClick={handleClickEdit} className="editBtn">
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>Edit</span>
              </button>
              <button
                name="Delete"
                onClick={handleClickDelete}
                className="deleteBtn"
              >
                <FontAwesomeIcon icon={faTrashCan} />
                <span>Delete</span>
              </button>
            </Popup>
          </div>
        </header>
        <footer className="card-footerContainer">
          <p className="card-description">{task.category}</p>
          <p className="card-description">
            {formatDate(new Date(Date.parse(task.dueDate)))}
          </p>
        </footer>
      </div>
      <div
        draggable="false"
        className={`card-edit-container ${editTask ? "show" : "hide"}`}
      >
        <EditTodoTask ShowPopUP={PopUpComponent} task={task} />
      </div>
    </>
  );
}
