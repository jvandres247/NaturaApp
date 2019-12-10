import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  AsyncStorage,
  Alert,
  TouchableHighlight
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { withNavigation } from "react-navigation";
import Menu from './Menu';
import { info_api } from '../api/Variables';
import Navbar from "../components/Navbar";
import { CheckBox } from 'react-native-elements';
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";
import Check from "../components/CheckUser";
type Props = {};

class DetailProduct extends Component<Props> {
  static navigationOptions = {
    header: null
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

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      data: {},
      opcion1: false,
      opcion2: false,
      opcion3: false,
      valor: 1,
      total_items: 0,
      checkProductoUno: false,
      checkProductoDos: false,
      checkProductoTres: false,
      username:"",
      activo:"",
      bookmarksString : ""
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    this._isMounted = true;
    this._isMounted && this.makeRemoteRequest();
    //this.retrieveItem();
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.retrieveItem();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  makeRemoteRequest = () => {
    Check.functions.checarUsuario();

    let keys = ['lugar', 'productoId', 'usrID'];
    AsyncStorage.multiGet(keys)
        .then(result => {

          fetch(info_api.url + "productos/" + result[1][1]+"?usuarioId="+ result[2][1], {
            headers: {
              "Natura-Api-Key": info_api.api_key
            }
          })
              .then(response => response.json())
              .then(responseJson => {
                this.setState({
                  data: responseJson.producto
                });
              })
              .catch(error => {
                console.log(error);
              })
              .done();
        });
  }
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  increment(value) {
    value = value + 1;
    this.setState({
      valor: value
    });
  }

  decrement(value) {
    if (value > 1) {
      value = value - 1;
      this.setState({
        valor: value
      });
    }
  }



  storeData = async (item, cantidad) => {

    Check.functions.checarUsuario();
    try {
      //Recuperación del carrito de compras
      AsyncStorage.getItem('@MyStore:bookmarks')
          .then((value) => {
            this.setState({bookmarksString: value});
          })
          .then( response =>{
           if (this.state.bookmarksString !== null) {
              const bookmarksArray = JSON.parse(this.state.bookmarksString);
              if (bookmarksArray.length == 5) {
                Alert.alert("No puedes añadir más de 5 productos a la lista.");
              } else {
                // inicializacion del item a guardar en el carrito de compras
                producto = {
                  id: item.id,
                  nombre: item.nombre,
                  url_image: item.url_image,
                  precio: item.precio,
                  precio_descuento: item.precio_descuento_promocion ? item.precio_descuento_promocion : item.precio_descuento,
                  todo_incluido: item.todo_incluido,
                  cantidad: cantidad,
                  opcion1: this.state.checkProductoUno ? item.opcion1 : "",
                  opcion2: this.state.checkProductoDos ? item.opcion2 : "",
                  opcion3: this.state.checkProductoTres ? item.opcion3 : ""
                };
                // inicializacion del item a guardar en el carrito de compras

                // se añade al carrito de compras
                bookmarksArray.push(producto);

                const bookmarksString2 = JSON.stringify(bookmarksArray);
                AsyncStorage.setItem('@MyStore:bookmarks', bookmarksString2);
                this.setState({
                  total_items: bookmarksArray.length
                });

                //se añade al carrito de compras
              }
            } else {
              console.log("Error");
              producto = {
                id: item.id,
                nombre: item.nombre,
                url_image: item.url_image,
                precio: item.precio,
                precio_descuento: item.precio_descuento_promocion ? item.precio_descuento_promocion : item.precio_descuento,
                todo_incluido: item.todo_incluido,
                cantidad: cantidad,
                opcion1: this.state.checkProductoUno ? item.opcion1 : "",
                opcion2: this.state.checkProductoDos ? item.opcion2 : "",
                opcion3: this.state.checkProductoTres ? item.opcion3 : ""
              };
              bookmarksArray = [];
              bookmarksArray.push(producto);
              const bookmarksString2 = JSON.stringify(bookmarksArray);

              AsyncStorage.setItem('@MyStore:bookmarks', bookmarksString2);
              this.setState({
                total_items: bookmarksArray.length
              });
            }
          });
    } catch (error) {
      console.log(error.message);
    }
}

  existProduct(product, orders) {
    exist = false;
    for (let index = 0; index < orders.length; index++) {
      if (orders[index].id == product.id) {
        exist = true;
      }
    }
    return exist;
  }

  increaseProductQuantity(product, orders) {
    for (let index = 0; index < orders.length; index++) {
      if (orders[index].id == product.id) {
        orders[index].cantidad = orders[index].cantidad + producto.cantidad;
      }
    }
  }

  retrieveItem = async () => {
    try {
      const bookmarksString = await AsyncStorage.getItem('@MyStore:bookmarks');
      if (bookmarksString !== null) {
        const bookmarksArray = JSON.parse(bookmarksString);
        this.setState({
          total_items: bookmarksArray.length
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  CheckBoxProductUno = () => {
    this.setState({ checkProductoUno: !this.state.checkProductoUno });

  }
  CheckBoxProductDos = () => {
    this.setState({ checkProductoDos: !this.state.checkProductoDos })
  }
  CheckBoxProductTres = () => {
    this.setState({ checkProductoTres: !this.state.checkProductoTres })
  }

  render() {
    const { navigation } = this.props;
    const vOpcion1 = <Text style={styles.opcion_text}>{this.state.data.opcion1}</Text>;
    const vOpcion2 = <Text style={styles.opcion_text}>{this.state.data.opcion2}</Text>;
    const vOpcion3 = <Text style={styles.opcion_text}>{this.state.data.opcion3}</Text>;
    const nombre = navigation.getParam("lugar", "NO-NAME");
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 2 }}>
          <View>
            <Navbar nombre={nombre} navigation={navigation}></Navbar>
          </View>
          <View style={styles.headerCategoria}>
            <View>
              <TouchableOpacity style={styles.btnRegreso} onPress={() => this.props.navigation.goBack()}>
                <Icon name={Platform.OS === "ios" ? "ios-arrow-back" : "ios-arrow-back"} color="#FFF" size={26} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.txtCategoria} >{I18n.t("productos.txtInfoDetalle")}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Image style={styles.imgProducto} source={{ uri: this.state.data.imagen }} />
        </View>
        <View style={{ flex: 3 }}>
          <View style={styles.contenidoProducto}>
            <Text style={styles.txtProducto}>{this.state.data.nombre}</Text>
            <Text style={styles.txtPrecio}>{this.state.data.precio} MXN - <Text style={{ fontFamily: 'Roboto' }}>{I18n.t("productos.txtPrecioReg")}</Text></Text>
            <Text style={styles.txtPrecioDesc}>{this.state.data.precio_descuento} MXN - <Text style={{ fontFamily: 'Roboto' }}>{I18n.t("productos.txtPrecioEsp")}</Text></Text>
            <Text style={styles.txtDescripcion}> {this.state.data.descripcion} </Text>
          </View>

          <View style={styles.opcionesProducto}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
              <View style={this.state.data.opcion1 ? { display: "flex", flexDirection: "row" } : { display: "none" }}>
                <CheckBox title={vOpcion1} checked={this.state.checkProductoUno} checkedColor={"#4BAA2B"} onPress={() => this.CheckBoxProductUno()} />
              </View>
              <View style={this.state.data.opcion2 ? { display: "flex", flexDirection: "row" } : { display: "none" }}>
                <CheckBox title={vOpcion2} checked={this.state.checkProductoDos} checkedColor={"#4BAA2B"} onPress={() => this.CheckBoxProductDos()} />
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start'}}>
              <View style={this.state.data.opcion3 ? { display: "flex", flexDirection: "row" } : { display: "none" }}>
                <CheckBox title={vOpcion3} checked={this.state.checkProductoTres} checkedColor={"#4BAA2B"} onPress={() => this.CheckBoxProductTres()} />
              </View>
            </View>
          </View>

          <View style={styles.opcion}>
            <Text style={styles.cantidad}>{I18n.t("productos.txtCantidad")}</Text>
            <View style={styles.input}>
              <View style={styles.text_numeric}>
                <Text> {this.state.valor} </Text>
              </View>
              <TouchableHighlight style={styles.fieldMore} onPress={() => this.increment(this.state.valor)}>
                <View style={styles.more}>
                  <Text> + </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight style={styles.fieldLess} onPress={() => this.decrement(this.state.valor)} >
                <View style={styles.less}>
                  <Text> - </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.contedorBTN}>
            <TouchableHighlight style={styles.buttonContainer} onPress={() => this.storeData(this.state.data, this.state.valor)}>
              <Text style={styles.buttonText}>
                <Icon name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"} color="#FFF" size={22} /> {I18n.t("productos.txtAgregar")}
            </Text>
            </TouchableHighlight>
          </View>
          <View style={{ marginTop: 49 }}>
            <Menu total_items={this.state.total_items} />
          </View>
        </View>
      </View>
    );
  }
}

export default withNavigation(DetailProduct);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerSite: {
    width: '100%',
    paddingTop: 4,
    paddingLeft: 4,
    flexDirection: "row",
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: "#F98806"
  },
  headerCategoria: {
    backgroundColor: "#F98806",
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36,
    flexDirection: "row",
    justifyContent: "center"
  },
  roll: {
    width: 300,
    position: 'relative',
    flexDirection: "row",
    left: 3
  },
  search: {
    position: 'relative',
    top: -8,
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  arrow: {
    position: 'relative',
    top: 4,
    right: 45
  },
  text: {
    position: 'relative',
    width: 300,
    textDecorationColor: "#FFF",
    color: "#FFFFFF",
    fontSize: 15,
    top: -1,
    left: 5,
    fontFamily: "Roboto",
    height: 36,
    alignItems: "flex-end",
    justifyContent: "flex-end"

  },
  txtUbicacion: {
    position: 'relative',
    color: "#FFFFFF",
    fontSize: 18,
    paddingLeft: 13,
    fontFamily: "Roboto",
    height: 36,
    width: 325
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

  txtCategoria: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36,
    justifyContent: "center",
    borderColor: "#F98806",
    borderWidth: 1,
    alignContent: "center"
  },

  imgProducto: {
    height: 130,
    width: '100%'
  },
  contenidoProducto: {
    alignItems: 'flex-start',
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 10,
    marginRight: 10
  },

  txtProducto: {
    color: '#4e4e4d',
    fontSize: 13,
    fontFamily: 'LemonMilkbolditalic',
  },

  txtPrecio: {
    color: '#8a8a8a',
    fontSize: 13,
    fontFamily: 'LemonMilkbolditalic',
    textDecorationLine: 'line-through',
  },
  txtPrecioDesc: {
    color: '#f98806',
    fontSize: 13,
    fontFamily: 'LemonMilkbolditalic',
  },
  txtDescripcion: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: '#4e4e4e',
    textAlign: 'center'
  },

  opcionesProducto: {
    flex: 1,
    flexDirection:'column'
  },

  opcion: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
  },
  opcion_text: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: "Roboto",
    color: '#4e4e4d',
    fontStyle: 'italic'
  },
  cantidad: {
    fontFamily: 'Roboto',
    fontSize: 19,
  },
  input: {
    flexDirection: "row",
  },
  text_numeric: {
    color: "#4e4e4d",
    fontFamily: "LemonMilkbolditalic",
    fontSize: 18,
    borderColor: "#5e605d",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  fieldMore: {
    width: 20,
    height: 20,
  },

  more: {
    color: "#4e4e4d",
    fontFamily: "LemonMilkbolditalic",
    fontSize: 18,
    borderColor: "#5e605d",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  fieldLess: {
    width: 20,
    height: 20,
    top: 20,
    left: -20,
  },
  less: {
    color: "#4e4e4d",
    fontFamily: "LemonMilkbolditalic",
    fontSize: 18,
    borderColor: "#5e605d",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  contedorBTN: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    backgroundColor: '#4baa2b',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 2,
    width: 125,
    alignContent: 'center'
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold'
  }
});
