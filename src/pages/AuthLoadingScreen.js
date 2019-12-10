import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";


export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      user:""
    }
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const {navigation} = this.props;
    const session = await AsyncStorage.getItem('session');
    const privacity = await AsyncStorage.getItem('privacity');




    // El código siguiente actua algo parecido a un switch, con el la aplicación sabra en que
    // pantalla ubicarse

    /*navigation.navigate
      ((session === 'true' && privacity === 'true')? "AppStack" : "AuthStack");*/

    if (session === "true" && privacity === "true"){
      navigation.navigate("AppStack");
    }else{
      navigation.navigate("AuthStack");
    }



  };

  // Render any loading content that you like here
  render() {
    return (
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
