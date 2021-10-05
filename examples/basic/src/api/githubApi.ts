import { queryGet } from "./apiConfig";

const githubApi = {
  getUser (userName: string) {
    return queryGet(`/users/${userName}`);
  }
};

export default githubApi;
