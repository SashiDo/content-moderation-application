import React from "react";
import { Route, Switch } from "react-router-dom";
import { useSetState } from "./helpers";
import ForkMeOnGithub from "./components/ForkMeOnGithub";
import PoweredBy from "./components/PoweredBy";
import PageLogin from "./pages/login";
import PageModerator from "./pages/moderator";

const App = () => {
  const [state, setState] = useSetState({
    loading: true,
    user: Parse.User.current() ? Parse.User.current().toJSON() : {},
  });

  return (
    <>
      <ForkMeOnGithub />
      <PoweredBy />
      <Switch>
        <Route
          path="/"
          render={() => {
            return (
              <Route render={(props) => {
                return state.user.isModerator
                  ? <PageModerator {...props} />
                  : <PageLogin {...props} />
              }} />
            )
          }}
        />
      </Switch>
    </>
  );
}

export default App;
