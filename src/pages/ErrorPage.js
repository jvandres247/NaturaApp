import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Menu from  "../components/Menu";
var { height } = Dimensions.get("window");

var box_count = 3;
var box_height = height / box_count;

export default class ErrorPage extends Component {
  static navigationOptions = {
    header: null
};
  render() {
    return (
      <View>
        <View style={[styles.box, styles.box1]}>
          <View style={styles.headerSite}>
            <Text style={styles.text}>
              <Icon name={Platform.OS === "ios" ? "ios-pin" : "md-pin"} color="#FFF" size={26}/>{" "}
              Usted está aqui:
            </Text>
          </View>
          <View style={styles.contendorPago}>
            <Icon name={Platform.OS === "ios" ? "ios-construct" : "md-construct"} color="#4baa2b" size={28}/>
            <Text style={styles.textoPago}>Módulo en Construcción</Text>
          </View>
        </View>
        <View style={[styles.box, styles.box2]}>
          <View style={styles.contendorInformacion}>
            <Text style={styles.textoNuevaOrden}>{'\n'}Ir al inicio</Text>
          </View>
        </View>
        <View style={[styles.box, styles.box3]}>
          <View style={{ marginTop: 205}}>
            <Menu/>
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
  textoExito: {
    color: "#4baa2b",
    fontSize: 24,
    fontFamily: "Roboto"
  },
  contendorInformacion:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoOrden: {
    color: "#4e4e4d",
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: 'bold'
  },
  textoEspera: {
    color: "#4e4e4d",
    fontSize: 14,
    fontFamily: "Roboto"
  },
  textoNuevaOrden: {
    color: "#4baa2b",
    fontSize: 14,
    fontFamily: "Roboto",
    textDecorationLine: 'underline'
  },
  box: {
    height: box_height
  },
  box1: {
    
  },
  box2: {
   
  },
  box3: {
   
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
