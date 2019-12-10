import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { withNavigation } from "react-navigation";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";


const dataCheck = [
  {
    label: "Estoy de Acuerdo",
    value: 1
  }
];

class Privacity2 extends Component<{}> {
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

  constructor() {
    super();
    this._isMounted = false;
    this.state = {
      check: false,
      disabled: true
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.textos = {
      avisoTextoNegritaUno:
        "GRUPO LA ISLA HUATULCO",
      avisoTextNegritaDos: "GRUPO LA ISLA HUATULCO," +
        " HOTEL LA ISLA HUATULCO, HOTEL ISLA NATURA BEACH HUATULCO" +
        ", Y CLUB DE PLAYA LATITUD 15."
    };
  }
  componentWillMount() {
    this._isMounted = true;



  }

  componentDidMount = async () => {
    this._isMounted = true;
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  };
  componentWillUnmount() {
    this._isMounted = false;
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerSite}>
          <Text style={styles.avisoTitulo}>{I18n.t("avisoPrivacidad.avisoTitulo")}</Text>
        </View>
        <ScrollView >
          <View style={styles.wraper}>
            <Text>{""}</Text>
            <Text style={styles.avisoTextoNegrita}>{I18n.t("avisoPrivacidad.avisoSubTitulo")}</Text>
            <Text>{""}</Text>
            <Text style={styles.avisoTextoNegrita}>
              {this.textos.avisoTextoNegritaUno}{" "}
              <Text style={styles.avisoTextoNormal}>
                {" "}{I18n.t("avisoPrivacidad.avisoParteUno")}{" "}
              </Text>
              <Text style={styles.avisoTextoNegrita} >{this.textos.avisoTextNegritaDos}</Text>{" "}
              <Text style={styles.avisoTextoNormal}> {I18n.t("avisoPrivacidad.avisoParteDos")}{" "}</Text>
              <Text style={styles.avisoTextoNegrita}>
                {I18n.t("avisoPrivacidad.avisoDireccion")}
              </Text>
              <Text style={styles.avisoTextoNormal}>
                {I18n.t("avisoPrivacidad.avisoFinal")}
              </Text>
              {"\n"}{"\n"}
            </Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  headerSite: {
    position: "relative",
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    width: '100%',
    paddingTop: 15,
    backgroundColor: "#FFF"
  },
  avisoTitulo: {
    color: "#4D4D4D",
    textAlign: "center",
    marginTop: 15,
    fontSize: 20
  },
  avisoTextoNegrita: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "justify",
    fontSize: 15
  },
  avisoTextoNormal: {
    color: "#616161",
    textAlign: "justify",
    marginTop: 15,
    fontSize: 15
  },
  contenedorCheckbox: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#E7E7E7"
  },
  contenedorBotones: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  botonCancelar: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5E605D",
    borderRadius: 5,
    marginTop: 25,
    marginBottom: 25
  },
  botonAceptar: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4BAA2B",
    borderRadius: 5,
    marginTop: 25,
    marginLeft: 25,
    marginBottom: 25
  },
  botonCancelar2: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5E605D",
    opacity: 0.3,
    borderRadius: 5,
    marginTop: 25,
    marginLeft: 25,
    marginBottom: 25
  },
  textoBoton: {
    color: "#FFF",
    fontSize: 20
  },
  textoCheck: {
    color: "#616161",
    fontSize: 20
  },
  wraper: {
    paddingBottom: 20,
    paddingLeft: 25,
    paddingRight: 25,
    alignItems: "baseline"
  }
});

export default withNavigation(Privacity2);
