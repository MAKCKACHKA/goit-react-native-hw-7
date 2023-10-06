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

import { arrowLeft, Send } from "../assets/svgJS/svg";
import { SvgXml } from "react-native-svg";
import { addComment, getComents, getPosts, getUserPosts } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { changePosts, changeUserPosts } from "../redux/authSlice";

function formatDate(timestamp) {
  const months = [
    "січня",
    "лютого",
    "березня",
    "квітня",
    "травня",
    "червня",
    "липня",
    "серпня",
    "вересня",
    "жовтня",
    "листопада",
    "грудня",
  ];

  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month}, ${year} | ${hours}:${minutes}`;
}

const CommentsScreen = ({ route, navigation }) => {
  const [coment, setСoment] = useState("");
  const { id, image, userID } = route.params;

  const { uid } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const setPosts = (value) => dispatch(changePosts(value));
  const setUserPosts = (value) => dispatch(changeUserPosts(value));

  const [comentsPost, setСomentsPost] = useState([]);

  const usePosts = () => {
    getPosts(setPosts);
    getUserPosts(setUserPosts, uid);
    getComents(setСomentsPost, id);
  };

  useEffect(() => {
    usePosts();
    console.log(uid, userID);
  }, []);

  const handleSend = () => {
    const newComent = {
      user: uid,
      text: coment,
      date: formatDate(Date.now()),
    };
    addComment(id, newComent);
    console.log(`Коментар:  ${coment}`);

    setСoment("");
    usePosts();
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      // title: "sadasd",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={{ left: 20 }}
        >
          <SvgXml xml={arrowLeft} style={styles.svg} />
        </TouchableOpacity>
      ),
    });
  }, []);
  const [inputFocused, setinputFocused] = useState(false);

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.wrapper}>
      <ScrollView>
        <View>
          <Image style={styles.publicationImg} source={{ uri: image }} />
          <View>
            {comentsPost.map((post, index) => (
              <View key={index} style={styles.coments}>
                {post.coments.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    {uid === item.user ? (
                      <View style={styles.MyComent} key={index}>
                        <Image
                          style={styles.miniImage}
                          source={{ uri: image }}
                        />
                        <View style={styles.MycomentData}>
                          <Text style={styles.comentText}>{item.text}</Text>
                          <Text style={styles.MycomentDate}>{item.date}</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.coment} key={index}>
                        <Image
                          style={styles.miniImage}
                          source={{ uri: image }}
                        />
                        <View style={styles.MycomentData}>
                          <Text style={styles.comentText}>{item.text}</Text>
                          <Text style={styles.comentDate}>{item.date}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.toolbar}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View
            style={[
              styles.InputContainer,
              inputFocused === true && styles.focusedInput,
            ]}
          >
            <TextInput
              value={coment}
              style={styles.input}
              placeholder="Коментувати..."
              onChangeText={setСoment}
              onFocus={() => setinputFocused(true)}
              onBlur={() => setinputFocused(false)}
            />
            <Pressable
              disabled={!coment}
              onPress={handleSend}
              style={styles.send}
            >
              <SvgXml xml={Send} style={styles.send} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  publicationImg: {
    marginTop: 32,
    alignSelf: "center",
    width: 343,
    height: 240,
    flexShrink: 0,
    borderRadius: 8,
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
    fontFamily: "Roboto-Regular",
    // flex: 1,
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
  },

  coments: {
    marginTop: 32,
    marginBottom: 40,
    flex: 1,
    alignItems: "center",
    gap: 32,
  },
  coment: {
    flexShrink: 0,
    display: "flex",
    flexDirection: "row",
    gap: 32,
    width: 343,
    // width: "100%",
  },
  MyComent: {
    flexShrink: 0,
    display: "flex",
    flexDirection: "row-reverse",
    gap: 32,
    width: 343,
  },
  miniImage: {
    width: 28,
    height: 28,
    flexShrink: 0,
    borderRadius: 28,
  },
  comentData: {
    // top: 12,
    flex: 1,
    alignItems: "flex-end",
    gap: 8,
    width: 267,
  },
  myComent: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  MycomentData: {
    // top: 12,
    flex: 1,
    gap: 8,
    width: 267,
    borderRadius: 6,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  comentText: {
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    fontStyle: "normal",
  },
  comentDate: {
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
    fontSize: 11,
    // right: 16,
    // alignSelf: "flex-end",
  },
  MycomentDate: {
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
    fontSize: 11,
    // right: 16,
    alignSelf: "flex-end",
  },

  toolbar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 39,
    alignItems: "center",
    paddingTop: 9,
    paddingBottom: 34,
    // borderTopColor: "black",
    // borderTopWidth: 1,
  },

  InputContainer: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 100,

    flexDirection: "row",
    alignItems: "center",

    width: 343,
    height: 50,
    flexShrink: 0,
  },
  input: {
    width: 343,
    height: 50,
    flexShrink: 0,
    fontFamily: "Roboto-Regular",
    // color: "#BDBDBD",
    fontSize: 16,
    flex: 1,
    padding: 16,
  },
  focusedInput: {
    borderColor: "#FF6C00",
  },

  send: { width: 34, height: 34, flexShrink: 0, right: 8 },
});

export default CommentsScreen;
