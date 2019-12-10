import React from "react";
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  BackHandler,
  AsyncStorage
} from "react-native";
import { withNavigation} from "react-navigation";
import Menu, {
  MenuItem,
  MenuDivider,
  Position
} from "react-native-enhanced-popup-menu";
import Icon from "react-native-vector-icons/Ionicons";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";

const PopupMenu = ({ navigation }) => {
  
  let textRef = React.createRef();
  let menuRef = null;
  const setMenuRef = ref => (menuRef = ref);
  const Privacity = () => {
    navigation.navigate("Privacity2");
    menuRef.hide();
  };
  const Cerrar = () => {
    Alert.alert(
        I18n.t("popMenu.txtSesion"),
        I18n.t("popMenu.txtCerrarSesion"),
        [
          {
            text: I18n.t("popMenu.txtCancelar"),
            onPress: () => menuRef.hide(),
            style: "cancel"
          },
          { text: I18n.t("popMenu.txtAceptar"), onPress: () => _Logout() }
        ],
        { cancelable: false }
    );
  };
  const _Logout = async () => {
    await AsyncStorage.setItem("session", "false");
    await AsyncStorage.setItem("User","");
    await AsyncStorage.setItem("usrID","");
    await AsyncStorage.setItem("typePlan","");
    await AsyncStorage.setItem("@MyStore:bookmarks","");
    navigation.navigate('Login');
  };
  const _getUser = async () => {
    // var user = await AsyncStorage.getItem("User");
    // var userId = await AsyncStorage.getItem("usrID");
    // var tipoPlan = await AsyncStorage.getItem("typePlan");
    // Alert.alert(
    //   "Información del usuario " ,
    //   "Usuario ::> " + user + "    id::> "+ parseInt(userId).toString() + " Tipo_Plan::> " + tipoPlan ,
    //   [
    //     {
    //       text: "Aceptar",
    //       onPress: () => menuRef.hide(),
    //       style: "cancel"
    //     }
    //   ]
    //   );
    navigation.navigate("UserInfo");
    menuRef.hide();
  }
  const showMenu = () =>
      menuRef.show(textRef.current, (stickTo = Position.BOTTOM_LEFT));
  const onPress = () => showMenu();
  return (
      <View style={Platform.OS === "ios" ? styles.containerIOS : styles.container}>
        <Text ref={textRef} style={{ fontSize: 0, textAlign: "center" }} />
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Icon
              name={Platform.OS === "ios" ? "ios-menu" : "md-more"}
              style={styles.icono}
              size={25}
          />
        </TouchableOpacity>
        <Menu ref={setMenuRef}>
          <MenuItem onPress={_getUser}>{I18n.t("popMenu.txtInfoUsuario")}</MenuItem>
          <MenuItem onPress={Privacity}>{I18n.t("popMenu.txtAviso")}</MenuItem>
          <MenuItem onPress={Cerrar}>{I18n.t("popMenu.txtSesion")}</MenuItem>
        </Menu>
      </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 35,
    height: 35,
    top: -5
  },
  containerIOS: {
    width: 45,
  },
  button: {
    borderRadius: 359,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center"
  },
  icono: {
    // position: "relative",
    marginTop: 2,
    color: "#FFF"
  }
});
export default withNavigation(PopupMenu);