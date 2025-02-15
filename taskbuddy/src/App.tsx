import './App.css'
import LoginPage from './pages/LoginPage/LoginPage'
import TodoPage from './pages/Todo-Page/TodoPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase/firebase";
import AuthRoute from "./contexts/AuthRoute";
initializeApp(firebaseConfig);
import { PropsWithChildren } from "react";

export interface IApplicationProps {}

const App: React.FunctionComponent<PropsWithChildren> =() =>{

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoute>
                <TodoPage />
              </AuthRoute>
            }
          />
         <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
