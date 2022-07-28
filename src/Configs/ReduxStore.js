import rootReducer from "../Redux/index";
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'scandiweb-store',
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer);
const persistedStore = persistStore(store);

export default store;
export { persistedStore };
