import { configureStore , combineReducers } from '@reduxjs/toolkit'
import userReducer from "./User/userSlice.js"
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import themeReducer from './theme/themeSlice.js'

const rootReducer =combineReducers({
    user:userReducer,
    theme:themeReducer
})
const persistConfig={
    key:'root',
    storage,
    version:1,
};

const persistedReducer=persistReducer(persistConfig,rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=> getDefaultMiddleware({serializableCheck:false}),
})

export const persistor=persistStore(store);
