import React from "react";
import { isBrowser } from "react-device-detect";

import "./style.css";

const ForkMeOnGithub = () => {
  if (!isBrowser) return null;

  return (
    <a className="github-fork-ribbon" href="https://github.com/SashiDo/content-moderation-application" data-ribbon="Fork me on GitHub" title="Fork me on GitHub" target="_blank">Fork me on GitHub</a>
  );
}

export default ForkMeOnGithub;
