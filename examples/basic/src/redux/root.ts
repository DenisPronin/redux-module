import { combineReducers } from "redux";
import counter from "./modules/counter";

export const rootReducers = combineReducers({
  counter: counter.reducers
})
