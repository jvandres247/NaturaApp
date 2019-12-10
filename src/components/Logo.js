import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

export default class Logo extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../images/logo.png")} />
        <Text style={styles.logoText}>ISLA NATURA</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    height: 82,
    width: 84,
    marginTop: 90,
    marginBottom: 5
  },
  logoText: {
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: 20,
    color: "#fff",
    fontWeight: 'bold',
    marginBottom: 70
  }
});
