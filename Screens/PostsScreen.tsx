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

import { messageCircle, messageCircleFill, mapPin } from "../assets/svgJS/svg";
import { SvgXml } from "react-native-svg";

import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../config";
import { changePosts } from "../redux/authSlice";

const PostsScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { uid, nickName, email, posts } = useSelector(
    (state: any) => state.auth
  );

  const setPosts = (value) => dispatch(changePosts(value));

  useEffect(() => {
    getPosts(setPosts);
  }, []);

  return (
    <View style={styles.wrapper}>
      <ScrollView>
        <View
          style={{
            width: 350,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <View style={styles.profileData}>
            <Image
              style={styles.miniImage}
              source={require("../assets/favicon.png")}
            />
            <View style={styles.profileDataText}>
              {/* <Text style={styles.profileName}>{uid}</Text> */}
              <Text style={styles.profileName}>{nickName}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>
          </View>
          <View style={styles.publications}>
            {posts &&
              posts
                .filter((post) => post.name !== "")
                .sort((a, b) => b.id.localeCompare(a.id))
                .map((post) => {
                  return (
                    <View style={styles.publication} key={post.id}>
                      <Image
                        style={styles.publicationImg}
                        source={{ uri: post.image }}
                      />
                      <Text style={styles.publicationDescription}>
                        {post.name}
                      </Text>
                      <View style={styles.publicationInfo}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("Коментарі", {
                              id: post.id,
                              image: post.image,
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

                          <Text style={styles.publicationsComentNumber}>
                            {post.coments.length}
                          </Text>
                        </TouchableOpacity>
                        <Pressable
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
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  publicationsComentNumber: {
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

  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 44,
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
  headerRight: {
    position: "absolute",

    marginRight: 10,
    right: 10,
  },
  svg: {
    width: 24,
    height: 24,
    alignSelf: "center",
    // right: 10,
  },
  container: {
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
    width: "100%",
    height: 489,
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0,
  },
  profileData: {
    width: 171,
    height: 60,
    flexShrink: 0,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    marginLeft: 16,
    marginTop: 32,
    justifyContent: "center",
    alignSelf: "flex-start",
  },

  miniImage: {
    alignSelf: "flex-start",
    width: 60,
    height: 60,
    flexShrink: 0,
    borderRadius: 16,
  },
  profileDataText: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignSelf: "center",
  },
  profileName: {
    color: "#212121",
    fontFamily: "Roboto-Medium",
    fontSize: 13,
    fontStyle: "normal",
  },
  profileEmail: {
    color: " #rgba(33, 33, 33, 0.80)",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
    fontSize: 11,
  },
});

export default PostsScreen;
