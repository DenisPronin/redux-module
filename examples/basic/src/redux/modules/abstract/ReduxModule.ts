import { ActionCreator, ActionCreatorsMapObject, AnyAction, CombinedState, Reducer, ReducersMapObject } from "redux";
import { reduceReducers } from "./createReducer";
import _flow from "lodash/fp/flow";
import _set from "lodash/fp/set";

class ReduxModule {
  
  namespace: string = '';
  actions: ActionCreatorsMapObject = {}
  reducersFromActions: ReducersMapObject = {};
  reducers: Reducer = () => {}
  initialState: CombinedState<any> = {}
  
  constructor () {
    this.namespace = `[${this.constructor.name}]`;
  }
  
  init () {
    this.initialState = this.getInitialState();
    
    this.actions = this.defineActions();
    
    this.reducers = this.initReducers();
  }
  
  getInitialState (): CombinedState<any> {
    return {};
  }
  
  defineActions (): ActionCreatorsMapObject {
    return {};
  }
  
  defineReducers (): ReducersMapObject {
    return {};
  }
  
  ns (actionName: string): string {
    return `${this.namespace} ${actionName}`;
  }
  
  createAction (actionName: string): ActionCreator<AnyAction> {
    const type = this.ns(actionName);
    
    function actionCreator (...args: any[]): AnyAction {
      const action: AnyAction = { type };
      
      action.payload = args[0];
      
      return action;
    }
    
    return actionCreator;
  }
  
  initReducers (): Reducer {
    return this.createReducers(this.defineReducers())
  }
  
  createReducers (reducers: ReducersMapObject): Reducer {
    const allReducers = Object.assign({}, reducers, this.reducersFromActions);
    const _reducers = Object.keys(allReducers).map((actionName: string) => {
      const type = this.ns(actionName);
      if (!this.actions[actionName]) {
        this.actions[actionName] = this.createAction(actionName);
      }
      return this.createReducer(type, allReducers[actionName]);
    });
    
    const reducer = reduceReducers(_reducers, this.initialState);
    return (state = this.initialState, action: any) => reducer(state, action);
  }
  
  createReducer (type: string, reducer: Reducer): Reducer {
    return (state = this.initialState, action: any) => {
      const { type: actionType } = action;
      if (!actionType || actionType !== type) {
        return state;
      }
  
      return reducer(state, action);
    }
  }
  
  addReducerFromAction (actionName: string, reducerFn: Reducer) {
    this.reducersFromActions[actionName] = reducerFn;
  }
  
  createHandler (actionName: string, reducerFn: Reducer) {
    const action = this.createAction(actionName);
    this.addReducerFromAction(actionName, reducerFn)
    return action;
  }
  
  setInReducer (path: string) {
    return (state: CombinedState<any>, action: any) => {
      const pathArr = this._parsePath(path, action.payload);
      return _flow(_set(pathArr, action.payload.value))(state);
    }
  }
  
  setIn (actionName: string, path: string) {
    return this.createHandler(actionName, this.setInReducer(path))
  }
  
  /*
  * Utils
  * */
  _paramReg = /\{(.*?)}/g
  
  _getPathVars (path: string): any[] {
    const pathVars: any[] = [];
    path.split('.').forEach(item => {
      if (item.match(this._paramReg)) {
        const field = item.replace(this._paramReg, (match, _field) => _field);
        pathVars.push(field);
      }
    });
    return pathVars;
  }
  
  _parsePath(path: string, payload: any) {
    return path.split('.').map(item => {
      return item.replace(this._paramReg, (match, field) => payload[field])
    });
  }
}

export default ReduxModule;
