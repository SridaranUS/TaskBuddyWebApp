import React, { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import "./LoginPage.css";
export interface ILoginPageProps {}

export const userimage: any = localStorage.getItem("Photo");
export const userName = localStorage.getItem("UserName");
const LoginPage: React.FunctionComponent<PropsWithChildren> = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);

  const signInWithGoogle = async () => {
    setAuthing(true);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        console.log(response.user.uid,response.user.displayName);
         localStorage.setItem("UserName", String(response.user.displayName));
          localStorage.setItem("Photo", String(response.user.photoURL));
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setAuthing(false);
      });
      
  };

  return (
    <>
      <div className="login-page">
        <div className="login-Container">
          <div className="login-Content">
            <div>
              <h1 className="login-header">
                <FontAwesomeIcon
                  icon={faClipboardList}
                  style={{ color: "#7b1984" }}
                />
                <span className="headerTitle">Task Buddy</span>
              </h1>
            </div>
            <span>
              Streamline your workflow and task progress effortlessly with our
              all-in-one task management app
            </span>
            <button
              className="google-btn"
              onClick={() => signInWithGoogle()}
              disabled={authing}
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
              />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
