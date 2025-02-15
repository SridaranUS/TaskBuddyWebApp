import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faEllipsis,
  faEllipsisVertical,
  faCircleCheck,
  faXmark,
  faCheckToSlot,
} from "@fortawesome/free-solid-svg-icons";
import "./Task.css";
import { FC, useEffect, useRef, useState } from "react";
import EditTodoTask from "../EditTodoTask/EditTodoTask";
import { TaskType, TaskStatus, taskState, LocalName } from "../../atom.tsx";
import { useRecoilState, useRecoilValue } from "recoil";
import React from "react";
import { db, deleteDoc, doc } from "../../firebase/firebase.ts";
import { updateDoc } from "firebase/firestore";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
interface Props {
  id: number;
  task: TaskType;
}

let value: number[] = [];
export const Task: FC<Props> = ({ id, task }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [tasks, setTasks] = useRecoilState(taskState);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const userName = useRecoilValue(LocalName);

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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function onClickHandler() {
    setShowMenu(!showMenu);
  }

  function handleClickEdit(): void {
    setEditTask(!editTask);
    setShowMenu(!showMenu);
  }
  const handleClickDelete = async () => {
    setTasks(tasks.filter((taskdata) => taskdata.id !== task.id));
    const docId = String(task.id);
    deleteDoc(doc(db, userName, docId));
    setShowMenu(!showMenu);
  };
  function PopUpComponent() {
    setEditTask(!editTask);
  }
  const handleSelectStatus = async (data: string) => {
    setTasks(
      tasks.map((taskdata) =>
        taskdata.id === task.id
          ? { ...taskdata, status: data as TaskStatus }
          : taskdata
      )
    );
    const docId = String(task.id);
    const taskStatus = doc(db, userName, docId);
    await updateDoc(taskStatus, {
      status: data,
    });
    setIsOpenStatus(!isOpenStatus);
  };

  const handleChange = (id: number, checked: boolean) => {
    console.log(id, checked);
    if (checked) {
      value.push(id);
    } else {
      value = value.filter((item) => item !== id);
    }
    if (value.length > 1) {
      setIsSelected(!isSelected);
    } else {
      setIsSelected(false);
    }
  };

  function handleStatus(data: string): void {
    setTasks(
      tasks.map((taskdata) =>
        value.includes(taskdata.id)
          ? { ...taskdata, status: data as TaskStatus }
          : taskdata
      )
    );
    value.map((item) => {
      const docId = String(item);
      const taskStatus = doc(db, userName, docId);
      updateDoc(taskStatus, {
        status: data,
      });
    });
    value = [];
    setShowStatusMenu(!showStatusMenu);
    setIsSelected(false);
  }

  function deleteMultipleTask(): void {
    setTasks(tasks.filter((taskdata) => !value.includes(taskdata.id)));
    value.map((item) => {
      const docId = String(item);
      deleteDoc(doc(db, userName, docId));
    });
    setIsSelected(false);
  }

  function closePopUp() {
    setShowStatusMenu(!showStatusMenu);
    setIsSelected(false);
  }
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="task"
      >
        <section className="task-section">
          <input
            type="checkbox"
            className="checkbox"
            id={`"${task.id}"`}
            onChange={(e) => handleChange(task.id, e.target.checked)}
          />
          <div className="list-icon">
            <FontAwesomeIcon icon={faEllipsisVertical} />
            <FontAwesomeIcon icon={faEllipsisVertical} />
            {task.status === "Completed" ? (
              <FontAwesomeIcon
                icon={faCircleCheck}
                style={{ color: "#1b8d17" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faCircleCheck}
                style={{ color: "#a7a7a7" }}
              />
            )}
          </div>
          <div className="taskList">
            <span className="task-title">
              {task.status === "Completed" ? <s>{task.title}</s> : task.title}
            </span>
            <span className="task-due-date">
              {formatDate(new Date(Date.parse(task.dueDate)))}
            </span>
            <div>
              <Popup
                contentStyle={{ width: "100px", height: "100px" }}
                trigger={<span className="task-priority">{task.status}</span>}
                position="bottom center"
                on="hover"
              >
                <div>
                  <button
                    className="statusDrop-button"
                    onClick={() => handleSelectStatus("Todo")}
                  >
                    Todo
                  </button>
                  <button
                    className="statusDrop-button"
                    onClick={() => handleSelectStatus("In-Progress")}
                  >
                    In-Progress
                  </button>
                  <button
                    className="statusDrop-button"
                    onClick={() => handleSelectStatus("Completed")}
                  >
                    Completed
                  </button>
                </div>
              </Popup>
            </div>
            <span className="task-status">{task.category}</span>
            <div draggable="false" className="unselectable">
              <Popup
                contentStyle={{ width: "100px", height: "70px" }}
                trigger={
                  <button
                    draggable="false"
                    className="moreOption"
                    onClick={onClickHandler}
                  >
                    <FontAwesomeIcon icon={faEllipsis} />
                  </button>
                }
                position="bottom center"
                on="hover"
              >
                <button
                  name="Edit"
                  onClick={handleClickEdit}
                  className="editBtn"
                >
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
          </div>
        </section>
      </div>
      <div className={`edit-container ${editTask ? "show" : "hide"}`}>
        <EditTodoTask ShowPopUP={PopUpComponent} task={task} />
      </div>
      <React.Fragment>
        {isSelected && (
          <footer className="footer-popup">
            <div className="popUp-group">
              <div className="text-group">
                <span>{value.length} &nbsp;Tasks Selected</span>
                <button onClick={closePopUp} className="close-popup">
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <span>
                <FontAwesomeIcon icon={faCheckToSlot} />
              </span>
            </div>
            <div className="Popup-buttongroup">
              <button
                onClick={() => {
                  setShowStatusMenu(!showStatusMenu);
                }}
                className="popup-Status"
              >
                Status
              </button>
              <button onClick={deleteMultipleTask} className="popup-delete">
                Delete
              </button>
            </div>
          </footer>
        )}
        {showStatusMenu && (
          <div className="status-popup">
            <button
              className="statusPopUp-button"
              onClick={() => handleStatus("Todo")}
            >
              Todo
            </button>
            <button
              className="statusPopUp-button"
              onClick={() => handleStatus("In-Progress")}
            >
              In-Progress
            </button>
            <button
              className="statusPopUp-button"
              onClick={() => handleStatus("Completed")}
            >
              Completed
            </button>
          </div>
        )}
      </React.Fragment>
    </>
  );
};
