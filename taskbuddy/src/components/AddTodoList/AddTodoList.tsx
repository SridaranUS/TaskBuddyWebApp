import { FormEvent, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { LocalName, taskState } from "../../atom.tsx";
import { useDropzone } from "react-dropzone";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./AddTodoList.css";
import { TaskType, TaskStatus, Category } from "../../atom.tsx";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";

interface ChildProps {
  ShowPopUP: (data: string) => void;
}
const modules = {
  toolbar: [
    ["bold", "italic", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};

const formats = ["header", "bold", "italic", "strike", "list"];
const AddTodoList: React.FC<ChildProps> = ({ ShowPopUP }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Work");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [status, setStatus] = useState<TaskStatus>("Choose");
  const [file, setFile] = useState<{ name: string; preview: string } | null>(
    null
  );
  const [tasks, setTasks] = useRecoilState(taskState);
  const userName = useRecoilValue(LocalName);

  const closePopUp = () => {
    ShowPopUP("false");
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFile({
        name: file.name,
        preview: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });
  const today = new Date();
  console.log("today", today);

  const activityData = [
    {
      activity: "You created the Task",
      date: today,
    },
  ];
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const copiedTasks = tasks.map((task) => ({ ...task }));
    const lastTaskId = copiedTasks.sort((a, b) => b.id - a.id)[0]?.id ?? null;
    if (tasks.length > 0) {
      const newTask: TaskType = {
        id: lastTaskId + 1,
        title: title,
        description: description,
        category: selectedCategory,
        dueDate: selectedDate,
        status: status,
        file: {
          name: file?.name,
          preview: file?.preview,
        },
        activity: activityData,
      };
      try {
        const docId = String(newTask.id);
        await setDoc(doc(db, userName, docId), newTask);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      setTasks([...tasks, newTask]);
      setTitle("");
      setDescription("");
      setStatus("Choose");
      setFile(null);
      setSelectedDate("");
      ShowPopUP("false");
    } else {
      const newTask: TaskType = {
        id: 1,
        title: title,
        description: description,
        category: selectedCategory,
        dueDate: selectedDate,
        status: status,
        file: {
          name: file?.name,
          preview: file?.preview,
        },
        activity: activityData,
      };
      try {
        const docId = String(newTask.id);
        await setDoc(doc(db, userName, docId), newTask);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      setTasks([...tasks, newTask]);
      setTitle("");
      setDescription("");
      setStatus("Choose");
      setFile(null);
      setSelectedDate("");
      ShowPopUP("false");
    }
  };

  return (
    <>
      <div className="task-container">
        <header className="AddTodoHeader">
          <h2>Create Task</h2>
          <button onClick={closePopUp} className="cancel-popUp">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>
        <hr />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            className="task-input"
            required
          />

          <ReactQuill
            className="description"
            value={description}
            modules={modules}
            formats={formats}
            theme="snow"
            onChange={setDescription}
            placeholder="Description"
          />
          <div className="task-details">
            <div className="category-container">
              <label className="category-label">Task Category</label>
              <div className="category-buttons">
                {["Work", "Personal"].map((category) => (
                  <button
                    key={category}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory(category as Category);
                    }}
                    className={`category-button ${selectedCategory === category ? "selected" : ""}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="dateContainer">
              <label className="date-label">Due Date:</label>
              <br />
              <input
                className="dueDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
            <div className="statusContainer">
              <label className="status-label" htmlFor="status">
                Select Status:
              </label>
              <br />
              <select
                className="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                required
              >
                <option value="" hidden>
                  -- Select --
                </option>
                <option value="Todo">Todo</option>
                <option value="In-Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="new-attachment">
            <label className="attachment-label" htmlFor="attachment">
              Attach File:
            </label>
            <br />
            <br />
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>Drag & Drop an image here, or click to select</p>
            </div>
            <div>
              {file && (
                <div className="fileDetails">
                  <p className="fileName">File Chosen: {file.name}</p>
                </div>
              )}
            </div>
          </div>
          <footer className="add-footer-content">
            <button onClick={closePopUp} className="add-cancel-button">
              Cancel
            </button>
            <button type="submit" className="add-task-button">
              Create
            </button>
          </footer>
        </form>
      </div>
    </>
  );
};

export default AddTodoList;
