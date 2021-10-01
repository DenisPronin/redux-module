import { ActionCreator, ActionCreatorsMapObject, AnyAction, CombinedState, Reducer, ReducersMapObject } from "redux";
import { reduceReducers } from "./createReducer";

class ReduxModule {
  
  namespace: string = '';
  actions: ActionCreatorsMapObject = {}
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
    const _reducers = Object.keys(reducers).map((actionName: string) => {
      const type = this.ns(actionName);
      this.actions[actionName] = this.createAction(actionName);
      return this.createReducer(type, reducers[actionName]);
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
}

export default ReduxModule;
