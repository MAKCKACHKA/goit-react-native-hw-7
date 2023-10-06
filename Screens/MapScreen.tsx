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

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const MapScreen = ({ route, navigation }) => {
  function degreesToRadians(angle) {
    return angle * (Math.PI / 180);
  }
  function kMToLongitudes(km, atLatitude) {
    return (km * 0.0089831) / Math.cos(degreesToRadians(atLatitude));
  }

  const { name, userLocation } = route.params;

  return (
    <View style={{}}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Назад</Text>
      </Pressable>

      {userLocation && (
        <MapView
          style={styles.imageholder}
          //   showsUserLocation={true}
          //   followsUserLocation={true}
          minZoomLevel={10}
          region={{
            latitude: userLocation.coords.latitude,
            latitudeDelta: 0.00001,
            longitude: userLocation.coords.longitude,
            longitudeDelta: kMToLongitudes(1.0, userLocation.coords.latitude),

            // longitudeDelta: userLocation.coords.latitude,
            // latitudeDelta: userLocation.coords.longitude,
          }}
        >
          <Marker
            title={name}
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            description="location"
          />
          {/* // (markers, geojson etc go here) */}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageholder: {
    position: "relative",
    width: "100%",
    height: "100%",
    flexShrink: 0,
    borderRadius: 8,
  },
  backButton: {
    position: "absolute",
    bottom: 30,
    right: "15%",
    backgroundColor: "#FF6C00",
    borderRadius: 5,
    zIndex: 10,
    width: 125,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
  },

  container: {
    flex: 1,
    alignItems: "center",
    gap: 30,
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

  svg: {
    width: 24,
    height: 24,
    alignSelf: "center",
    // right: 10,
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
});

export default MapScreen;
