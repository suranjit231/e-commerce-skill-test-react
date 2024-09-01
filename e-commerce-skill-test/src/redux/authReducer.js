import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setError, clearError } from "./errorReducer";
import { setLoading, clearLoading } from "./loadingReducer";
import { auth } from "../firebaseInit";

// Initial state
const initialState = {
  isLoggedIn: false,
  isSignup: false,
  user: null,
  loading: false,
};

// User signup with Firebase
export const signupApiAsync = createAsyncThunk(
  "auth/signupApi",
  async (arg, thunkAPI) => {
    const { email, password } = arg;

    try {
      thunkAPI.dispatch(setLoading());
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create a new object with _id mapped to uid
      const mappedUser = {
        _id: user.uid,
        email: user.email,
        // add other properties if needed
      };

      return { user: mappedUser };
    } catch (error) {
      console.log("error.response.data.message:", error.message)
      thunkAPI.dispatch(setError(error.code));
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(clearLoading());
    }
  }
);

// User signin with Firebase
export const signinApiAsync = createAsyncThunk(
  "auth/signinApi",
  async (arg, thunkAPI) => {
    const { email, password } = arg;

    console.log("arg in signin api: ", arg);

    try {
      thunkAPI.dispatch(setLoading());
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a new object with _id mapped to uid
      const mappedUser = {
        _id: user.uid,
        email: user.email,
        
      };

      // Store user credentials in localStorage
      localStorage.setItem("user", JSON.stringify(mappedUser));

      console.log("user after login: ", mappedUser);
      return { user: mappedUser };
    } catch (error) {
     
      thunkAPI.dispatch(setError(error.code));
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(clearLoading());
    }
  }
);

// User logout with Firebase
export const logoutApiAsync = createAsyncThunk(
  "auth/logoutAsync",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading());
      await signOut(auth);
       // Clear user credentials from localStorage
       localStorage.removeItem("user");
      return {success:true};
    } catch (error) {
      thunkAPI.dispatch(setError(error.code));
      return thunkAPI.rejectWithValue(error.message);
    } finally {
      thunkAPI.dispatch(clearLoading());
    }
  }
);

// Check if user is logged in using Firebase
export const checkIsLoginAsync = createAsyncThunk(
  "auth/isLoginAsync",
  async (_, thunkAPI) => {
    
    try {
      
      // Retrieve user credentials from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const mappedUser = JSON.parse(storedUser);
        return { user: mappedUser };
      } else {
        return thunkAPI.rejectWithValue("No user logged in");
      }
    } catch (error) {
      thunkAPI.dispatch(setError("Error checking login status"));
      return thunkAPI.rejectWithValue("Error checking login status");
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.loading = false;
    },
    setAuthLogout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupApiAsync.fulfilled, (state) => {
        state.isSignup = true;
      })
      .addCase(signinApiAsync.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user; // This will now have _id instead of uid
      })
      .addCase(logoutApiAsync.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      //======== checkend login =========//
      .addCase(checkIsLoginAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkIsLoginAsync.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(checkIsLoginAsync.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.loading = false;
      });
  },
});

// Exporting actions and reducer
export const authReducer = authSlice.reducer;
export const { setAuthState, setAuthLogout } = authSlice.actions;
export const authSelector = (state) => state.authReducer;



