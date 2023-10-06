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
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import {
  changeLogin,
  changeEmail,
  changePassword,
  changeUid,
  changeUserActive,
} from "../redux/authSlice";
import { handleRegistration, signUp } from "../config";

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false);
  const [loginFocused, setLoginFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { login, email, password, uid, userActive } = useSelector(
    (state: any) => state.auth
  );

  const dispatch = useDispatch();
  const setLogin = (value) => dispatch(changeLogin(value));
  const setEmail = (value) => dispatch(changeEmail(value));
  const setPassword = (value) => dispatch(changePassword(value));
  const setUserActive = (value) => dispatch(changeUserActive(value));

  useEffect(() => {
    if (uid !== "" && uid !== null) {
      setUserActive(true);
    }
    if (userActive) {
      navigation.navigate("Home" as never);
    }
  }, [userActive, navigation, uid]);

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.backgroundImage}
      resizeMode="stretch"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.wrapper}>
          <View style={styles.container}>
            <Image
              style={styles.miniImage}
              source={require("../assets/favicon.png")}
            />
            <Text style={styles.title}>Реєстрація</Text>
            <KeyboardAvoidingView
              behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
              <TextInput
                value={login}
                style={[styles.input, loginFocused && styles.focusedInput]}
                placeholder="Логін"
                onChangeText={setLogin}
                onFocus={() => setLoginFocused(true)}
                onBlur={() => setLoginFocused(false)}
              />
              <TextInput
                value={email}
                style={[
                  styles.input,
                  emailFocused === true && styles.focusedInput,
                ]}
                placeholder="Адреса електронної пошти"
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
              <View
                style={[
                  styles.passwordContainer,
                  passwordFocused === true && styles.focusedInput,
                ]}
              >
                <TextInput
                  value={password}
                  style={styles.passwordInput}
                  placeholder="Пароль"
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <Pressable
                  style={styles.showPasswordButton}
                  onPress={togglePasswordVisibility}
                >
                  <Text style={styles.showPasswordText}>
                    {showPassword ? "Приховати" : "Показати"}
                  </Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>

            <Pressable
              style={styles.registerButton}
              onPress={() => {
                handleRegistration(email, password, login);
                setTimeout(() => {
                  signUp(dispatch, email, password);
                }, 1500);

                setTimeout(() => {
                  if (uid !== "" && uid !== null) {
                    navigation.navigate("Home" as never);
                  }
                }, 2200);
                setTimeout(() => {
                  // setEmail("");
                }, 5000);
              }}
            >
              <Text style={styles.registerButtonText}>Зареєструватися</Text>
            </Pressable>
            <Text
              onPress={() => navigation.navigate("Login" as never)}
              style={styles.loginLink}
            >
              Вже є акаунт? Увійти
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  miniImage: {
    alignSelf: "center",
    width: 120,
    height: 120,
    flexShrink: 0,
    borderRadius: 20,
    position: "absolute",
    top: -63,
    backgroundColor: "black",
  },

  wrapper: {
    flex: 1,
    alignItems: "center",
    width: "100%",

    justifyContent: "flex-end",
    flexShrink: 0,
  },
  container: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
    width: "100%",
    height: 549,

    flexShrink: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontFamily: "Roboto-Regular",
    marginTop: 92,
    fontWeight: "bold",

    marginBottom: 20,

    color: "#212121",
    textAlign: "center",
    fontStyle: "normal",
    fontSize: 30,
  },
  input: {
    flexShrink: 0,
    width: 343,
    height: 50,
    padding: 10,

    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",

    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  passwordContainer: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,

    flexDirection: "row",
    alignItems: "center",

    width: 343,
    height: 50,
    flexShrink: 0,
  },
  passwordInput: {
    width: 343,
    height: 50,
    flexShrink: 0,

    fontFamily: "Roboto-Regular",

    fontSize: 16,
    flex: 1,
    padding: 10,
  },
  showPasswordText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#1B4371",
  },
  showPasswordButton: {
    padding: 15,
  },
  focusedInput: {
    borderColor: "#FF6C00",
  },
  registerButton: {
    padding: 15,
    marginTop: 43,

    display: "flex",
    width: 343,
    flexDirection: "column",
    alignItems: "center",
    gap: 12,

    borderRadius: 100,
    backgroundColor: "#FF6C00",
  },
  registerButtonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
  },
  loginLink: {
    textAlign: "center",
    marginTop: 16,
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
  },
});

export default RegistrationScreen;
