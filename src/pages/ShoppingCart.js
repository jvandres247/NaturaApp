import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Image, Platform, BackHandler, AsyncStorage, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { withNavigation } from "react-navigation";
import ButtonMakePayment from "../components/ButtonMakePayment";
import Numeric from '../components/Numeric';
import Navbar from "../components/Navbar";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";


type Props = {};

class ShoppingCart extends Component<Props> {
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
      results: [],
      total: 0.0
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  };

  componentWillMount() {
    this._isMounted = true;
    this._isMounted && this.retrieveItem();
    this._isMounted && BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillUnmount() {
    this._isMounted = false;
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  };

  handleBackButtonClick() {

    const {navigation} = this.props;
    navigation.goBack(null);
    return true;
  };

  retrieveItem = async () => {
    try {
      const bookmarksString = await AsyncStorage.getItem('@MyStore:bookmarks');
      if (bookmarksString !== null) {
        const bookmarksArray = JSON.parse(bookmarksString);
        this.setState({ results: bookmarksArray });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  tag(text) {
    texto = ""
    if (text == true) {
      texto = I18n.t("productos.txtTodoInc");
    }
    return texto;
  }

  removeItemCart = async (index) => {
    try {
      const filteredData = this.state.results.filter((item, position) => position !== index);
      this.setState({ results: filteredData });
      const bookmarksString = JSON.stringify(filteredData);
      await AsyncStorage.setItem('@MyStore:bookmarks',bookmarksString);
    } catch (error) {
      console.log(error.message);
    }
  }
  calcularTotal(orders) {
    subtotal = 0.00;
    for (let index = 0; index < orders.length; index++) {
      cantidad = parseFloat(orders[index].cantidad);
      precio = parseFloat(orders[index].precio_descuento).toFixed(2);
      subtotal = subtotal + (cantidad * precio) //item.precio - item.precio * 0.1
    }
    subtotal = parseFloat(subtotal).toFixed(2);
    AsyncStorage.setItem("subtotal", subtotal);
    return subtotal;
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={styles.column}>
        <View style={styles.row}>
          <Image source={{ uri: item.url_image }} style={styles.img_product_cart} />
          <View style={styles.item_column}>
            <Text numberOfLines={1} style={styles.producto}>{item.nombre}</Text>
            <Text style={item.todo_incluido ? styles.estiloDescripcion : null}>{  this.tag(item.todo_incluido)}</Text>
            <Numeric cantidad={item.cantidad} id={item.id} />
          </View>
          <View>
            <Text style={styles.precio}>${item.precio} MXN</Text>
            <Text style={styles.precio_descuento}>
              ${item.precio_descuento} MXN
            </Text>
          </View>
          <TouchableOpacity style={styles.btnQuitar} onPress={() => this.removeItemCart(index)} >
            <Icon name={Platform.OS === "ios" ? "ios-remove-circle" : "md-remove-circle"} color="#FFF" size={25} />
          </TouchableOpacity>
        </View>
        <View style={{ height: 2, backgroundColor: "rgba(94, 96, 93, 0.30)" }} />
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const nombre = navigation.getParam("lugar", "NO-NAME");
    this.calcularTotal(this.state.results);
    return this.state.results.length > 0 ? (
      <View style={styles.flatList}>
        <View>
          <Navbar nombre={nombre} navigation={navigation}></Navbar>
        </View>
        <View style={styles.subHeader}>
          <View>
            <TouchableOpacity style={styles.btnRegreso} onPress={() => this.handleBackButtonClick()}>
              <Icon name={Platform.OS === "ios" ? "ios-arrow-back" : "ios-arrow-back"} color="#FFF" size={20} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.handleBackButtonClick()}>
              <Text style={styles.txtSubheader}>{I18n.t("carrito.txtOrden")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={this.state.results}
          renderItem={(item, index) => this.renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
        />
        <View style={styles.menu}>
          <ButtonMakePayment results={this.state.results} />
        </View>
      </View>
    ) : (
        <View style={styles.flatList}>
          <View>
            <Navbar nombre={nombre} navigation={navigation}></Navbar>
          </View>
          <View style={styles.subHeader}>
            <View>
              <TouchableOpacity style={styles.btnRegreso} onPress={() => this.handleBackButtonClick()}>
                <Icon name={Platform.OS === "ios" ? "ios-arrow-back" : "ios-arrow-back"} color="#FFF" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => this.handleBackButtonClick()}>
                <Text style={styles.txtSubheader}>{I18n.t("carrito.txtOrden")}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.empty}>
            <Text style={styles.txtEmpty}>{I18n.t("carrito.txtInfoCarrito")}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Categorias", { lugar: nombre })}>
              <View style={styles.linkMenu}>
                <Text style={styles.link}>
                  <Icon name={Platform.OS === "ios" ? "ios-arrow-back" : "ios-arrow-back"} color="#F98806" size={20} />{" "}{I18n.t("carrito.txtEtiquetaBuscar")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.menu}>
            <ButtonMakePayment results={this.state.results} />
          </View>
        </View>
      );
  }
}


const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },

  header: {
    width: '100%',
    paddingTop: 4,
    paddingLeft: 4,
    flexDirection: "row",
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: "#F98806",
  },

  headerIOS: {
    backgroundColor: "#F98806",
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36,
    justifyContent: "center"
  },

  txtIOS: {
    color: "#F98806",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36,
    marginLeft: 8
  },

  roll: {
    position: 'relative',
    flexDirection: "row",
    left: 30
  },

  text: {
    position: 'relative',
    width: 300,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#FFF",
    color: "#FFFFFF",
    fontSize: 15,
    top: 4,
    left: 5,
    fontFamily: "Roboto",
    height: 36,
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },

  arrow: {
    position: 'relative',
    top: 4,
    right: 45
  },

  ubicacion: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36,
    marginLeft: 5,
  },

  subHeader: {
    backgroundColor: "#F98806",
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36,
    flexDirection: "row",
    justifyContent: "center"
  },

  btnRegreso: {
    color: "#FFFFFF",
    fontSize: 18,
    borderRadius: 360,
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
    top: -6,
    marginLeft: -5
  },

  viewOrden: {
    width: 330,
    justifyContent: "center",
    alignItems: "center"
  },

  txtSubheader: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36,
    justifyContent: "center",
    borderColor: "#F98806",
    borderWidth: 1,
    alignContent: "center"
  },

  column: {
    flex: 1,
    flexDirection: "column",
  },

  row: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    height: 75,
    alignItems: "center"
  },

  img_product_cart: {
    width: 75,
    height: 75
  },

  item_column: {
    flex: 1,
    flexDirection: "column"
  },

  producto: {
    color: "#4e4e4d",
    fontFamily: "LemonMilkbolditalic",
    fontSize: 13,
    marginLeft: 5,
    marginRight: 1
  },

  precio: {
    color: "#8a8a8a",
    fontFamily: "Roboto",
    fontSize: 15,
    marginRight: 10,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "#F98806"
  },

  precio_descuento: {
    color: "#f98806",
    fontFamily: "Roboto",
    fontSize: 15,
    marginRight: 10,
  },

  btnQuitar: {
    backgroundColor: "#5e605d",
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    height: 75
  },

  menu: {
    marginTop: 50,
    flexDirection: "row",
    height: 50,
  },

  empty: {
    flex: 1,
    marginTop: 60,
    alignItems: "center",
    alignContent: "center",
  },

  txtEmpty: {
    marginRight: 30,
    marginLeft: 45,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Roboto"
  },

  linkMenu: {
    marginTop: 40,
  },

  symbol: {
    color: "#F98806",
  },

  link: {
    color: "#F98806"
  },

  containerTotal: {
    borderColor: "rgba(94, 96, 93, 0.30)",
    borderTopWidth: 1,
    flexDirection: "row",
    marginTop: 0,
  },

  totalText: {
    marginTop: 10,
    color: "#4e4e4d",
    fontFamily: "Roboto",
    fontSize: 18,
    marginLeft: 20
  },

  totalMoney: {
    marginTop: 10,
    color: "#f98806",
    fontFamily: "Roboto",
    fontSize: 18,
    marginLeft: 180
  },

  estiloDescripcion: {
    borderRadius: 10,
    borderColor: "#4baa2b",
    backgroundColor: "#4baa2b",
    borderWidth: 1,
    color: "#fff",
    fontFamily: "Roboto",
    fontSize: 11,
    width: 80,
    textAlign: "center",
    justifyContent: "center",
    marginLeft: 5
  },
});

export default withNavigation(ShoppingCart);