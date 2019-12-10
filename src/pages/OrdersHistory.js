import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Image, Platform, BackHandler, AsyncStorage, TouchableOpacity, ActivityIndicator, Alert, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { withNavigation } from "react-navigation";
import Navbar from "../components/Navbar";
import { info_api } from '../api/Variables';
import Menu from "../components/Menu";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";

type Props = {};

class OrdersHistory extends Component<Props> {
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
            page: 1,
            data: [],
            error: null,
            refreshing: false,
            total_items: 0,
            userId: null
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        this._isMounted = true
        this._isMounted && this.retrieveItem();
    }


    componentWillMount() {
        this._isMounted = true;
        this._isMounted && this.makeRemoteRequest();
        this._isMounted && BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentWillUnmount() {
        this._isMounted = false;
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    makeRemoteRequest = async() => {
        const { page } = this.state;
        const {navigation} = this.props;
        const userId = await AsyncStorage.getItem("usrID");
        this.setState({ loading: true });
        fetch(info_api.url + "pedidos/find_by_user?usuario_id=" + userId + "&page=" + this.state.page, {
            headers: {
              "Natura-Api-Key": info_api.api_key
            }
        })
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.pedidos != null) {
                this.setState({
                    data: page === 1 ? responseJson.pedidos : [...this.state.data, ...responseJson.pedidos],
                    error: responseJson.error || null,
                    loading: false,
                    refreshing: false
                });
            }
        })
        .catch(error => {
            this.setState({ error, loading: false });
        });

    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
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
        return this.state.loading ? (
            <ActivityIndicator size="large" style={styles.loader} />
        ) : null;
    }

    qualify_product = async (calificacion, id) => {
        const { page } = this.state;
        const userId = await AsyncStorage.getItem("usrID");
        this.setState({ loading: true });
        datos = {
            calificacion: calificacion,
            id: id,
            calificado: true,
            usuario_id: userId
        }
        await fetch(info_api.url + "pedidos/update_pedido", {
            method: 'POST',
            headers: {
                "Natura-Api-Key": info_api.api_key
            },
            body: JSON.stringify(datos)
        })
        .then((response )=> response.json())
        .then((responseJson) => {
            Alert.alert(responseJson.mensaje);
            this.setState({
                data: page === 1 ? responseJson.pedidos : responseJson.pedidos,
                error: responseJson.error || null,
                loading: false,
                refreshing: false
            });
        })
        .done()
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

    renderItem = ({ item }) => {
        return (
            <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={{ flex: 1, flexDirection: "row", backgroundColor: "#F5F5F5", alignItems: "center", height: 75 }}>
                    <Image source={{ uri: item.imagen }} style={styles.img_product_cart} />
                    <View style={styles.item_column}>
                        <Text numberOfLines={1} style={styles.producto}>{item.producto}</Text>
                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity style={{left: 5}} onPress={() => this._isMounted && this.qualify_product(2, item.id)}>
                                <Icon name="md-happy" size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{left: 10}} onPress={() => this._isMounted && this.qualify_product(4, item.id)}>
                                <Icon name="md-happy" size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{left: 15}} onPress={() => this._isMounted && this.qualify_product(6, item.id)}>
                                <Icon name="md-happy" size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{left: 20}} onPress={() => this._isMounted && this.qualify_product(8, item.id)}>
                                <Icon name="md-happy" size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{left: 25}} onPress={() => this._isMounted && this.qualify_product(10, item.id)}>
                                <Icon name="md-happy" size={30} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                        <Text style={styles.precio_descuento}>${item.precio} MXN</Text>
                        <Text style={styles.fecha_pedido}>{item.fecha_pedido}</Text>
                    </View>
                </View>
                <View style={{ height: 2, backgroundColor: "rgba(94, 96, 93, 0.30)" }} />
            </View>
        );
    }

    render() {
        const { navigation } = this.props;
        const nombre = navigation.getParam("lugar", "NO-NAME");
        const usuarioId = navigation.getParam("userId","NO-NAME");
        const lugarId = navigation.getParam("lugarId","NO-NAME");
        return this.state.data.length > 0 ? (
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
                            <Text style={styles.txtSubheader}>{I18n.t("misPedidos.txtPedidos")}</Text>
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
                    // ListFooterComponent={() => this.renderFooter()}
                />
                <View style={{marginTop: 49}} >
                    <Menu total_items={this.state.total_items} lugar={nombre} userId={usuarioId} lugarId={lugarId}/>
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
                            <Text style={styles.txtSubheader}>{I18n.t("misPedidos.txtPedidos")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.empty}>
                    <Text style={styles.txtEmpty}>{I18n.t("misPedidos.txtNotaCompra")}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("InicioApp", { lugar: nombre })}>
                        <View style={styles.linkMenu}>
                            <Text style={styles.link}>
                                <Icon name={Platform.OS === "ios" ? "ios-arrow-back" : "ios-arrow-back"} color="#F98806" size={20} />{" "}{I18n.t("misPedidos.txtBuscarMenu")}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 49}} >
                    <Menu total_items={this.state.total_items} lugar={nombre} userId={usuarioId} lugarId={lugarId}/>
                </View>
            </View>
        )
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
        width:36,
        height: 36,
        top:-6,
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
    empty: {
        flex: 1,
        marginTop: 60,
        alignItems: "center",
        alignContent: "center",
    },
    txtEmpty: {
        marginRight: 30,
        marginLeft: 45,
        fontSize: 20,
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
        color: "#F98806",
    },
    producto: {
        color: "#4e4e4d",
        fontFamily: "LemonMilkbolditalic",
        fontSize: 13,
        marginLeft: 5,
        marginRight: 1
    },
    img_product_cart: {
        width:75,
        height:75,
    },
    item_column: {
        flex: 1,
        flexDirection: "column"
    },
    fecha_pedido: {
        color: "#8a8a8a",
        fontFamily: "Roboto",
        fontSize: 13,
        marginRight: 20,
        textDecorationStyle: "solid",
        textDecorationColor: "#F98806"
    },
    precio_descuento: {
        color: "#f98806",
        fontFamily: "Roboto",
        fontSize: 18,
        marginRight: 20,
    },
});

export default withNavigation(OrdersHistory);