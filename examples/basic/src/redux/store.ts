import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { rootReducers } from "./root";

export default function configureStore(initialState: any, rootReducer: any) {
  const hasReduxExtension = typeof (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function'

  const composeEnhancers = hasReduxExtension ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
  const middleware = applyMiddleware(thunk)

  const createStoreWithMiddleware = composeEnhancers(middleware)

  return createStoreWithMiddleware(createStore)(rootReducer, initialState)
}

export const store = configureStore({}, rootReducers)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
