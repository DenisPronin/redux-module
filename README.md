# Redux module

> The wrapper for redux to reduce boilerplate.

### Installation
> npm install --save redux-module-wrapper

### What's included?

- [Duck module concept](https://github.com/erikras/ducks-modular-redux)
- Class notation, so you can extend redux-module and your own modules
- Simple syntax
- Compatible with usual redux code (you can create constants, action creators, reducers)
- add namespace to all action
- You can write only reducer and action will be creating automatically.
- Setters. A lot of actions-reducers are just a setters. You want set some value in state.
So we have a simple methods for this: setIn, mergeIn, toggleIn, which automatically create action and reducer.
- Method for api call actions.

### USAGE
```js
class Example extends ReduxModule {
  getInitialState () {
    return {
      value: 0,
      data: {
        flag: false,
        test: {
          value: 0
        }
      }
    };
  }
  
  defineActions () {
    // simple redux action
    const someAction = this.createAction('ACTION_NAME');
    // setIn - setter, which create action and reducer.
    const setValueByPath = this.setIn('setValueByPath', 'data.test.value');
    // you can add variables in path like:
    const setVarPathValue = this.setIn('setVarPathValue', 'data.{field}.value');
    // also add different notation, where you don't need to use action name
    // const setVarPathValue = {method: 'setIn', path: 'data.{field}.value'}
    
    
    return {
      someAction,
      setValueByPath,
      setVarPathValue,
      // 'mergeIn' is like 'setIn', but for merging objects
      mergeDataValue: { method: 'mergeIn', path: 'data.{valueField}' },
      // toggleIn - for toggling boolean flags
      toggleFlag: { method: 'toggleIn', path: 'data.flag' },
    };
  }
  
  defineReducers () {
    return {
      // simple reducer
      'ACTION_NAME': (state) => state,
  
      // action will creating automatically
      increment: (state) => {
        return {
          ...state,
          value: state.value + 1
        };
      }
    };
  }
}

const example = new Example();
example.init();

export const {
  increment,
  setValueByPath,
  setVarPathValue,
  mergeDataValue
} = example.actions;

export default example.reducers;

// Call action
dispatch(setValueByPath({value: 5}));
dispatch(setVarPathValue({value: 5, field: 'test'}));
dispatch(mergeDataValue({value: {value: 10}, valueField: 'test'}));
```
### ASYNC EXAMPLE
Actions for sending ajax requests to server are usually work in same way.
1. Set isPending flag for loader
2. Send ajax request to api
3. If success, call fulfilled action and hide loader
4. If error, call rejected action and hide loader

When you write 10 such actions in a row - it's frustrated.
So 'thunkAction' is implement this algorithm.

```typescript
interface IThunkOptions {
  actionName: string;
  actionMethod: (...args: any[]) => Promise<any>; // method for api call, returns promise
  pendingPath?: string; // if action for toggle loader is just a setter, then you can just write path to isPending flag
  pendingAction?: ActionCreator<AnyAction>; // // if action for toggle loader is complex, you can write your own action
  fulfilledMethod?: 'setIn' | 'mergeIn'; // setIn - will replace data, mergeIn - will merge
  fulfilledPath?: string; // path for setting response form server.
  fulfilledAction?: ActionCreator<AnyAction>; // custom fulfilled action 
  rejectedPath?: string; // path for error
  rejectedAction?: ActionCreator<AnyAction>; // custom rejected action
  serialize?: (args: any[], getState: () => CombinedState<any>) => any[], // serialize data befort send them to server
  normalize?: (response: any) => any // modify response from server
}
```

```js
class User extends ReduxModule {
  getInitialState () {
    return {
      user: {
        isPending: false,
        data: null,
        error: ''
      }
    };
  }
  
  defineActions () {
    const getUser = this.thunkAction({
      actionName: 'getUser',
      actionMethod: githubApi.getUser,
      pendingPath: 'user.isPending',
      fulfilledMethod: 'setIn',
      fulfilledPath: 'user.data',
      normalize: (response) => response.data
    });
    
    return {
      getUser
    };
  }
  
  defineReducers () {
  }
}

const user = new User();
user.init();

export const {
  getUser,
} = user.actions;

export default user.reducers;
```

### API
coming soon
