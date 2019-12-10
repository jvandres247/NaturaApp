import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Alert,
  StatusBar
} from "react-native";

import { withNavigation } from "react-navigation";

import Icon from "react-native-vector-icons/Ionicons";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";

class ButtonQR extends React.Component {
  constructor(props) {
    super(props);
  }
  
  async handleLocales() {
    this.locales = RNLocalize.getLocales();
  }
  
  getLocale() {
    if (this.locales) {
      if (Array.isArray(this.locales)) {
        return this.locales[0];
      }
    }
    return null;
  }

  access_QR = () => {
    this.props.navigation.navigate("ScanQR");
  };

  access_QRiOS = () => {
    this.props.navigation.navigate("ScanQRiOS");
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={
           /* () => this.access_QRiOS() /*this.props.navigation.navigate('ScanQR')*/
           () => {Platform.OS === "ios" ? this.access_QRiOS()  : this.access_QR() }
          }
        >
          <Text style={styles.buttonText}>
            <Icon
              name={Platform.OS === "ios" ? "ios-camera" : "md-camera"}
              color="#FFF"
              size={25}
            />{" "}
            {I18n.t("botonQR.accesoQR")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  buttonContainer: {
    backgroundColor: "#4baa2b",
    paddingVertical: 15,
    borderRadius: 5,
    borderColor: "#fff",
    borderWidth: 2,
    marginBottom: 40,
    width: 200
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold"
  }
});

export default withNavigation(ButtonQR);
