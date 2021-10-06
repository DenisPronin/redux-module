import {
  ActionCreator,
  ActionCreatorsMapObject,
  AnyAction,
  CombinedState,
  Dispatch,
  Reducer,
  ReducersMapObject
} from "redux";
import { ThunkAction } from "redux-thunk";
import _flow from "lodash/fp/flow";
import _set from "lodash/fp/set";
import _get from 'lodash/get';
import _update from 'lodash/fp/update';
import _assign from 'lodash/fp/assign';
import { reduceReducers } from "./reduceReducers";

interface IReduxModule {
  namespace: string;
  actions: ActionCreatorsMapObject;
  reducers: Reducer;
  initialState: CombinedState<any>;
  init: () => void;
  getInitialState: () => CombinedState<any>;
  defineActions: () => IActions;
  defineReducers: () => ReducersMapObject;
  createAction: (actionName: string) => ActionCreator<AnyAction>;
  setIn: (actionName: string, path: string) => ActionCreator<AnyAction>;
  mergeIn: (actionName: string, path: string) => ActionCreator<AnyAction>;
  toggleIn: (actionName: string, path: string) => ActionCreator<AnyAction>;
  resetToInitialState: (actionName: string) => ActionCreator<AnyAction>;
  thunkAction (options: IThunkOptions): ActionCreator<
    ThunkAction<Promise<AnyAction>, CombinedState<any>, void, AnyAction>
  >;
}

export interface IShortAction {
  method: 'setIn' | 'mergeIn' | 'toggleIn';
  path: string;
}

interface IActions<A = any> {
  [key: string]: ActionCreator<A> | IShortAction;
}

interface IThunkOptions {
  actionName: string;
  actionMethod: (...args: any[]) => Promise<any>;
  pendingAction?: ActionCreator<AnyAction>;
  pendingPath?: string;
  fulfilledMethod?: 'setIn' | 'mergeIn';
  fulfilledPath?: string;
  fulfilledAction?: ActionCreator<AnyAction>;
  rejectedPath?: string;
  rejectedAction?: ActionCreator<AnyAction>;
  serialize?: (args: any[], getState: () => CombinedState<any>) => any[],
  normalize?: (response: any) => any
}

class ReduxModule implements IReduxModule {
  
  namespace: string = '';
  actions: ActionCreatorsMapObject = {}
  reducersFromActions: ReducersMapObject = {};
  reducers: Reducer = () => {}
  initialState: CombinedState<any> = {}
  
  constructor () {
    this.namespace = `[${this.constructor.name}]`;
  }
  
  init (): void {
    this.initialState = this.getInitialState();
    
    this.actions = this.initActions();
    
    this.reducers = this.initReducers();
  }
  
  getInitialState (): CombinedState<any> {
    return {};
  }
  
  defineActions (): IActions {
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
  
  initActions (): ActionCreatorsMapObject {
    const actions = this.defineActions();
    
    const actionCreators: ActionCreatorsMapObject = {};
    
    Object.keys(actions).forEach((actionName: string) => {
      let action = actions[actionName];
      if (typeof action === 'object') {
        action = this[action.method](actionName, action.path);
      }
      
      actionCreators[actionName] = action;
    });
    
    return actionCreators;
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
  
  addReducerFromAction (actionName: string, reducerFn: Reducer): void {
    this.reducersFromActions[actionName] = reducerFn;
  }
  
  createHandler (actionName: string, reducerFn: Reducer): ActionCreator<AnyAction> {
    const action = this.createAction(actionName);
    this.addReducerFromAction(actionName, reducerFn)
    return action;
  }
  
  setInReducer (path: string): Reducer {
    return (state: CombinedState<any>, action: AnyAction) => {
      const pathArr = this._parsePath(path, action.payload);
      return _flow(_set(pathArr, action.payload.value))(state);
    }
  }
  
  mergeInReducer (path: string): Reducer {
    return (state: CombinedState<any>, action: AnyAction) => {
      const pathArr = this._parsePath(path, action.payload);
      return _flow(_update(pathArr, (obj) => {
        return _assign(obj, action.payload.value);
      }))(state);
    }
  }
  
  toggleInReducer (path: string): Reducer {
    return (state: CombinedState<any>, action: AnyAction) => {
      const pathArr = this._parsePath(path, action.payload);
      return _flow(_set(pathArr, !_get(state, pathArr)))(state);
    }
  }
  
  setIn (actionName: string, path: string): ActionCreator<AnyAction> {
    return this.createHandler(actionName, this.setInReducer(path));
  }
  
  mergeIn (actionName: string, path: string): ActionCreator<AnyAction> {
    return this.createHandler(actionName, this.mergeInReducer(path));
  }
  
  toggleIn (actionName: string, path: string): ActionCreator<AnyAction> {
    return this.createHandler(actionName, this.toggleInReducer(path));
  }
  
  resetToInitialState (actionName: string): ActionCreator<AnyAction> {
    return this.createHandler(actionName, () => this.initialState);
  }
  
  thunkAction (options: IThunkOptions): ActionCreator<
    ThunkAction<Promise<AnyAction>, CombinedState<any>, void, AnyAction>
  > {
    const {
      actionName,
      actionMethod,
      pendingAction,
      pendingPath,
      fulfilledMethod = 'setIn',
      fulfilledPath = '',
      fulfilledAction = null,
      rejectedPath = '',
      rejectedAction = null,
      serialize,
      normalize
    } = options;
    
    let _pendingAction = pendingAction;
    if (pendingPath) {
      _pendingAction = this.setIn(`${actionName} pending`, pendingPath);
    }
    
    let _fulfilledAction = fulfilledAction;
    if (fulfilledPath) {
      _fulfilledAction = this[fulfilledMethod](`${actionName} fulfilled`, fulfilledPath);
    }
    
    let _rejectedAction = rejectedAction;
    if (rejectedPath) {
      _rejectedAction = this.setIn(`${actionName} rejected`, rejectedPath);
    }
    
    return (...args: any) => (dispatch: Dispatch, getState: () => CombinedState<any>) => {
      let methodOptions = args;
      if (serialize) {
        methodOptions = serialize(methodOptions, getState);
      }
      
      if (_pendingAction) {
        dispatch(_pendingAction({ value: true }));
      }
      
      return actionMethod(...methodOptions)
        .then((_response: any) => {
          let response = _response;
          if (normalize) {
            response = normalize(response);
          }
          
          if (_fulfilledAction) {
            dispatch(_fulfilledAction({ value: response, options: methodOptions }));
          }
          
          if (_pendingAction) {
            dispatch(_pendingAction({ value: false }));
          }
          
          return response
        })
        .catch((error: any) => {
          console.error('Error in thunkAction()', error);
          
          if (_rejectedAction) {
            dispatch(_rejectedAction({ value: error, options: methodOptions }));
          }
          
          if (_pendingAction) {
            dispatch(_pendingAction({ value: false }));
          }
          
          throw error;
        });
    }
  }
  
  /*
  * Utils
  * */
  _paramReg = /{(.*?)}/g
  
  _parsePath(path: string, payload: any): string[] {
    return path.split('.').map(item => {
      return item.replace(this._paramReg, (_, field) => payload[field])
    });
  }
}

export default ReduxModule;
