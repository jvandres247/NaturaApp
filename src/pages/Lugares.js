import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    FlatList,
    ImageBackground,
    ActivityIndicator,
    BackHandler,
    AsyncStorage,
    Alert,
    Platform
} from "react-native";
import { info_api } from '../api/Variables';
import { withNavigation } from "react-navigation";
import PopMenu from "../components/PopupMenu";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";



const Header = props => (
    <View style={styles.headerIOS}>
        <Text style={styles.txtIOS}>Oculto</Text>
    </View>
);

const HiddenHeader = Platform.select({
    ios: <Header />
});




class Lugares extends React.Component {
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


        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);




    }

    componentWillMount() {

        this._isMounted = true;
        this._isMounted && BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentDidMount() {

        this._isMounted = true;
        this._isMounted && this.makeRemoteRequest();
        this._isMounted && BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);

    }

    componentWillUnmount() {

        this._isMounted = false;
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);

    }


    handleBackButtonClick = () => {
        this._handleOnPress();
        return true;
    }

    _handleOnPress = () => {
        this._ExitApp();
    }

    _ExitApp = async () => {
        BackHandler.exitApp();
    };

    makeRemoteRequest = () => {



        const { page } = this.state;
        this.setState({ loading: true });

        AsyncStorage.getItem("usrID")
            .then(userId => {
                        if(userId.toString() !== ""){
                                fetch(info_api.url + "lugares?page="+this.state.page+"&usuarioId="+userId.toString(), {
                                    // fetch(info_api.url + "lugares?page=" + this.state.page, {
                                    headers: {
                                        "Natura-Api-Key": info_api.api_key
                                    }
                                })
                                    .then(response => response.json())
                                    .then(responseJson => {
                                        this.setState({
                                            data: page === 1 ? responseJson.lugares : [...this.state.data, ...responseJson.lugares],
                                            error: responseJson.error || null,
                                            loading: false,
                                            refreshing: false
                                        });
                                    })
                                    .catch( error => {this.setState({ error, loading: false }); })
                                    .done();
                            }else{
                                Alert.alert("El usuario ha sido deshabilitado");
                                this.props.navigation.navigate("Login");

                            }

            });

    };

    handleRefresh = () => {
        this.setState({
                page: 1,
                refreshing: true
            },
            () => {
                this.makeRemoteRequest();
            });
    };

    handleLoadMore = () => {
        this.setState({
                page: this.state.page + 1
            },
            () => {
                this.makeRemoteRequest();
            });
    };

    renderFooter() {
        return this.state.loading ? null : null;
        }

    getCategorias(item) {
        this.props.navigation.navigate("Categorias", { lugar: item.nombre });

    }

    async  getMenu(item) {
        await AsyncStorage.getItem("usrID")
            .then(usuarioId => {
                this.props.navigation.navigate("InicioApp", { lugar: item.nombre, lugarId: item.id, userId: usuarioId});
                AsyncStorage.setItem("lugar", item.nombre);
                AsyncStorage.setItem("lugarId", item.id.toString());
            })

    }

    renderItem = ({ item }) => {
        return (
            <TouchableHighlight onPress={() => this.getMenu(item)}>
                <View>
                    <ImageBackground
                        style={styles.image_lugar}
                        source={{ uri: item.url_image }}>
                        <View style={styles.fondo}>
                            <Text style={styles.titulo}>{item.nombre}</Text>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableHighlight>
        );
    };

    render() {
        return (
            <View style={styles.list}>
                <View>{HiddenHeader}</View>
                <View style={styles.headerSite}>
                    <View style={{flex: 1, justifyContent:'flex-start', alignItems:'flex-start'}}>
                        <Text style={styles.text}>{I18n.t("ubicacionHeader.txtUbicacion")}</Text>
                    </View>
                    <View>
                        <PopMenu />
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
            </View>
        );
    }
}


const styles = StyleSheet.create({
    headerSite: {
        width: '100%',
        paddingTop: 6,
        paddingLeft: 5,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent:'flex-end',
        backgroundColor: "#F98806"
    },

    text: {
        color: "#FFFFFF",
        fontSize: 18,
        fontFamily: "Roboto",
        paddingRight: 10,
        justifyContent: "flex-end",
        alignContent:'flex-end',
        alignItems:'center',
        height: 36

    },

    image_lugar: {
        height: 155,
        justifyContent: "flex-end"
    },

    list: {
        flex: 1
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

    containerPop: {
        position: "relative",
        paddingTop: -10,
        paddingLeft: 105,
        backgroundColor: "#F98806",
        justifyContent: "flex-end"
    },

    button: {
        backgroundColor: "#F98806",
        borderRadius: 359,
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center"
    },

    icono: {
        position: "relative",
        marginTop: 2,
        color: "#FFF"
    },

    headerIOS: {
        backgroundColor: "#F98806",
        color: "#FFFFFF",
        fontSize: 18,
        fontFamily: "Roboto",
        height: 15,
        justifyContent: "center"
    },
    txtIOS: {
        color: "#F98806",
        fontSize: 18,
        fontFamily: "Roboto",
        height: 20,
        marginLeft: 8
    },
});

export default withNavigation(Lugares);
