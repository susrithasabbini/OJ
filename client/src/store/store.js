import { configureStore } from "@reduxjs/toolkit";

import codeSlice from "./codeSlice";
import { problemStatusApi } from "./services/problemStatus";

const store = configureStore({
  reducer: {
    code: codeSlice,
    [problemStatusApi.reducerPath]: problemStatusApi.reducer,
  },
  // TODO: uncomment devTools: false before deployment
  // devTools: false,

  // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(problemStatusApi.middleware),
});

export default store;
