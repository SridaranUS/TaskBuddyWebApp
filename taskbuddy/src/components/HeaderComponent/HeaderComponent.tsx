import React, { useState } from "react";
import "./HeaderComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faBars,
  faChessBoard,
  faArrowRightFromBracket,
  faMagnifyingGlass,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import AddTodoList from "../AddTodoList/AddTodoList.tsx";
import { SearchTask, LocalName, LocalImage } from "../../atom.tsx";
import "react-date-range/dist/styles.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/theme/default.css";
import { Range } from "react-date-range";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getAuth, signOut } from "firebase/auth";
interface ChildProps {
  sendDataToParent: (data: string) => void;
  getCategory: (data: string) => void;
  getDateRange: (data: RangeSelection) => void;
}
interface RangeSelection {
  startDate?: Date;
  endDate?: Date;
}
const HeaderComponent: React.FC<ChildProps> = ({
  sendDataToParent,
  getCategory,
  getDateRange,
}) => {
  const auth = getAuth();
  const [showCategoryList, setShowCategotyList] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showDateRange, setshowDateRange] = useState(false);
  const [startEndDate, setDataRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const userName = useRecoilValue(LocalName);
  const userImage = useRecoilValue(LocalImage);
  const setSearch = useSetRecoilState(SearchTask);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const view = event.currentTarget.name;
    sendDataToParent(view);
  };
  function PopUpComponent() {
    setIsOpen(false);
  }

  function showCategoryDropDown() {
    setShowCategotyList(!showCategoryList);
  }
  function handleSelectCategory(data: string): void {
    getCategory(data);
    setShowCategotyList(!showCategoryList);
  }
  const isSameDate = (startDate?: Date, endDate?: Date) => {
    if (!startDate || !endDate) return false; 
    return startDate.toDateString() === endDate.toDateString();
  };
  function showAndHideDate(): void {
    setshowDateRange(!showDateRange);
    const sameDate = isSameDate(
      startEndDate[0]?.startDate,
      startEndDate[0]?.endDate
    );
    if (!sameDate) {
      const DateArray = {
        startDate: startEndDate[0]?.startDate,
        endDate: startEndDate[0]?.endDate,
      };
      getDateRange(DateArray);
    }
  }

  async function handleLogOut() {
    try {
      await signOut(auth);
      console.log("User signed out");
      window.location.href = "/login";
    } catch {
      console.log("An error occurred while signing out the user");
    }
  }

  return (
    <>
      <header>
        <div className="headerContainer">
          <div className="headerTitleContainer">
            <h1>
              <FontAwesomeIcon
                icon={faClipboardList}
                style={{ color: "#7b1984" }}
              />
              <span className="headerTitle">Task Buddy</span>
            </h1>
            <nav className="nav-list">
              <a>
                <FontAwesomeIcon icon={faBars} />
                <button name="List" onClick={handleClick} className="navBtn">
                  List
                </button>
              </a>
              <a>
                <FontAwesomeIcon icon={faChessBoard} />
                <button name="Board" onClick={handleClick} className="navBtn">
                  Board
                </button>
              </a>
            </nav>
          </div>
          <div className="loginContainer">
            <div className="userDetails">
              {userImage && (
                <img className="profileImg" src={userImage} alt="user" />
              )}
              <span className="userName">{userName}</span>
            </div>
            <button className="logoutBtn">
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              <span onClick={handleLogOut} className="logOut">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>
      <div className="filterContainer">
        <div className="filterOptions">
          <span>Filter</span>
          <div>
            <button className="dropCategoryBtn" onClick={showCategoryDropDown}>
              Category &nbsp;
              {showCategoryList ? (
                <FontAwesomeIcon icon={faCaretUp} />
              ) : (
                <FontAwesomeIcon icon={faCaretDown} />
              )}
            </button>
            {showCategoryList && (
              <ul className="filter-categotry-menu">
                <button
                  className="filter-drop-button"
                  onClick={() => handleSelectCategory("Category")}
                >
                  Category
                </button>
                <button
                  className="filter-drop-button"
                  onClick={() => handleSelectCategory("Work")}
                >
                  Work
                </button>
                <button
                  className="filter-drop-button"
                  onClick={() => handleSelectCategory("Personal")}
                >
                  Personal
                </button>
              </ul>
            )}
          </div>
          <button className="dropCategoryBtn" onClick={showAndHideDate}>
            Due Date &nbsp;
            {showDateRange ? (
              <FontAwesomeIcon icon={faCaretUp} />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} />
            )}
          </button>
          {showDateRange && (
            <div className="date-container">
              <DateRange
                editableDateInputs={true}
                onChange={(ranges) => setDataRange([ranges.selection as Range])}
                moveRangeOnFirstSelection={false}
                ranges={startEndDate}
                rangeColors={["#7B1984"]}
              />
            </div>
          )}
        </div>
        <div className="search-container">
          <div className="search-bar">
            <span className="search-icon">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <input
              className="search-box"
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search"
            />
          </div>
          <div>
            <button className="addTaskBtn" onClick={() => setIsOpen(!isOpen)}>
              Add Task
            </button>

            <div className={`container ${isOpen ? "show" : "hide"}`}>
              <AddTodoList ShowPopUP={PopUpComponent} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;
