import React from "react";
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, BackHandler, AsyncStorage, Alert, Platform, Button } from "react-native";
import {withNavigation} from 'react-navigation';
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";
import Check from "../components/CheckUser";

class ButtonMakePayment extends React.Component {
  static navigationOptions = {
    header: null
  };

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

  constructor(props) {
    super(props);
    this._isMounted = false;
  }

  updateIndex(selectedIndex) {
    this.setState({selectedIndex})
  }

  componentDidMount() {
  this._isMounted = true;

  }
  componentWillUnmount() {

    this._isMounted = false;

    this._isMounted && this._realizarPago();
  }

  _realizarPago = () =>{
    Check.functions.checarUsuario();
    const {navigation} = this.props;
            const lugar = navigation.getParam("lugar", "NO-NAME");
            const lugarId = navigation.getParam("lugarId", "NO-NAME");
            const usuarioId = navigation.getParam("userId", "NO-NAME");
            const categoriaId = navigation.getParam("categoriaId","NO-NAME");
            navigation.navigate("TipoPago", {lugar: lugar, lugarId: lugarId, userId: usuarioId, categoriaId: categoriaId});

  }


  render() {



    return this.props.results.length > 0 ? (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btnMakePayment} onPress={() => this._realizarPago()}>
          <Text style={styles.buttonText}>{I18n.t("carrito.btnPago")}</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.container}>
        <View style={styles.btnMakePaymentInactive}>
          <Text style={styles.buttonTextInactive}>{I18n.t("carrito.btnPago")}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  btnMakePayment: {
    backgroundColor: "#4baa2b",
    height: 50,
    borderColor: "#fff",
    justifyContent: "center",
  },

  btnMakePaymentInactive: {
    backgroundColor: "rgba(94, 96, 93, 0.30)",
    height: 50,
    borderColor: "#fff",
    justifyContent: "center",
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },

  buttonTextInactive: {
    textAlign: "center",
    color: "#5E605D",
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
  }
});

export default  withNavigation(ButtonMakePayment);
