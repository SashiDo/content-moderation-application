import React from "react";
import { isMobile } from "react-device-detect";
import { useSetState } from "../../helpers";

import "./style.css";

const Login = () => {
  const [state, setState] = useSetState({
    email: "",
    password: "",
    error: null,
  });

  const onChangeHandler = (e) => {
    e.preventDefault();
    const { target } = e;
    const { type, value } = target;

    setState(state => {
      state.error = null;
      state[type] = value;
    });
  }

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const user = await Parse.User.logIn(state.email, state.password).then((data) => data.toJSON());

      if (user.isModerator) {
        return location.reload();
      }

      setState(state => {
        state.error = "You need to be a moderator!";
      });

    } catch (e) {
      console.log(e);
      setState(state => {
        state.error = "Invalid username or password!";
      });
    }
  }

  return (
    <>
      <div id="loginForm">
        <h3>Not Safe for Work Admin</h3>
        {state.error && <p className="error">{state.error}</p>}
        <input type="email" placeholder="demo@sashido.io" value={state.username} onChange={onChangeHandler} />
        <input type="password" placeholder="demo@sashido.io" value={state.password} onChange={onChangeHandler} />
        <input type="submit" className="button" value="LogIn" onClick={loginHandler} />

        <div className="about">
          <a href="https://blog.sashido.io/" target="_blank">How we built this project?</a>

          {
            isMobile ? (
              <a href="https://github.com/SashiDo/content-moderation-application" className="github" target="_blank">
                <svg height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path fill="#fff" d="M296.133,354.174c49.885-5.891,102.942-24.029,102.942-110.192 c0-24.49-8.624-44.448-22.67-59.869c2.266-5.89,9.515-28.114-2.734-58.947c0,0-18.139-5.898-60.759,22.669   c-18.139-4.983-38.09-8.163-56.682-8.163c-19.053,0-39.011,3.18-56.697,8.163c-43.082-28.567-61.22-22.669-61.22-22.669   c-12.241,30.833-4.983,53.057-2.718,58.947c-14.061,15.42-22.677,35.379-22.677,59.869c0,86.163,53.057,104.301,102.942,110.192   c-6.344,5.452-12.241,15.873-14.507,30.387c-12.702,5.438-45.808,15.873-65.758-18.592c0,0-11.795-21.31-34.012-22.669   c0,0-22.224-0.453-1.813,13.592c0,0,14.96,6.812,24.943,32.653c0,0,13.6,43.089,76.179,29.48v38.543   c0,5.906-4.53,12.702-15.865,10.89C96.139,438.977,32.2,354.626,32.2,255.77c0-123.807,100.216-224.022,224.03-224.022   c123.347,0,224.023,100.216,223.57,224.022c0,98.856-63.946,182.754-152.828,212.688c-11.342,2.266-15.873-4.53-15.873-10.89   V395.45C311.1,374.577,304.288,360.985,296.133,354.174L296.133,354.174z M512,256.23C512,114.73,397.263,0,256.23,0   C114.73,0,0,114.73,0,256.23C0,397.263,114.73,512,256.23,512C397.263,512,512,397.263,512,256.23L512,256.23z" />
                  </g>
                </svg>
              </a>
            ) : <span />
          }
        </div>
      </div>
    </>
  );
}

export default Login;
