import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from "react-native";
import { withNavigation } from "react-navigation";
import { info_api } from '../api/Variables';
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: ""
    };
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

  _saveSessionAsync = async () => {
    const {user} = this.state;
    await AsyncStorage.setItem("session", "true");
    await  AsyncStorage.setItem("User",user.toString());
  };

  InputCheck = () => {
    //var userIn = "victor";
    // var pattern = /^[a-zA-Z0-9_/.\@]*$/;
    var pattern = /^(?!.*__.*)(?!.*\.\..*)[aA-zZ0-9_.]+$/;
    const { user } = this.state;
    const { flag } = this.state;
    user == ""
        ? Alert.alert("El campo usuario no debe estar vacío")
        : pattern.test(user)
        ? this.Login()
        : Alert.alert("El usuario no debe contener signos como  /,*,#,$ ");
  };

  Login = async () => {
    const { user } = this.state;
    var code = "";
    var active = "";
    var privacy = await AsyncStorage.getItem("privacity");

    await fetch(info_api.url + "usuarios/find_by_user?username=" + user.toString(),
        {
          headers: {
            "Natura-Api-Key": info_api.api_key
          }
        }
    )
        .then(res => res.json())
        .then(response => {
          code = JSON.stringify(response.code);

          switch (code) {
            case "200":
              active = JSON.stringify(response.usuario.activo);

              if (active === "true") {
                          switch (privacy){

                            case "true":
                              this._saveSessionAsync();
                              AsyncStorage.setItem("usrID", response.usuario.id.toString());
                              AsyncStorage.setItem("typePlan", response.usuario.tipo_plan.toString());
                              AsyncStorage.setItem("hotelId", response.usuario.hotel_id.toString());
                              AsyncStorage.setItem("RoomUsr", response.usuario.numero_habitacion.toString());
                              this.props.navigation.navigate("Lugares");
                            break;
                            default:
                              this._saveSessionAsync();
                              AsyncStorage.setItem("usrID", response.usuario.id.toString());
                              AsyncStorage.setItem("typePlan", response.usuario.tipo_plan.toString());
                              AsyncStorage.setItem("hotelId", response.usuario.hotel_id.toString());
                              AsyncStorage.setItem("RoomUsr", response.usuario.numero_habitacion.toString());
                              this.props.navigation.navigate("Privacity");
                            break;
                             }

                } else {
                Alert.alert("Usuario inválido");
                this.props.navigation.goBack();
              }
              break;
            default:
              Alert.alert("Usuario inválido");
              this.props.navigation.goBack();
          }
        }).catch(error => alert(error))
        .done();
  };

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{I18n.t("formulario.o")}</Text>
            <Text style={styles.infoText}>{I18n.t("formulario.usuario")}</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor="rgba(255,255,255,0.8)"
                onChangeText={user => this.setState({ user })}
                autoCorrect={false}
                autoCapitalize={"none"}
            />
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => this.InputCheck()}
            >
              <Text style={styles.infoText}>{I18n.t("formulario.entrar")}</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  infoContainer: {
    alignItems: "center",
    left: 0,
    right: 0,
    bottom: 30,
    height: 100,
    padding: 0,
    paddingHorizontal: 50
  },
  input: {
    height: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 10,
    width: 200
  },
  buttonContainer: {
    paddingVertical: 15
  },
  infoText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20
  }
});

export default withNavigation(Form);