import { combineReducers } from "redux";
import { counterReducer } from "./modules/counter";

export const rootReducers = combineReducers({
  counter: counterReducer
})
