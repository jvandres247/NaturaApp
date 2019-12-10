import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground
} from 'react-native';
import Swiper from 'react-native-swiper'
import Login from './Login'



export default class Swipper extends Component<{}> {
  static navigationOptions = {
    header: null,
  }
  constructor(props){
    super(props);
  }

  render() {


        return (
          <View style={styles.container}>
        <Swiper style={styles.wrapper} height={200} horizontal={true}>
          <View style={styles.slide1}>
            <ImageBackground source={require('../images/welcome.jpg')} style={{width: '100%', height: '100%'}}/>
          </View>
          <View style={styles.slide2}>
            <Login/>
          </View>
        </Swiper>
      </View>
        )
      }
}

const styles = StyleSheet.create({
  container: {
  flex: 1
},

wrapper: {
},

slide: {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: 'transparent'
},

slide1: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#9DD6EB'
},

slide2: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#97CAE5'
},

slide3: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#92BBD9'
},

text: {
  color: '#fff',
  fontSize: 30,
  fontWeight: 'bold'
},
image: {
  flex: 1
}
});