import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Platform
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

export default class Welcome extends Component<{}> {
	render(){
		return(
      <ImageBackground source={require('../images/welcome.jpg')} style={{width: '100%', height: '100%'}}/>
		)
	}
}

const styles = StyleSheet.create({
  containerTextoUno: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems:'flex-start'
  },
  viewTextoUno: {
    justifyContent: 'center',
    alignItems:'center',
  },
  textoPedido:{
    textAlign:'center',
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: 'bold'
  },
  textoLugar:{
    textAlign:'center',
    color: '#F98806',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: 'bold'
  },
  containerTextoDos: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems:'flex-end'
  },
  viewTextoDos: {
    justifyContent: 'center',
    alignItems:'center',
  },
  textoDos:{
    textAlign:'center',
    color: '#4baa2b',
    fontFamily: 'Roboto',
    fontSize: 28,
    fontWeight: 'bold'
  },
  containerTextoTres: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems:'flex-end'
  },
  viewTextoTres: {
    justifyContent: 'center',
    alignItems:'center',
    marginBottom:40,
    marginRight: 15
  },
  textoTres:{
    textAlign:'center',
    color: '#fff',
    fontFamily: 'LemonMilkbolditalic',
    fontSize: 24
  }
});