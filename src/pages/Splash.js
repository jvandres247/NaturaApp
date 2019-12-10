import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Image
} from 'react-native';


export default class Splash extends Component<{}> {

	render(){
		return(
      <ImageBackground source={require('../images/splash.jpg')} style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
          <View style={styles.viewStyleOne}>
            <Image style={styles.logo} source={require('../images/logo.png')}/>
            <Text style={styles.textoNatura}>ISLA NATURA</Text>
          </View>
        </View>
      </ImageBackground>
		)
	}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  viewStyleOne: {
    justifyContent: 'center',
    alignItems:'center',
  },
  logo :{
    width: 134,
    height: 134
  },
  textoNatura:{
    textAlign:'center',
    fontFamily: 'Roboto',
    fontSize: 24,
    color: '#fff'
  }

});