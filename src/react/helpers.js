import { useState } from "react";
import config from "./config";

const { NODE_ENV, LOCAL_FILES_URL, PRODUCTION_FILES_URL } = config;

export const useSetState = (initialState = {}) => {
  const [state, set] = useState(initialState);
  const setState = patch => {
    set(prev => Object.assign({}, prev, patch instanceof Function ? patch(prev) : patch));
  };

  return [state, setState];
};

export const getCorrectParseFileUrl = (url) => {
  if (NODE_ENV === "development") {
    return url.replace(LOCAL_FILES_URL, PRODUCTION_FILES_URL);
  }

  return url;
}
