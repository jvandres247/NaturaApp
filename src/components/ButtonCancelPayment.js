import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, BackHandler, AsyncStorage, Alert, Platform, Button } from "react-native";

export default class ButtonCancelPayment extends React.Component {
  static navigationOptions = {
    header: null
  };
  
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      results: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  };

  cleanCart = async () => {
    try {
      const bookmarksString = JSON.stringify(this.state.results);
      await AsyncStorage.setItem('@MyStore:bookmarks',bookmarksString);
    } catch (error) {
      console.log(error.message);
    }
  }
  
  cancelPayment() {
    Alert.alert('¿Cancelar Orden?', 'Está acción cancelará su orden y vaciará su carrito de compras.', 
      [
        { text: 'No', style: 'cancel' },
        { text: 'Si', onPress: () => this.cleanCart() },
      ], { cancelable: false }
    );
  }

  render() {
    return this.props.results.length > 0 ? (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btnCancelPayment} onPress={() => this.cancelPayment()} >
          <Text style={styles.buttonText}> CANCELAR </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.container}>
        <View style={styles.btnCancelPaymentInactive}>
          <Text style={styles.buttonTextInactive}> CANCELAR </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: "50%",
  },

  btnCancelPayment: {
    backgroundColor: "#5E605D",
    height: 50,
    borderColor: "#fff",
    justifyContent: "center",
  },

  btnCancelPaymentInactive: {
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