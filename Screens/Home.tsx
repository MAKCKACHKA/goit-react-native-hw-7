import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Button,
  Pressable,
  ScrollView,
} from "react-native";
import {
  logOutSvg,
  gridSvg,
  plusBtnSvg,
  userSvg,
  arrowLeft,
} from "../assets/svgJS/svg";
import { SvgXml } from "react-native-svg";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CreatePostsScreen from "./CreatePostsScreen";
import PostsScreen from "./PostsScreen";
import ProfileScreen from "./ProfileScreen";

import { logOut } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { changeUid, changeUserActive } from "../redux/authSlice";

const Tabs = createBottomTabNavigator();

const Home = ({ navigation }) => {
  const dispatch = useDispatch();

  const { uid, userActive } = useSelector((state: any) => state.auth);
  const setlogOut = (value) => dispatch(changeUid(value));
  const setUserActive = (value) => dispatch(changeUserActive(value));

  useEffect(() => {
    if (!userActive) {
      navigation.navigate("Login");
    }
  }, [userActive, navigation]);

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          if (route.name === "Публікації") {
            return <SvgXml xml={gridSvg} style={styles.svg} />;
          } else if (route.name === "Створити пост") {
            return <SvgXml xml={plusBtnSvg} style={styles.svg} />;
          } else if (route.name === "Профіль") {
            return <SvgXml xml={userSvg} style={styles.svg} />;
          }
        },
        tabBarStyle: styles.toolbar,
        headerTitleAlign: "center",
        tabBarShowLabel: false,
      })}
    >
      <Tabs.Screen
        name="Публікації"
        component={PostsScreen}
        initialParams={{ name: "", location: "", Image: "" }}
        options={{
          headerTitleStyle: {
            alignSelf: "center",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                logOut(dispatch);
                setlogOut("");
                setUserActive(false);
                // navigation.navigate("Login");
              }}
              style={styles.createBtn}
            >
              <SvgXml xml={logOutSvg} style={styles.svg} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="Створити пост"
        component={CreatePostsScreen}
        options={{
          headerTitleStyle: {},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Публікації")}
              style={{ left: 20 }}
            >
              <SvgXml xml={arrowLeft} style={styles.svg} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="Профіль"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  svg: {
    width: 24,
    height: 24,
    alignSelf: "center",
  },

  createBtn: {
    width: 70,
    height: 40,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    height: 75,
  },
});

export default Home;
