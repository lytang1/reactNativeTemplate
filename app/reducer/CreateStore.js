import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import Config from '../Config/DebugConfig';
// import RehydrationServices from 
import ReduxPersist from '../Config/ReduxPersist';
import AppStateEnhancer from './Enhancers/AppStateEnhancer';

export default (rootReducer, rootSaga) =>{
	/* Redux Configuration */
	const middleware = [];
	const enhancers = [];

	/* Saga Middleware */
	const sagaMonitor = __DEV__ ? console.tron.createSagaMonitor() : null;
	const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
	middleware.push(sagaMiddleware);
	
	/*  Assemble Middleware  */

	enhancers.push(AppStateEnhancer());

	enhancers.push(applyMiddleware(...middleware));


	/* AutoRehydrate Enhancer */

	// add the autoRehydrate enhancer
	if(ReduxPersist.active){
		enhancers.push(autoRehydrate());
	}

	//if Reactotron is enabled (default for __DEV__) we will create store through reactotron
	const createAppropriateStore = Config.userReactotron ? console.tron.createStore : createStore;
	const store = createAppropriateStore(rootReducer, compose(...enhancers));

	// configure persistStore and check reducer version number
  if (ReduxPersist.active) {
    RehydrationServices.updateReducers(store);
  }

  // kick off root saga
  sagaMiddleware.run(rootSaga(store));

  return store;

}