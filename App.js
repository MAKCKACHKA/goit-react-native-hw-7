import "react-native-gesture-handler";

import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";

// import { SvgXml } from "react-native-svg";

import LoginScreen from "./Screens/LoginScreen";
import RegistrationScreen from "./Screens/RegistrationScreen";
import Home from "./Screens/Home";
import CommentsScreen from "./Screens/CommentsScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import CreatePostsScreen from "./Screens/CreatePostsScreen";

import PostsScreen from "./Screens/PostsScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MapScreen from "./Screens/MapScreen";

import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const MainStack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <MainStack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerTitleAlign: "center",
              headerShown: false,
            }}
          >
            <MainStack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <MainStack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{
                headerShown: false,
              }}
            />
            <MainStack.Screen name="Home" component={Home} />
            <MainStack.Screen name="Коментарі" component={CommentsScreen} />
            <MainStack.Screen
              name="MapScreen"
              component={MapScreen}
              initialParams={{ location: "", Image: "" }}
            />

            <MainStack.Screen name="Profile" component={ProfileScreen} />
            <MainStack.Screen
              name="PostsScreen"
              component={PostsScreen}
              initialParams={{ name: "", location: "", Image: "" }}
            />
            <MainStack.Screen
              name="Create Posts"
              component={CreatePostsScreen}
            />
          </MainStack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
