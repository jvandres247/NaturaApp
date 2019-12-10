import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  BackHandler
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Navbar from "../components/Navbar";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";

var { height } = Dimensions.get("window");

var box_count = 3;
var box_height = height / box_count;

export default class PagoErroneo extends Component {
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

  constructor(props){
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }


  componentDidMount() {
    this._isMounted = true
    this._isMounted && BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillUnmount() {
    this._isMounted = false;
    BackHandler.removeEventListener(
        "hardwareBackPress",
        this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.navigate('InicioApp');
    return true;
  }

  render() {
    const {navigation} = this.props;
    const nombre = navigation.getParam("lugar","No-NAME");
    return (
      <View>
        <View style={[styles.box, styles.box1]}>
          <View>
            <Navbar nombre={nombre} navigation={navigation}></Navbar>
          </View>
          <View style={styles.contendorPago}>
            <Icon name={Platform.OS === "ios" ? "ios-close-circle" : "md-close-circle"} color="#F98806" size={25}/>
            <Text style={styles.textoPago}>{I18n.t("pagoErroneo.txtPagoError")}</Text>
            <Text style={styles.textoError}>{I18n.t("pagoErroneo.txtError")}</Text>
          </View>
        </View>
        <View style={[styles.box, styles.box2]}>
          <View style={styles.contendorInformacion}>
            <Text style={styles.textoOrden}>{I18n.t("pagoErroneo.txtIntento")}</Text>
            <Text style={styles.textoEspera}>{I18n.t("pagoErroneo.txtVerifique")}</Text>
          </View>
        </View>
        <View style={[styles.box, styles.box3]}>
          <View style={styles.contendorBoton}>
          <TouchableOpacity style={styles.botonSalir} onPress={()=> this.handleBackButtonClick()}>
              <Text style={styles.textoBoton}>{I18n.t("pagoErroneo.btnSalir")}</Text>
            </TouchableOpacity>
          </View>
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
  headerSite: {
    width: '100%',
    paddingTop: 6,
    paddingLeft: 4,
    flexDirection: "row",
    backgroundColor: "#F98806"
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36
  },
  contendorPago:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoPago: {
    color: "#4e4e4d",
    fontSize: 18,
    fontFamily: "Roboto"
  },
  textoError: {
    color: "#F98806",
    fontSize: 24,
    fontFamily: "Roboto"
  },
  contendorInformacion:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoOrden: {
    color: "#4baa2b",
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  textoEspera: {
    color: "#4e4e4d",
    fontSize: 14,
    fontFamily: "Roboto"
  },
  textoNuevaOrden: {
    color: "#f98806",
    fontSize: 14,
    fontFamily: "Roboto",
    textDecorationLine: 'underline'
  },
  box: {
    height: box_height
  },
  box1: {
    backgroundColor: "#fff"
  },
  box2: {
    backgroundColor: "#fff"
  },
  box3: {
    backgroundColor: "#fff"
  },
  contendorBoton:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  botonSalir: {
    width: '100%',
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5E605D",
    marginBottom:24
  },
  textoBoton: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: 'bold',
  },
  contendorTexto:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoGracias: {
    color: "#4e4e4d",
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: 'bold',
  },
});
