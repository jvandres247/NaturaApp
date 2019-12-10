import React, { Component } from "react";
import { StyleSheet, ImageBackground } from "react-native";

export default class Background extends Component<{}> {
  render() {
    return (
        <ImageBackground
        source={require("../images/Login.jpg")}
        style={{width: '100%', height: '100%', zIndex: 0}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
