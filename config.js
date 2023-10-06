import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
  query,
  where,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  changePosts,
  changeUid,
  changeNickName,
  changeUserPosts,
  updateUserProfile,
} from "./redux/authSlice";

const firebaseConfig = {
  apiKey: "AIzaSyBNLU6QRyBo-vfZAzYVxwl3AIlgJH7x4qo",
  authDomain: "react-native-hw-4fea8.firebaseapp.com",
  databaseURL:
    "https://react-native-hw-4fea8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react-native-hw-4fea8",
  storageBucket: "react-native-hw-4fea8.appspot.com",
  messagingSenderId: "1046278970744",
  appId: "1:1046278970744:web:f0dd789fc7053d2b51bc8d",
};

const app = initializeApp(firebaseConfig);

// const auth = getAuth();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export const handleRegistration = async (email, password, login) => {
  try {
    const createUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(createUser.user, {
      displayName: login,
    });

    const db = getFirestore(app);
    const firestor = getFirestore();

    const docData = {
      uid: createUser.user.uid,
      displayName: createUser.user.displayName,
      email: createUser.user.email,
      photoURL: createUser.user.photoURL,
    };
    setDoc(doc(db, "users", createUser.user.uid), docData);
    console.log("!!!!!!Успішна реєстрація:", createUser.user.uid);
  } catch {
    (error) => {
      // console.log(auth);
      console.error("Помилка реєстрації:", error);
    };
  }
};

export const signUp = async (dispatch, email, password) => {
  try {
    const signUp = await signInWithEmailAndPassword(auth, email, password);
    // console.log(signUp.user);
    console.log("!!!!!!!!!Успішний вхід:", signUp.user.uid);

    dispatch(changeNickName(signUp.user.displayName));
    dispatch(changeUid(signUp.user.uid));
  } catch (error) {
    console.error("Помилка входу:", error);
  }
};

export const logOut = async (dispatch) => {
  await signOut(auth);
  dispatch(changePosts(null));
  dispatch(changeUserPosts(null));
};

export const createPost = async (newPost) => {
  try {
    const db = getFirestore(app);

    await setDoc(doc(db, "posts", newPost.id), newPost);
    console.log("createPost: Пост створено", newPost);
  } catch (error) {
    console.error("createPost: Помилка створення посту", error);
  }
};

export const getPosts = async (setPosts) => {
  try {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, "posts"));

    const posts = [];
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      posts.push(postData);
      // console.log(doc.data());
    });
    setPosts(posts);
  } catch (error) {
    console.error("Помилка отримання постів користувача:", error);
  }
};

export const getUserPosts = async (setUserPosts, uid) => {
  try {
    const db = getFirestore(app);
    const q = query(collection(db, "posts"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      posts.push(postData);
    });

    setUserPosts(posts);
  } catch (error) {
    console.error("Помилка отримання постів користувача:", error);
  }
};

export const getComents = async (setComents, id) => {
  try {
    const db = getFirestore(app);
    const q = query(collection(db, "posts"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      posts.push(postData);
    });
    setComents(posts);
  } catch (error) {
    console.error("Помилка отримання постів користувача:", error);
  }
};

export const addComment = (id, newComent) => {
  try {
    const db = getFirestore(app);
    updateDoc(doc(db, "posts", id), {
      coments: arrayUnion(newComent),
    });
    // console.log(newComent);
    console.log("addPost Коментар успішно додані до вмісту posts.");
  } catch (error) {
    console.error(
      "addPost Помилка додавання Коментара до вмісту posts:",
      error
    );
  }
};

export const likePost = async (Id) => {
  try {
    const db = getFirestore(app);
    const querySnapshot = doc(db, "posts", Id);
    const postDoc = await getDoc(querySnapshot);
    const currentLikes = postDoc.data().likes || 0;
    const newLikes = currentLikes + 1;
    await updateDoc(querySnapshot, { likes: newLikes });
  } catch (error) {
    console.error("Помилка добавлення лайку:", error);
  }
};
