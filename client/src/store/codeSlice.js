import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  code: "",
  language: "",
  codeLoading: false,
  codeOutput: "",
  jobId: "",
  userSubmission: [],
  loading: false,
};

const URL = "http://localhost:5000/api/v1";

export const asyncProgrammemRun = createAsyncThunk(
  "code/runProgramme",
  async ({ code, language, userInput }) => {
    const res = await fetch(`${URL}/code/run`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        language: language,
        userInput,
      }),
    });
    const data = await res.json();

    if (res.ok) return data.jobId;
    else {
      toast.error(data);
    }
  }
);

export const asyncProgrammemSubmit = createAsyncThunk(
  "code/submitProgramme",
  async ({ code, language, userInput, problemId, userId }) => {
    const res = await fetch(`${URL}/code/submit`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        language: language,
        userInput,
        problemId,
        userId,
      }),
    });
    const data = await res.json();

    if (res.ok) return data.jobId;
    else {
      toast.error(data);
    }
  }
);

export const asyncSubmissionGet = createAsyncThunk(
  "code/getSubmission",
  async (problemId) => {
    const res = await fetch(`${URL}/code/submission/${problemId}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) return data;
    else toast.error(data);
  }
);

export const asyncSubmissionDownload = createAsyncThunk(
  "code/downloadSubmission",
  async (jobId) => {
    window.open(`${URL}/code/download/${jobId}`);
  }
);

export const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    setCurrentCode: (state, action) => {
      state.code = action.payload;
    },
    setCurrentLang: (state, action) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncProgrammemRun.pending, (state) => {
        state.status = "loading";
      })
      .addCase(asyncProgrammemRun.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobId = action.payload.jobId;
      })
      .addCase(asyncProgrammemRun.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(asyncProgrammemSubmit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(asyncProgrammemSubmit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobId = action.payload.jobId;
      })
      .addCase(asyncProgrammemSubmit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCurrentCode, setCurrentLang } = codeSlice.actions;

export default codeSlice.reducer;
