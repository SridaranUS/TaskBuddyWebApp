import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./ContentComponent.css";
import { FormEvent, useRef, useState } from "react";
import React from "react";
import DragDropRadioButton from "../DragDropRadioButton/DragDropRadioButton";
import BoardDragAndDrop from "../BoardDragAndDrop.tsx/BoardDragAndDrop";
import { TaskType, TaskStatus, Category, LocalName } from "../../atom.tsx";
import { useRecoilState, useRecoilValue } from "recoil";
import { taskState } from "../../atom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";
interface ChildProps {
  view: string;
  tasksData: TaskType[];
}

const ContentComponent: React.FC<ChildProps> = ({ view, tasksData }) => {
  const [showComponent, setShowComponent] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [date, setDate] = useState("");
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [selectedcategory, setSelectedCategory] =
    useState<Category>("Category");
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("Choose");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useRecoilState(taskState);
  const userName = useRecoilValue(LocalName);

  const handleSelectStatus = (value: string, e: any) => {
    e.preventDefault();
    setSelectedStatus(value as TaskStatus);
    setIsOpenStatus(false);
  };
  const handleSelectCategory = (value: string, e: any) => {
    e.preventDefault();
    setSelectedCategory(value as Category);
    setIsOpenCategory(false);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const activityData = [
      {
        activity: "You created the created",
        date: new Date(),
      },
    ];
    const copiedTasks = tasks.map((task) => ({ ...task }));
    const lastTaskId = copiedTasks.sort((a, b) => b.id - a.id)[0]?.id ?? null;
    if (tasks.length > 0) {
      const newTask: TaskType = {
        id: lastTaskId + 1,
        title: taskTitle,
        description: "",
        category: selectedcategory,
        dueDate: date,
        status: selectedStatus,
        file: {
          name: "",
          preview: "",
        },
        activity: activityData,
      };
      const docId = String(newTask.id);
      await setDoc(doc(db, userName, docId), newTask);
      setTasks([...tasks, newTask]);
      setTaskTitle("");
      setSelectedStatus("Choose");
      setDate("");
    } else {
      const newTask: TaskType = {
        id: lastTaskId + 1,
        title: taskTitle,
        description: "",
        category: selectedcategory,
        dueDate: date,
        status: selectedStatus,
        file: {
          name: "",
          preview: "",
        },
        activity: activityData,
      };
      setTasks([...tasks, newTask]);
      setTaskTitle("");
      setSelectedStatus("Choose");
      setDate("");
    }
  };

  const todoTasks: TaskType[] = tasksData.filter(
    (task) => task.status === "Todo"
  );
  const inProgressTasks: TaskType[] = tasksData.filter(
    (task) => task.status === "In-Progress"
  );
  const completedTasks: TaskType[] = tasksData.filter(
    (task) => task.status === "Completed"
  );

  return (
    <>
      {view === "List" && (
        <section className="contentContainer">
          <hr />
          <div className="list-Heading">
            <span>Task Title</span>
            <span className="due-on">Due on</span>
            <span className="status-tile">Task Status</span>
            <span className="status-category">Task Category</span>
          </div>
          <div className="todoContainer">
            <Collapsible
              trigger={`To-do (${todoTasks.length})`}
              classParentString="todo"
              open
              style={{ width: "100%", overflow: "visible" }}
            >
              <button
                onClick={() => setShowComponent(!showComponent)}
                className="addTask"
              >
                <FontAwesomeIcon icon={faPlus} /> Add Task
              </button>
              <hr />
              {showComponent && (
                <React.Fragment>
                  <form onSubmit={handleSubmit}>
                    <div className="task-form-conatainer">
                      <div className="task-form">
                        <div className="input-details">
                          <input
                            type="text"
                            placeholder="Task Title"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="input-box"
                          />

                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="input-box"
                          />
                          <div ref={dropdownRef} className="dropdown">
                            <button
                              className="dropdown-button"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsOpenStatus(!isOpenStatus);
                              }}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>

                            {isOpenStatus && (
                              <ul className="dropdown-menu">
                                <button
                                  className="drop-button"
                                  onClick={(e) => handleSelectStatus("Todo", e)}
                                >
                                  Todo
                                </button>
                                <button
                                  className="drop-button"
                                  onClick={(e) =>
                                    handleSelectStatus("In-Progress", e)
                                  }
                                >
                                  In-Progress
                                </button>
                                <button
                                  className="drop-button"
                                  onClick={(e) =>
                                    handleSelectStatus("Completed", e)
                                  }
                                >
                                  Completed
                                </button>
                              </ul>
                            )}
                          </div>
                          <div ref={dropdownRef} className="dropdown">
                            <button
                              className="dropdown-button"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsOpenCategory(!isOpenCategory);
                              }}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>

                            {isOpenCategory && (
                              <ul className="categotry-menu">
                                <button
                                  className="drop-button"
                                  onClick={(e) =>
                                    handleSelectCategory("Work", e)
                                  }
                                >
                                  Work
                                </button>
                                <button
                                  className="drop-button"
                                  onClick={(e) =>
                                    handleSelectCategory("Personal", e)
                                  }
                                >
                                  Personal
                                </button>
                              </ul>
                            )}
                          </div>
                        </div>
                        <div className="button-group">
                          <button type="submit" className="button add">
                            ADD ↵
                          </button>
                          <button
                            className="button cancel"
                            onClick={() => setShowComponent(!showComponent)}
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <hr />
                </React.Fragment>
              )}
              {todoTasks.length == 0 && (
                <p className="no-content">No Task in Todo</p>
              )}

              <DragDropRadioButton tasks1={todoTasks} />
            </Collapsible>
          </div>
          <div className="todoContainer">
            <Collapsible
              trigger={`In-Progress (${inProgressTasks.length})`}
              classParentString="inProgress"
              open
              style={{ width: "100%", overflow: "visible" }}
            >
              {inProgressTasks.length == 0 && (
                <p className="no-content">No Task in In-Progress</p>
              )}
              <DragDropRadioButton tasks1={inProgressTasks} />
            </Collapsible>
          </div>
          <div className="todoContainer">
            <Collapsible
              trigger={`Completed (${completedTasks.length})`}
              classParentString="completed"
              open
              style={{ width: "100%", overflow: "visible" }}
            >
              {completedTasks.length == 0 && (
                <p className="no-content">No Task in Completed</p>
              )}
              <DragDropRadioButton tasks1={completedTasks} />
            </Collapsible>
          </div>
        </section>
      )}
      {view === "Board" && (
        <section className="contentContainer">
          <BoardDragAndDrop tasks1={tasksData} />
        </section>
      )}
    </>
  );
};

export default ContentComponent;
