import { useEffect, useState } from "react";
import ContentComponent from "../../components/ContentComponet/ContentComponent.tsx";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent.tsx";
import { useRecoilState, useSetRecoilState } from "recoil";
import { taskState, LocalName, LocalImage } from "../../atom";
import { TaskType } from "../../atom.tsx";
import { collection, getDocs } from "firebase/firestore";

import "./Todo-page.css";
import { db } from "../../firebase/firebase.ts";
interface RangeSelection {
  startDate?: Date;
  endDate?: Date;
}
const TodoPage = () => {
  const [tasksdata, setTasksdata] = useRecoilState(taskState);
  const setUserName = useSetRecoilState(LocalName);
  const setUserImage = useSetRecoilState(LocalImage);

  useEffect(() => {
    const getTaskDatas = async (username: string) => {
      const querySnapshot = await getDocs(collection(db, username));
      const datas: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasksdata(datas);
    };
    async function fetchMyData() {
      const userimage: any = await localStorage.getItem("Photo");
      const username: any = await localStorage.getItem("UserName");
      setUserName(username);
      setUserImage(userimage);
      await getTaskDatas(username);
    }
    fetchMyData();
  }, []);
  const [dataFromChild, setDataFromChild] = useState<string>("List");
  const [filterCategory, setfilterCategory] = useState<string>("");
  const [filterDateRange, setfilterDateRange] = useState(false);
  const [filterDateData, setfilterDateData] = useState<TaskType[] | null>(null);
  let taskData: TaskType[] = tasksdata;
  function handleDataFromChild(data: string) {
    setDataFromChild(data);
  }
  function filteredCategory(data: string) {
    setfilterCategory(data);
  }
  if (filterCategory === "Work" || filterCategory === "Personal") {
    taskData = taskData.filter((task) => task.category === filterCategory);
    console.log("filteredData", taskData);
    taskData = taskData.filter((task) => task.category === filterCategory);
  }
  let filteredData: TaskType[] | null;
  function filteredDate(data: RangeSelection) {
    console.log("data", data.startDate, data.endDate);
    const startDate: any = data.startDate;
    const endDate: any = data.endDate;
    filteredData = taskData.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= startDate && taskDate <= endDate;
    });
    setfilterDateData(filteredData);
    if (filteredData) {
      setfilterDateRange(!filterDateRange);
    } else {
      setfilterDateRange(!filterDateRange);
    }
  }
  if (filterDateRange) {
    if (filterDateData) {
      taskData = filterDateData;
    }
  }
  return (
    <>
      <div className="Todo-Page">
        <HeaderComponent
          sendDataToParent={handleDataFromChild}
          getCategory={filteredCategory}
          getDateRange={filteredDate}
        />
        <ContentComponent view={dataFromChild} tasksData={taskData} />
      </div>
    </>
  );
};

export default TodoPage;
