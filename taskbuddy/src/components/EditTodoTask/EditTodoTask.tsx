import { FormEvent, useState } from "react";
import { useSetRecoilState } from "recoil";
import { taskState } from "../../atom";
import { useDropzone } from "react-dropzone";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./EditTodoTask.css";
import { TaskType, TaskStatus, Category, ActivityType } from "../../atom.tsx";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.ts";

interface ChildProps {
  ShowPopUP: (data: string) => void;
  task: TaskType;
}
const modules = {
  toolbar: [
    ["bold", "italic", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};
const formats = ["header", "bold", "italic", "strike", "list"];

const EditTodoTask: React.FC<ChildProps> = ({ ShowPopUP, task }) => {
  const document = {
    name: task.file.name,
    preview: task.file.preview,
  };
  const taskDescription = task.description;
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(taskDescription);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(task.category);
  const [selectedDate, setSelectedDate] = useState<string>(task.dueDate);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [file, setFile] = useState<{ name?: string; preview?: string }>(
    document
  );
  const setTasks = useSetRecoilState(taskState);
  const [Showdetails, setshowDetails] = useState(true);
  const closePopUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("closePopUp");

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
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const activities: ActivityType = {
      activity: "You Edited the Task",
      date: today,
    };

    let activity = task.activity;
    const activityData: ActivityType[] = [...activity, activities];
    const newTask: TaskType = {
      id: task.id,
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
    const docId = String(newTask.id);
    await setDoc(doc(db, "TaskDatas", docId), newTask);
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === newTask.id ? newTask : task))
    );
    ShowPopUP("false");
  };
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <>
      <header className="edit-TodoHeader">
        <button onClick={closePopUp} className="edit-cancel-popUp">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </header>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="edit-floatContainer">
          <div className="editContainer">
            <div className="DetailsButton-Group">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setshowDetails(true);
                }}
                className="details-button"
              >
                Details
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setshowDetails(false);
                }}
                className="activity-button"
              >
                Activity
              </button>
            </div>
            <div
              className={`edit-task-container ${Showdetails ? "btn-edit-show" : "btn-edit-hide"}`}
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
                className="edit-task-input"
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
              <div className="edit-task-details">
                <div className="edit-category-container">
                  <label className="category-label">Task Category</label>
                  <div className="edit-category-buttons">
                    {["Work", "Personal"].map((category) => (
                      <button
                        key={category}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory(category as Category);
                        }}
                        className={`edit-category-button ${selectedCategory === category ? "selected" : ""}`}
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
                    className="edit-dueDate"
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
                    className="edit-status"
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
              <div className="edit-attachment">
                <label className="attachment-label" htmlFor="attachment">
                  Attach File:
                </label>
                <br />
                <div {...getRootProps()} className="edit-dropzone">
                  <input {...getInputProps()} />
                  <p>Drag & Drop an image here, or click to Update</p>
                </div>
                <div>
                  {file && (
                    <div className="edit-fileDetails">
                      <p className="edit-fileName">File Chosen: {file.name}</p>
                      <img
                        src={file.preview}
                        alt="Image Not Uploaded"
                        className="edit-imagePreview"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`activity-container ${Showdetails ? "activity-edit-hide" : "activity-edit-show"}`}
            >
              <header className="activity-header">Activity</header>
              <div className="activity-details">
                {task.activity.map((activity, index) => (
                  <li key={index} className="activity-item">
                    <p className="activity-name">{activity.activity}</p>
                    <p>{formatter.format(activity.date)}</p>
                  </li>
                ))}
              </div>
            </div>
          </div>
          <footer className="edit-footer-content">
            <button onClick={closePopUp} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="task-button">
              Update
            </button>
          </footer>
        </div>
      </form>
    </>
  );
};

export default EditTodoTask;
