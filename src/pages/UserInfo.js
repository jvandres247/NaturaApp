import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Image, Platform, BackHandler, AsyncStorage, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { withNavigation } from "react-navigation";
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

type Props = {};

class UserInfo extends Component<Props> {
    static navigationOptions = {
        header: null
    };

    constructor(Props){
        super(Props);
        this._isMount= false,
        this.state= {

            username:"",
            tipo_plan:"",
            habitacion:""

        }
    }

    componentDidMount() {

        this._isMount = true;
        this._isMount && this.getDataUser();

    }

    componentWillUnmount() {
        this._isMount = false;
    }

    getDataUser = async () => {

        this.setState({
            username: await AsyncStorage.getItem("User"),
            tipo_plan: await AsyncStorage.getItem("typePlan"),
            habitacion: await AsyncStorage.getItem("RoomUsr")
            
        });
    }


    handleBackButtonClick() {
        const { navigation } = this.props;
        navigation.goBack(null);
        return true;
    }

    render() {
         const {username,tipo_plan, habitacion} = this.state;
        return (
            <View style={styles.container}>
                <View>{HiddenHeader}</View>
                <View style={styles.subHeader}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.handleBackButtonClick()}>
                            <Text style={styles.txtSubheader}>{I18n.t("userInfo.txtLabelUser")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.empty}>
                    <View>
                        <Text style={styles.textInfo}>
                            <Icon name={Platform.OS === "ios" ? "ios-person" : "md-person"} color="#8a8a8a" size={25} /> 
                            {" "}{I18n.t("userInfo.txtUsuario")}: {username}
                        </Text>
                        <Text style={styles.textInfo}>
                            <Icon name={Platform.OS === "ios" ? "ios-cafe" : "md-cafe"} color="#8a8a8a" size={25}/> 
                            {" "}{I18n.t("userInfo.txtTipo")}: {tipo_plan}
                        </Text>
                        <Text style={styles.textInfo}>
                            <Icon name={Platform.OS === "ios" ? "ios-bed" : "md-bed"} color="#8a8a8a" size={25} />
                            {" "}{I18n.t("userInfo.txtHabitacion")}: {habitacion}
                        </Text>
                    </View>
                    <View>
                        <Image style={styles.logo} source={require("../images/iconoUser.png")} />
                    </View>
                </View>
                <View style={styles.menu}>
                    <TouchableOpacity style={styles.btnMakePayment} onPress={() => this.handleBackButtonClick()}>
                        <Text style={styles.buttonText}>{I18n.t("userInfo.btnAceptar")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
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

    textInfo: {
        color: "#4e4e4d",
        fontSize: 18,
        fontFamily: "Roboto",
        textAlign: 'left',
        marginBottom: 15
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
        fontWeight: "bold",
        height: 36,
        justifyContent: "center",
        alignContent: "center",
        marginTop: 15
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
        width: "100%"
    },

    empty: {
        flex: 1,
        marginTop: 60,
        alignItems: "center",
        alignContent: "center"
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
    btnMakePayment: {
        backgroundColor: "#5e605d",
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
    logo: {
        height: 150,
        width: 150,
        marginTop: 90,
        marginBottom: 5
    },
});

export default withNavigation(UserInfo);