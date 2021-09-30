import { AnyAction } from "redux";
import { reduceReducers } from "./createReducer";

interface IReducers {
  [actionName: string]: () => {};
}

class ReduxModule {
  
  namespace: string = '';
  actions: any = {}
  reducers: any = {}
  initialState = {}
  
  constructor () {
    this.namespace = `[${this.constructor.name}]`;
  }
  
  init () {
    this.initialState = this.getInitialState();
    
    this.actions = {
      ...this.actions,
      ...this.defineActions()
    };
    
    this.reducers = this.initReducers();
  }
  
  getInitialState () {
    return {};
  }
  
  defineActions () {
    return {};
  }
  
  defineReducers () {
    return {};
  }
  
  initReducers () {
    const reducers = this.addNamespaceToReducers(this.defineReducers());
    return this.createReducers(reducers)
  }
  
  addNamespaceToReducers (reducers: IReducers) {
    const result: IReducers = {};
    
    Object.keys(reducers).forEach((actionName: string) => {
      result[this.ns(actionName)] = reducers[actionName]
    });
    
    return result
  }
  
  ns (actionName: string): string {
    return `${this.namespace} ${actionName}`;
  }
  
  createAction (actionName: string) {
    const type = this.ns(actionName);
  
    function actionCreator (...args: any[]): AnyAction {
      const action: AnyAction = { type };
    
      action.payload = args[0];
    
      return action;
    }
  
    return actionCreator;
  }
  
  createReducers (reducers: IReducers) {
    const _reducers = Object.keys(reducers).map(type => {
      return this.createReducer(type, reducers[type]);
    });
    
    const reducer = reduceReducers(_reducers, this.initialState);
    return (state = this.initialState, action: any) => reducer(state, action);
  }
  
  createReducer (type: string, reducer: any) {
    return (state = this.initialState, action: any) => {
      const { type: actionType } = action;
      if (!actionType || actionType !== type) {
        return state;
      }
  
      return reducer(state, action);
    }
  }
}

export default ReduxModule;
