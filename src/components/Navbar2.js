import React from "react";
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, BackHandler, AsyncStorage, Alert, Platform, Button } from "react-native";
import PopMenu from "../components/PopupMenu";
import Icon from "react-native-vector-icons/Ionicons";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";

import SearchBar from "react-native-searchbar";

const Header = props => (
    <View style={styles.headerIOS}>
        <Text style={styles.txtIOS}>Oculto</Text>
    </View>
);

const HiddenHeader = Platform.select({
    ios: <Header />
});

type Props = {};

export default class Navbar2 extends React.Component {
    constructor(props) {
        super(props);
        this.state= {

            texto:""

        }

    }

    BuscarProducto = () =>{

        const {texto} = this.state;
        const {navigation} = this.props;

        const lugar = navigation.getParam("lugar","NO-NAME");
        const lugarId = navigation.getParam("lugarId","NO-NAME");
        const usuarioId = navigation.getParam("userId","NO-NAME");
        const categoria = navigation.getParam("categoria","NO-NAME");
        if (texto === "") {
            Alert.alert("","No se ha ingresado búsqueda");
            this.setState({texto: ""});
            this.searchBar.hide();
        }else {
            navigation.navigate("ProductosSearch", {lugar: lugar,categoria: categoria,producto: texto, lugarId: lugarId, userId: usuarioId});
            this.setState({texto: ""});
            this.searchBar.hide();
        }


    }

    render() {
        return (
            <View>
                <View>{HiddenHeader}</View>
                <View style={styles.headerSite}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <TouchableOpacity style={styles.roll} onPress={() => this.props.navigation.navigate('Lugares')}>
                            <Text>
                                <Icon name={Platform.OS === "ios" ? "ios-pin" : "md-pin"} color="#FFF" size={26} />
                            </Text>
                            <Text style={styles.text}>
                                {" " + this.props.nombre + " "}
                                <Icon name={Platform.OS === "ios" ? "ios-arrow-down" : "md-arrow-dropdown"} color="#FFF" size={24} />
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{position: "relative", marginTop:10}}>
                        <TouchableOpacity style={styles.button} onPress={()=> this.searchBar.show()}>
                            <Icon
                                name={Platform.OS === "ios" ? "ios-search" : "md-search"}
                                style={styles.icono}
                                size={25}
                            />
                        </TouchableOpacity>

                    </View>
                    <SearchBar
                        ref={(ref) => this.searchBar = ref}
                        placeholder={I18n.t("busquedaProducto.txtBuscar")}
                        handleChangeText={texto => this.setState({ texto })}
                        onSubmitEditing={() => this.BuscarProducto()}

                    />

                    <View style={{ position: "relative" }}>
                        <PopMenu />
                    </View>
                    <View></View>



                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerSite: {
        width: '100%',
        paddingTop: 4,
        paddingLeft: 4,
        flexDirection: "row",
        alignItems: 'flex-end',
        justifyContent:'flex-end',
        backgroundColor: "#F98806"
    },
    roll:{
        width:300,
        position:'relative',
        flexDirection: "row",
        left:3
    },
    text: {
        position: 'relative',
        width:300,
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
    wrapper: {},
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
    button: {
        borderRadius: 359,
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center"
    },
    icono: {
        // position: "relative",
        marginTop:-6,
        color: "#FFF"
    }
});