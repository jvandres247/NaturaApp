import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  BackHandler
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Menu from "./Menu";
import { withNavigation } from "react-navigation";
import { info_api } from '../api/Variables';
import Navbar from "../components/Navbar";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";
import Check from "../components/CheckUser";

type Props = {};

class Products extends Component<Props> {
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

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      loading: false,
      data: [],
      page: 1,
      error: null,
      refreshing: false,
      total_items: 0,
      lugar:"",
      userId:"",
      lugarId:"",
      categoriaId:"",
      bookmarksString:""

    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    this._isMounted = true;

    this._isMounted && this.makeRemoteRequest();
    this._isMounted && this.retrieveItem();
    this._isMounted && BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillUnmount() {
    this._isMounted = false;

    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    const { navigation } = this.props;
    navigation.goBack(null);
    return true;
  }

  makeRemoteRequest = () => {

    const {page} = this.state;
    this.setState({loading: true});

    Check.functions.checarUsuario();

           let keys = ['lugar', 'categoriaId', 'usrID'];
                AsyncStorage.multiGet(keys)
                    .then(result => {
                      fetch(info_api.url + "productos/find_by_categoria?categoriaId=" + result[1][1] + "&usuarioId=" + result[2][1] + "&page=" + this.state.page, {
                        headers: {
                          "Natura-Api-Key": info_api.api_key
                        }
                      })
                          .then(response => response.json())
                          .then(responseJson => {
                            this.setState({
                              data: page === 1 ? responseJson.productos : [...this.state.data, ...responseJson.productos],
                              error: responseJson.error || null,
                              loading: false,
                              refreshing: false
                            });
                          })
                          .catch(error => {
                            this.setState({error, loading: false});
                          });


                    });

  };




  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderFooter() {
    return this.state.loading ? null : null;
  }

  getDetalle = async (item) => {
    const { navigation } = this.props;
    await AsyncStorage.setItem("productoId", item.id.toString());
    await AsyncStorage.getItem("lugar")
        .then(lugar =>{
          navigation.navigate("DetailProduct",{lugar:lugar});
        })

  }

  storeData = async (item) => {


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
                  cantidad: 1,
                  opcion1:"",
                  opcion2:"",
                  opcion3:""
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
                cantidad: 1,
                opcion1: "",
                opcion2: "",
                opcion3: ""
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

  };

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
        orders[index].cantidad += 1;
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

  tag(text) {
    texto = ""
    if (text == true) {
      texto = I18n.t("productos.txtTodoInc");
    }
    return texto;
  }

  renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ flex: 1, flexDirection: "row", backgroundColor: "#F5F5F5" }}>
          <Image source={{ uri: item.url_image }} style={{ width: 120, height: 100 }} />
          <View style={{ flex: 1, flexDirection: "column", height: 100 }}>
            <Text numberOfLines={2} style={styles.estiloTitulo}>{item.nombre}</Text>
            <Text style={item.todo_incluido ? styles.estiloDescripcion : null}>{  this.tag(item.todo_incluido)}</Text>
            <Text style={styles.estiloPrecio}>${item.precio} MXN</Text>
            <Text style={styles.estiloPrecioDesc}>${item.precio_descuento_promocion ? item.precio_descuento_promocion : item.precio_descuento} MXN</Text>
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <TouchableOpacity onPress={() => this.getDetalle(item)}>
              <Text style={styles.estiloDetalles}>{I18n.t("productos.txtDetalles")}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.btnAgregar} onPress={() => this.storeData(item)} >
            <Icon name={Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"} color="#FFF" size={25} />
            <Text style={styles.btnTexto}>{"\n"}{I18n.t("productos.txtAgregar")}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 2, backgroundColor: "white" }} />
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const nombre = navigation.getParam("lugar", "NO-NAME");
    const categoria = navigation.getParam("categoria", "NO-NAME");
    const usuarioId = navigation.getParam("userId","NO-NAME");
    const lugarId = navigation.getParam("lugarId","NO-NAME");
    return (
      <View style={styles.container}>
        <View>
          <Navbar nombre={nombre} navigation={navigation}></Navbar>
        </View>
        <View style={styles.headerCategoria}>
          <View>
            <TouchableOpacity style={styles.btnRegreso} onPress={() => this.handleBackButtonClick()}>
              <Icon name={Platform.OS === "ios" ? "ios-arrow-back" : "ios-arrow-back"} color="#FFF" size={20} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.handleBackButtonClick()}>
              <Text style={styles.txtCategoria}>{categoria}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => this.renderFooter()}
        />
        <View style={styles.menuProduct}>
          <Menu   total_items={this.state.total_items} lugar={nombre} userId={usuarioId} lugarId={lugarId}/>
        </View>
      </View>
    );
  }
}

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
  roll: {
    width: 300,
    position: 'relative',
    flexDirection: "row",
    left: 3
  },

  arrow: {
    position: 'relative',
    top: 4,
    right: 45
  },

  search: {
    position: 'relative',
    top: -8,
    alignItems: "flex-end",
    justifyContent: "flex-end"
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

  headerCategoria: {
    backgroundColor: "#F98806",
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36,
    flexDirection: "row"
  },
  headerIOS: {
    backgroundColor: "#F98806",
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 25,
    justifyContent: "center"
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

  txtIOS: {
    color: "#F98806",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36,
    marginLeft: 8
  },

  image_lugar: {
    height: 155,
    justifyContent: "flex-end"
  },

  list: {
    flex: 1
  },

  menuProduct: {
    marginTop: 50
  },

  fondo: {
    backgroundColor: "rgba(67,59,49,0.40)",
    height: 45,
    justifyContent: "center"
  },

  titulo: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },

  loader: {
    marginTop: 10,
    alignItems: "center"
  },

  estiloTitulo: {
    color: "#4e4e4d",
    fontFamily: "LemonMilkbolditalic",
    fontSize: 13,
    marginLeft: 5,
    marginRight: 1
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

  estiloPrecio: {
    color: "#8a8a8a",
    fontFamily: "LemonMilkbolditalic",
    fontSize: 13,
    marginLeft: 5,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "#F98806"
  },

  estiloPrecioDesc: {
    color: "#4e4e4d",
    fontFamily: "LemonMilkbolditalic",
    fontSize: 13,
    marginLeft: 5
  },

  estiloDetalles: {
    color: "#F98806",
    fontFamily: "Roboto",
    fontSize: 14,
    textDecorationLine: "underline",
    marginRight: 3,
    marginBottom: 2
  },

  btnAgregar: {
    backgroundColor: "#4baa2b",
    width: 45,
    alignItems: "center",
    justifyContent: "center"
  },

  btnTexto: {
    color: "#fff",
    fontFamily: "Roboto",
    fontSize: 11
  }
});

export default withNavigation(Products);
