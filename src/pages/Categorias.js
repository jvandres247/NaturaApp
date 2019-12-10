import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    FlatList,
    ImageBackground,
    Platform,
    BackHandler, 
    AsyncStorage, 

} from "react-native";
import { withNavigation } from "react-navigation";
import Menu from "../components/Menu";
import { info_api } from '../api/Variables';
import Navbar from "../components/Navbar2";



type Props = {};

class Categorias extends Component<Props> {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            loading: false,
            data: [],
            page: 1,
            error: null,
            refreshing: false,
            dialogVisible: false, 
            total_items: 0,
            lugar:"",
            lugarId:"",
            usuarioId:""
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    }

    componentWillMount() {
        this._isMounted = true
        this._isMounted && BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentDidMount() {
        this._isMounted = true
        this._isMounted && this.makeRemoteRequest();
        this._isMounted && this.retrieveItem();
    }

    componentWillUnmount() {
        this._isMounted = false;
        BackHandler.removeEventListener(
            "hardwareBackPress",
            this.handleBackButtonClick
        );
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

    handleBackButtonClick() {
        const {navigation} = this.props;
        const lugar = navigation.getParam("lugar", "NO-NAME");
        const lugarId = navigation.getParam("lugarId", "NO-NAME");
        const usuarioId = navigation.getParam("userId", "NO-NAME");
        navigation.navigate('InicioApp', { lugar: lugar,lugarId: lugarId, userId: usuarioId });
        return true;
    }

    makeRemoteRequest = async () => {

        const { navigation } = this.props;
        const { page } = this.state;
        const lugarId = navigation.getParam("lugarId", "NO-NAME");
        const usuarioId = navigation.getParam("userId", "NO-NAME");
        this.setState({ loading: true });

         fetch(info_api.url + "categorias/find_by_lugar?lugarId=" + lugarId +"&usuarioId="+usuarioId +"&page=" + this.state.page, {

            headers: {
                "Natura-Api-Key": info_api.api_key
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    data: page === 1 ? responseJson.categorias : [...this.state.data, ...responseJson.categorias],
                    error: responseJson.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => { this.setState({ error, loading: false }); })
            .done();

    }

    handleRefresh = () => {
        this.setState({
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
        return this.state.loading ? null : null
    };

    renderItem = ({ item }) => {
        return (
            <TouchableHighlight onPress={() => this.getProductos(item)}>
                <View>
                    <ImageBackground style={styles.image_categoria} source={{ uri: item.url_image }}>
                        <View style={styles.fondo}>
                            <Text style={styles.titulo}>{item.nombre}</Text>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableHighlight>
        );
    };

    getProductos = async (item) => {
        const { navigation } = this.props;
         await AsyncStorage.setItem("categoriaId", item.id.toString());
         await AsyncStorage.setItem("categoria", item.nombre.toString());

            await AsyncStorage.getItem("lugar")
                .then(lugar => {
                    navigation.navigate("Productos",{categoria: item.nombre, lugar: lugar.toString()});
                });


    }
    render() {
        const { navigation } = this.props;
        const username = navigation.getParam("username","NO-NAME");
        const nombre = navigation.getParam("lugar", "NO-NAME");
        const usuarioId = navigation.getParam("userId","NO-NAME");
        const lugarId = navigation.getParam("lugarId","NO-NAME");
        return (
            <View style={styles.container}>
                <View>
                    <Navbar nombre={nombre} navigation={navigation}></Navbar>
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
                <View style={{ marginTop: 49 }} >
                   <Menu total_items={this.state.total_items} lugar={nombre} userId={usuarioId} lugarId={lugarId} username={username}/>
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

    image_categoria: {
        height: 155,
        justifyContent: "flex-end"
    },
    fondo: {
        backgroundColor: "rgba(67,59,49,0.40)",
        height: 45,
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    titulo: {
        fontFamily:'LemonMilkbolditalic',
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: "center",
        marginLeft: 5
    },

    loader: {
        marginTop: 10,
        alignItems: 'center',
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
        height: 25,
        marginLeft: 8
    },
});

export default withNavigation(Categorias);