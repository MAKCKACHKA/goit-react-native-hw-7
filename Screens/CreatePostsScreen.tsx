import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  Image,
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";

import Svg, { Path } from "react-native-svg";
import {
  mapPin,
  arrowLeft,
  trash,
  camera,
  cameraBlack,
} from "../assets/svgJS/svg";
import { SvgXml } from "react-native-svg";

import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

// import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { createPost, getPosts, getUserPosts } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { changePosts, changeUserPosts } from "../redux/authSlice";

const CreatePostsScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");

  const [nameFocused, setNameFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);

  const [userLocation, setUserLocation] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       alert("Доступ до геолокації відхилено.");
  //       return;
  //     }
  //     let location = await Location.getCurrentPositionAsync({});
  //     setUserLocation(location);
  //   })();
  // }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Доступ до геолокації відхилено.");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location);
  };

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    if (hasPermission === false) {
      alert("No access to camera");
    }
  }, [Camera.requestCameraPermissionsAsync()]);

  const handleTakePicture = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      await MediaLibrary.createAssetAsync(uri);
      setImage(uri);
    }
  };

  // useEffect(() => {
  //   navigation.setOptions({
  //     // headerShown: false,
  //     // title: "sadasd",
  //   });
  // }, []);

  const { uid, nickName } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  // const [userPosts, setUserPosts] = useState(null);
  // const [posts, setPosts] = useState([]);
  const setPosts = (value) => dispatch(changePosts(value));
  const setUserPosts = (value) => dispatch(changeUserPosts(value));

  const usePosts = () => {
    getPosts(setPosts);
    getUserPosts(setUserPosts, uid);
  };

  useEffect(() => {
    usePosts();
    // getCurrentLocation();
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [location]);

  const handlePublish = async () => {
    // getCurrentLocation();

    setTimeout(() => {
      createPost({
        nickName: nickName,
        uid: uid,
        coments: [],
        id: Date.now().toString(),
        name: name,
        location: location,
        userLocation: userLocation,
        image: image,
        likes: 0,
      });
    }, 20);

    setTimeout(() => {
      usePosts();

      navigation.navigate("Публікації");
      setName("");
      setImage("");
      setLocation("");
    }, 200);

    // setUserLocation(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.publication}>
            <View style={styles.imageholder}>
              {image ? (
                <Image style={styles.publicationImg} source={{ uri: image }} />
              ) : (
                <Camera
                  style={styles.publicationImg}
                  // type={Camera.Constants.Type.back}
                  ref={setCameraRef}
                />
              )}
              {!image && (
                <Pressable
                  style={styles.cameraHolder}
                  onPress={handleTakePicture}
                >
                  <SvgXml xml={cameraBlack} style={[styles.svg]} />
                </Pressable>
              )}
            </View>
            {image === "" ? (
              <Text style={styles.photoTxt}>Завантажте фото</Text>
            ) : (
              <Text style={styles.photoTxt}>Редагувати фото</Text>
            )}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              style={styles.wrapper}
            >
              <TextInput
                value={name}
                style={[
                  styles.input,
                  nameFocused === true && styles.focusedInput,
                ]}
                placeholder="Назва..."
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
              <View
                style={[
                  styles.locationContainer,
                  locationFocused === true && styles.focusedInput,
                ]}
              >
                <SvgXml xml={mapPin} style={styles.svg} />

                <TextInput
                  value={location}
                  style={styles.locationInput}
                  placeholder="Місцевість..."
                  onChangeText={setLocation}
                  onFocus={() => setLocationFocused(true)}
                  onBlur={() => setLocationFocused(false)}
                />
              </View>

              <Pressable
                style={[
                  styles.publishBtn,
                  image !== "" &&
                    location !== "" &&
                    name !== "" &&
                    styles.publishBtnActive,
                ]}
                onPress={handlePublish}
                disabled={!image || !name || !location}
              >
                <Text
                  style={[
                    styles.publishBtnText,
                    image !== "" &&
                      location !== "" &&
                      name !== "" &&
                      styles.publishBtnActive,
                  ]}
                >
                  Опублікувати
                </Text>
              </Pressable>

              <View style={styles.toolbar}>
                <Pressable
                  style={styles.delBtn}
                  onPress={() => {
                    setName("");
                    setImage("");
                    setLocation("");
                  }}
                >
                  <SvgXml xml={trash} style={styles.svg} />
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  imageholder: {
    position: "relative",
    width: 343,
    height: 240,
    flexShrink: 0,
    borderRadius: 8,
  },
  cameraHolder: {
    left: "40%",
    top: "40%",
    position: "absolute",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 100,
  },
  container: {
    flex: 1,
    alignItems: "center",
    gap: 30,
  },

  publication: {
    marginTop: 32,
    flex: 1,
    width: 343,
  },
  publicationImg: {
    alignSelf: "center",
    width: 343,
    height: 240,
    flexShrink: 0,
    borderRadius: 8,
  },
  photoTxt: {
    top: 8,
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    marginBottom: 28,
  },
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 11,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    position: "relative",
  },
  title: {
    color: "#212121",
    textAlign: "center",
    flex: 1,
    fontSize: 17,
    fontStyle: "normal",
  },
  headerLeft: {
    position: "absolute",
    marginRight: 10,
    left: 16,
  },
  svg: {
    width: 24,
    height: 24,
    alignSelf: "center",
    // right: 10,
  },
  profileData: {
    width: 171,
    height: 60,
    flexShrink: 0,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    marginLeft: 16,
    marginTop: 30,
  },
  delBtn: {
    width: 70,
    height: 40,
    flexShrink: 0,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "center",
    // gap: 39,
    alignItems: "center",
    paddingTop: 100,
    // paddingBottom: 34,
    // borderTopColor: "black",
    // borderTopWidth: 1,
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
  locationContainer: {
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
  focusedInput: {
    borderColor: "#FF6C00",
  },
  locationInput: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    flex: 1,
    padding: 10,
  },
  publishBtn: {
    padding: 16,
    marginTop: 32,

    borderRadius: 100,
    backgroundColor: "#F6F6F6",

    color: "white",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
  },
  publishBtnText: {
    color: "#BDBDBD",
    // color: "#FFF",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
  },
  publishBtnActive: {
    color: "#FFF",
    backgroundColor: "#FF6C00",
  },
});

export default CreatePostsScreen;
