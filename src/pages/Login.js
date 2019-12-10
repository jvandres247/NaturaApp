import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
  Text,BackHandler, Alert
} from 'react-native';
import {withNavigation} from 'react-navigation';

import ButtonQR from "../components/ButtonQR";
import Form from "../components/Form";
import Logo from "../components/Logo";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";

class Login extends React.Component{
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {};

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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

  componentDidMount() {
    BackHandler.addEventListener(
        "hardwareBackPress",
        this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
        "hardwareBackPress",
        this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this._handleOnPress();
  }
  _handleOnPress = () => {

    BackHandler.exitApp();

  }





  render(){
		return(

      <ImageBackground source={require('../images/Login.jpg')} style={{width: '100%',height: '100%'}} >
        <Logo/>
        <Text style={styles.textoSesion}>{I18n.t("login.sesion")}</Text>
        <ButtonQR style={styles.buttonqr} />
        <Form style={styles.Formulario} />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center'
  },
  textoSesion:{
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    marginTop: 12
  },
  ButtonQR: {
    position:'absolute',
    height: 400
  },
  Formulario: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 25
  }
});

export default withNavigation(Login);
