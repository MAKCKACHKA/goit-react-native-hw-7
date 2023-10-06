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
import { SvgXml } from "react-native-svg";
import {
  messageCircle,
  mapPin,
  logOutSvg,
  thumbsUp,
  thumbsUpFill,
  messageCircleFill,
} from "../assets/svgJS/svg";
import { getUserPosts, likePost, logOut } from "../config";
import { useDispatch, useSelector } from "react-redux";
import {
  changePosts,
  changeUid,
  changeUserActive,
  changeUserPosts,
} from "../redux/authSlice";

const ProfileScreen = ({ navigation }) => {
  const { uid, userPosts, nickName } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const setlogOut = (value) => dispatch(changeUid(value));
  const setUserPosts = (value) => dispatch(changeUserPosts(value));

  useEffect(() => {
    getUserPosts(setUserPosts, uid);
  }, []);

  const setUserActive = (value) => dispatch(changeUserActive(value));

  const [likeNumber, setlikeNumber] = useState(0);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
        resizeMode="stretch"
      >
        <View style={{ justifyContent: "flex-end" }}>
          <ScrollView contentContainerStyle={{ justifyContent: "flex-end" }}>
            <View style={styles.wrapper}>
              <View style={styles.container}>
                <TouchableOpacity
                  style={styles.headerRight}
                  onPress={() => {
                    logOut(dispatch);
                    setlogOut("");
                    setUserActive(false);
                  }}
                >
                  <SvgXml xml={logOutSvg} style={styles.svg} />
                </TouchableOpacity>
                <Image
                  style={styles.UserImage}
                  source={require("../assets/favicon.png")}
                />
                <Text style={styles.title}>{nickName}</Text>
                <View style={styles.publications}>
                  {userPosts &&
                    userPosts !== null &&
                    userPosts
                      .filter((post) => post.name !== "")
                      .sort((a, b) => b.id.localeCompare(a.id))
                      .map((post) => {
                        return (
                          <View
                            style={styles.publication}
                            // id={`${Math.random()}`}
                            key={post.id}
                          >
                            <Image
                              style={styles.publicationImg}
                              source={{ uri: post.image }}
                            />

                            <Text style={styles.publicationDescription}>
                              {post.name}
                            </Text>
                            <View style={styles.publicationInfo}>
                              <View
                                style={{
                                  gap: 20,
                                  flexDirection: "row",
                                }}
                              >
                                <Pressable
                                  onPress={() =>
                                    navigation.navigate("Коментарі", {
                                      id: post.id,
                                      image: post.image,
                                      comentsHolder: post.coments,
                                      userID: post.uid,
                                    })
                                  }
                                  style={styles.publicationElem}
                                >
                                  {post.coments.length === 0 ? (
                                    <SvgXml
                                      xml={messageCircle}
                                      style={[[styles.svg]]}
                                    />
                                  ) : (
                                    <SvgXml
                                      xml={messageCircleFill}
                                      style={[[styles.svg]]}
                                    />
                                  )}
                                  <Text style={styles.publicationsNumber}>
                                    {post.coments.length}
                                  </Text>
                                </Pressable>

                                <TouchableOpacity
                                  onPress={() => {
                                    likePost(post.id);
                                    setTimeout(() => {
                                      getUserPosts(setUserPosts, uid);
                                    }, 400);
                                  }}
                                  style={{ flexDirection: "row" }}
                                >
                                  {post.likes === 0 ? (
                                    <SvgXml
                                      xml={thumbsUp}
                                      style={[[styles.svg]]}
                                    />
                                  ) : (
                                    <SvgXml
                                      xml={thumbsUpFill}
                                      style={[[styles.svg]]}
                                    />
                                  )}
                                  <Text style={styles.publicationsNumber}>
                                    {post.likes}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate("MapScreen", {
                                    location: post.location,
                                    userLocation: post.userLocation,
                                  })
                                }
                              >
                                <View style={styles.publicationElem}>
                                  <SvgXml xml={mapPin} style={styles.svg} />
                                  <Text style={styles.publicationLocation}>
                                    {post.location}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      })}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    position: "absolute",
    top: 22,
    right: 16,
  },

  publications: {
    flex: 1,
    alignItems: "center",
    gap: 34,
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
  publicationDescription: {
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,

    fontStyle: "normal",
  },
  publicationInfo: {
    marginTop: 8,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // gap: 40,
  },
  publicationElem: {
    flexDirection: "row",
  },
  publicationsNumber: {
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
  },
  publicationLocation: {
    color: "#212121",
    textAlign: "right",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    textDecorationLine: "underline",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },

  UserImage: {
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
    marginTop: 230,
    minHeight: 450,
    flexShrink: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    fontFamily: "Roboto-Medium",
    marginTop: 92,
    // fontWeight: "bold",
    marginBottom: 20,

    color: "#212121",
    textAlign: "center",
    fontStyle: "normal",
    fontSize: 30,
  },

  focusedInput: {
    borderColor: "#FF6C00",
  },

  userBtn: {
    width: 70,
    height: 40,
    flexShrink: 0,
    backgroundColor: "rgba(255, 108, 0, 1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  toolbar: {
    backgroundColor: "white",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 39,
    alignItems: "center",
    paddingTop: 9,
    paddingBottom: 34,
    borderTopColor: "black",
    borderTopWidth: 1,
  },
  svg: {
    width: 24,
    height: 24,
    alignSelf: "center",
  },
});

export default ProfileScreen;
