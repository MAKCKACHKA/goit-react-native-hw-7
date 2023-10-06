import { createSlice } from "@reduxjs/toolkit";

const authState = {
  login: "",
  email: "",
  password: "",

  nickName: "",
  uid: "",
  userActive: false,

  posts: null,
  userPosts: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: authState,
  reducers: {
    changeUid: (state, action) => {
      state.uid = action.payload;
    },
    changeNickName: (state, action) => {
      state.nickName = action.payload;
    },
    changePosts: (state, action) => {
      state.posts = action.payload;
    },
    changeUserPosts: (state, action) => {
      state.userPosts = action.payload;
    },
    changeLogin: (state, action) => {
      state.login = action.payload;
    },
    changeEmail: (state, action) => {
      state.email = action.payload;
    },
    changePassword: (state, action) => {
      state.password = action.payload;
    },
    changeUserActive: (state, action) => {
      state.userActive = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;

export const {
  changeLogin,
  changeEmail,
  changePassword,

  changeUserActive,
  changeUid,
  changeNickName,

  changePosts,
  changeUserPosts,
} = authSlice.actions;
