import React, { Component } from 'react';
import { StyleSheet, Platform, BackHandler, AsyncStorage } from 'react-native';
import { withNavigation } from "react-navigation";
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/Ionicons'
import InicioApp from './InicioAPP';
import Categorias from '../pages/Categorias';
import ShoppingCart from '../pages/ShoppingCart';
import Check from "../components/CheckUser";


//as
class Menu extends Component<{}> {
  static navigationOptions = {
    header: null
  };

  constructor() {
    super();
    this._isMounted = false;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  state = {
    selectedTab: 'home',
    results: []
  };

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.retrieveItem();
    this._isMounted && BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillMount() {
    this._isMounted = true;
    this._isMounted && this.retrieveItem();
  }

  componentWillUpdate(nextProps, nextState) {
  }

  componentWillUnmount() {
    this._isMounted = false;
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  retrieveItem = async () => {
    try {
      const bookmarksString = await AsyncStorage.getItem('@MyStore:bookmarks');
      if (bookmarksString !== null) {
        // We have data!!
        const bookmarksArray = JSON.parse(bookmarksString);
        this.setState({results: bookmarksArray});

      }
    } catch (error) {
      console.log(error);
    }

  }

  render() {

    return (
        <TabNavigator style={styles.container} tabBarStyle={{backgroundColor: '#F98806'}}>
          <TabNavigator.Item
              //selected={this.state.selectedTab === 'home'}
              renderIcon={() => <Icon name={Platform.OS === "ios" ? "ios-home" : "md-home"} color="#FFF" size={26}/>}
              renderSelectedIcon={() => <Icon name={Platform.OS === "ios" ? "ios-home" : "md-home"} size={26}
                                              color="#757575"/>}
              onPress={() => {
                this.setState({selectedTab: 'home'});
                this.getHome()
              }}>
            <InicioApp/>
          </TabNavigator.Item>
          <TabNavigator.Item
              //selected={this.state.selectedTab === 'categorias'}
              renderIcon={() => <Icon name={Platform.OS === "ios" ? "ios-restaurant" : "md-restaurant"} color="#FFF"
                                      size={25}/>}
              renderSelectedIcon={() => <Icon name={Platform.OS === "ios" ? "ios-restaurant" : "md-restaurant"}
                                              size={25} color="#757575"/>}
              onPress={() => {
                this.setState({selectedTab: 'categorias'});
                this.getCategorias()
              }}>
            <Categorias/>
          </TabNavigator.Item>
          <TabNavigator.Item
              //selected={this.state.selectedTab === 'carrito'}
              badgeText={this.props.total_items}
              renderIcon={() => <Icon name={Platform.OS === "ios" ? "ios-cart" : "md-cart"} color="#FFF" size={25}/>}
              renderSelectedIcon={() => <Icon name={Platform.OS === "ios" ? "ios-cart" : "md-cart"} size={25}
                                              color="#757575"/>}
              onPress={() => this.getCart()}>
          </TabNavigator.Item>
          <TabNavigator.Item
              ///selected={this.state.selectedTab === 'historial'}
              renderIcon={() => <Icon name={Platform.OS === "ios" ? "ios-pricetags" : "md-pricetags"} color="#FFF"
                                      size={25}/>}
              renderSelectedIcon={() => <Icon name={Platform.OS === "ios" ? "ios-pricetags" : "md-pricetags"} size={25}
                                              color="#757575"/>}
              onPress={() => {
                this.setState({selectedTab: 'historial'});
                this.getOrders()
              }}>
          </TabNavigator.Item>
        </TabNavigator>
    )
  }

  getHome = async () => {
    try {
      this.setState({selectedTab: 'home'});
      const {navigation} = this.props;
      var lugar = await AsyncStorage.getItem("lugar");
      var lugarId = await AsyncStorage.getItem("lugarId");
      var usuarioId = await AsyncStorage.getItem("usrID");
      var username = await AsyncStorage.getItem("User");
      navigation.navigate('InicioApp', {lugar: lugar, lugarId: lugarId, userId: usuarioId, username: username});
    } catch (error) {
      console.log(error);
    }
  }

  getCategorias = async () => {
    Check.functions.checarUsuario();
    try {
      this.setState({selectedTab: 'categorias'});
      const {navigation} = this.props;
      var lugar = await AsyncStorage.getItem("lugar");
      var lugarId = await AsyncStorage.getItem("lugarId");
      var usuarioId = await AsyncStorage.getItem("usrID");
      var username = await AsyncStorage.getItem("User");
      navigation.navigate('Categorias', {lugar: lugar, lugarId: lugarId, userId: usuarioId, username: username});
    } catch (error) {
      console.log(error);
    }
  }

  getCart = async () => {
    Check.functions.checarUsuario();
    try {
      this.setState({selectedTab: 'cart'});
      const {navigation} = this.props;
      var lugar = await AsyncStorage.getItem("lugar");
      var lugarId = await AsyncStorage.getItem("lugarId");
      var usuarioId = await AsyncStorage.getItem("usrID");
      var username = await AsyncStorage.getItem("User");
      navigation.navigate('ShoppingCart', {lugar: lugar, lugarId: lugarId, userId: usuarioId, username: username});
    } catch (error) {
      console.log(error);
    }

  }

  getBuild() {
    this.setState({selectedTab: 'build'});
    const {navigation} = this.props;
    const lugar = navigation.getParam("lugar", "NO-NAME");
    const lugarId = navigation.getParam("lugarId", "NO-NAME");
    const usuarioId = navigation.getParam("usuarioId", "NO-NAME");
    navigation.navigate('ErrorPage', {lugar: lugar, lugarId: lugarId, userId: usuarioId});
  }

  getOrders = async () => {

    try {
      this.setState({selectedTab: 'build'});
      const {navigation} = this.props;
      var lugar = await AsyncStorage.getItem("lugar");
      var lugarId = await AsyncStorage.getItem("lugarId");
      var usuarioId = await AsyncStorage.getItem("usrID");
      var username = await AsyncStorage.getItem("User");
      navigation.navigate('OrdersHistory', {lugar: lugar, lugarId: lugarId, userId: usuarioId, username: username});
    } catch (error) {
      console.log(error);
    }
  }
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center',
  }
});

export default withNavigation(Menu);