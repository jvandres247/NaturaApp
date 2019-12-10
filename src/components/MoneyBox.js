import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler, AsyncStorage, Dimensions, Platform, Linking } from "react-native";
import { withNavigation } from 'react-navigation';
import { info_api } from "../api/Variables";
import { CheckBox } from "react-native-elements";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";



class MoneyBox extends Component<Props>{
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

        this.state = {
            results: [],
            orden: '',
            userId: '',
            tipo_pago: "Caja",
            saldo: "",
            total: "",
            disabled: true,
            checked: false,
            disabledCheck: false,
            caja: "",
            pago: "",
            username:"",
            texto: I18n.t("pago.btnPagar")
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.retrieveItem();

    }

    componentWillUnmount() {
        this._isMounted = false;
            };

    makeRemoteRequest = async () => {
        var user = await AsyncStorage.getItem("User");


        fetch(info_api.url + "usuarios/find_by_user?username=" + user.toString(),
            {
                headers: {
                    "Natura-Api-Key": info_api.api_key
                }
            }
        )
            .then(res => res.json())
            .then(response => {

                this.setState({ saldo: response.usuario.deposito });

                caja = parseFloat(this.state.saldo.toString());
                pago = parseFloat(this.state.total.toString());


            }).catch(error => error)
            .done();
    }
    retrieveItem = async () => {
        try {
            const bookmarksString = await AsyncStorage.getItem('@MyStore:bookmarks');
            if (bookmarksString !== null) {
                const bookmarksArray = JSON.parse(bookmarksString);
                this.setState({ results: bookmarksArray });

                this.setState({ orden: this.state.results });
                this.setState({ userId: await AsyncStorage.getItem("usrID") });
                this.setState({ total: await AsyncStorage.getItem("subtotal") })
                this.setState({ username: await AsyncStorage.getItem("User")});
                this.makeRemoteRequest();
            }
        } catch (error) {
            console.warn(error);
        }


    }

    CheckBoxCheck = () => {
        this.setState({ checked: !this.state.checked })
        this.setState({ disabled: !this.state.disabled })
    }
    UncheckedBox = () => {
        this.setState({ checked: !this.state.checked });
        this.setState({ disabled: !this.state.disabled });
    }

    DisabledPayButton = () => {
        this.setState({ disabled: this.state.disabled });
        this.setState({disabledCheck: !this.state.disabledCheck});
        this.setState({texto:I18n.t("pago.btnProcess")});
    }

    InputChecked =   () => {
        const {navigation} = this.props;
        var code="";
        var active="";
        this.DisabledPayButton();
        AsyncStorage.getItem("User")
            .then( username =>{

                if(username.toString() !== ""){
                    //aqui se debe checar si el usuario sigue activo

                    fetch(info_api.url + "usuarios/find_by_user?username=" + username.toString(),
                        {
                            headers: {
                                "Natura-Api-Key": info_api.api_key
                            }
                        }
                    )
                        .then(res => res.json())
                        .then(response => {
                            code = JSON.stringify(response.code);

                            switch (code) {
                                case "200":
                                    active = JSON.stringify(response.usuario.activo);

                                    if (active === "true") {
                                        this.OrderPay();
                                    } else {
                                        AsyncStorage.setItem("User", "");
                                        AsyncStorage.setItem("usrID", "");
                                        AsyncStorage.setItem("typePlan", "");
                                        AsyncStorage.setItem("session", "false");
                                        AsyncStorage.setItem("@MyStore:bookmarks", "");
                                        AsyncStorage.setItem("active", "false");
                                        Alert.alert("", "El usuario ha sido deshabilitado");
                                        navigation.navigate("Login");
                                    }
                                    break;
                                default:

                            }
                        }).catch(error => alert(error))
                        .done();
                    ////aqui termina
                }else
                {
                    AsyncStorage.setItem("User", "");
                    AsyncStorage.setItem("usrID", "");
                    AsyncStorage.setItem("typePlan", "");
                    AsyncStorage.setItem("session", "false");
                    AsyncStorage.setItem("@MyStore:bookmarks", "");
                    AsyncStorage.setItem("active", "false");
                    Alert.alert("", "El usuario ha sido deshabilitado");
                    navigation.navigate("Login");
                }

            })

    }
    SuccessFull_Payment = () => {

        const { navigation } = this.props;
        const lugar = navigation.getParam("lugar", "NO-NAME");
        navigation.navigate("PagoExitoso", { lugar: lugar });
        AsyncStorage.setItem("@MyStore:bookmarks", "");
        AsyncStorage.setItem("subtotal", "");
    }
    Failed_Pay = () => {
        const { navigation } = this.props;
        const lugar = navigation.getParam("lugar", "NO-NAME");
        navigation.navigate("PagoErroneo", { lugar: lugar })
    }
    OrderPay = () => {
        const { navigation } = this.props;
        const lugar = navigation.getParam("lugar", "NO_NAME");
        const { orden } = this.state;
        const { userId } = this.state;
        const productos = orden;
        var compras = {
            "order": productos,
            "usuarioId": userId,
            "token": "",
            "tipo_pago": this.state.tipo_pago,
            "lugar": lugar,
            "calificacion": 0,
            "calificado": false
        }
        console.log(compras);

        fetch(info_api.url + "pedidos/conekta_create", {
            method: 'POST',
            headers: {
                "Natura-Api-Key": info_api.api_key
            },
            body: JSON.stringify(compras)
        }
        )
            .then(response => response.json())
            .then(responseData => {

                 console.warn(JSON.stringify(responseData));
                 var estado = responseData.response.estado.toString();
                 estado === "Pagado" ? this.SuccessFull_Payment() : this.Failed_Pay()

            })
            .catch((error) => {
                Alert.alert("", error.toString());
            })
            .done();
    }
    render() {
        const { saldo } = this.state;
        const { total } = this.state;
        caja = parseFloat(this.state.saldo.toString());
        pago = parseFloat(this.state.total.toString());

        if (caja >= pago) {
            return (
                <View style={styles.container}>
                    <View style={styles.box1}>
                        <View style={styles.contenedorPago}>
                            <Text style={{ paddingLeft: 20, fontWeight: 'bold', fontSize: 18, fontFamily: 'Roboto' }}>{I18n.t("pago.txtTotalPagar")}</Text>
                            <Text style={{ paddingLeft: 20, color: '#F98806', fontWeight: 'bold', fontSize: 18, fontFamily: 'Roboto' }}> {"$" + total.toString() + " MXN"} </Text>
                        </View>
                    </View>
                    <View style={styles.box2}>
                        <View style={styles.contendorInformacion}>
                            <Text style={styles.textoOrden}>{I18n.t("pagoDeposito.txtCaja")}{"$" + saldo.toString() + " MXN"} {'\n'}</Text>
                            <Text style={styles.textoOrden}>{I18n.t("pagoDeposito.txtTotal")}{"$" + total.toString() + " MXN"}{'\n'}</Text>
                            <Text style={styles.textoOrden}>{I18n.t("pagoDeposito.txtRestante")}{"$" + (saldo.toString() - total.toString()) + " MXN"}</Text>
                        </View>
                    </View>
                    <View style={styles.box3}>
                        <View style={styles.contendorInformacion}>
                            <CheckBox
                                title={
                                    <Text>
                                        {I18n.t("condicionesUso.txtCondicionesUno")}<Text style={styles.uso} onPress={() => Linking.openURL(info_api.urlPoliticas)}>{I18n.t("condicionesUso.txtCondicionesVerde")}</Text>{I18n.t("condicionesUso.txtCondicionesDos")}
                                    </Text>}
                                checked={this.state.checked}
                                checkedColor={"#4BAA2B"}
                                onPress={() => this.CheckBoxCheck()}
                                disabled= {this.state.disabledCheck}
                            />
                        </View>
                        <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: '100%', backgroundColor: this.state.disabled ? "#5E605D" : '#4BAA2B', height: 50 }} disabled={this.state.disabled} onPress={() => this.InputChecked()}>
                            <Text style={this.state.disabled ? styles.botonPagarInactivo : styles.botonPagarActivo} disabled={this.state.disabled}>{this.state.texto}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={styles.container}>
                    <View style={styles.box1}>
                        <View style={styles.contenedorPago}>
                            <Text style={{ paddingLeft: 20, fontWeight: 'bold', fontSize: 18, fontFamily: 'Roboto' }}>{I18n.t("pago.txtTotalPagar")}</Text>
                            <Text style={{ paddingLeft: 20, color: '#F98806', fontWeight: 'bold', fontSize: 18, fontFamily: 'Roboto' }}> {"$" + total.toString() + " MXN"} </Text>
                        </View>
                    </View>
                    <View style={styles.box2}>
                    <View style={styles.contendorInformacion}>
                            <Text style={styles.textoOrden}>{I18n.t("pagoDeposito.txtCaja")}{"$" + saldo.toString() + " MXN"} {'\n'}</Text>
                            <Text style={styles.textoOrden}>{I18n.t("pagoDeposito.txtTotal")}{"$" + total.toString() + " MXN"}{'\n'}</Text>
                            <Text style={styles.textoOrdenSD}>{I18n.t("pagoDeposito.txtRestante")}{"$" + (saldo.toString() - total.toString()) + " MXN"}</Text>
                        </View>
                    </View>
                    <View style={styles.box3}>
                        <View style={styles.contendorInformacion}>
                            <Text style={styles.textoOrden}>{I18n.t("pagoDeposito.txtSaldoInsuficiente")}</Text>
                        </View>
                    </View>
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    box1: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    box2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    box3: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contenedorPago: {
        flexDirection: 'row',
        width: '95%',
        justifyContent: "center",
        alignItems: 'center',
        height: 55,
        backgroundColor: '#E6E6E6'
    },
    contendorInformacion: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15
    },
    textoOrden: {
        color: "#4e4e4d",
        fontSize: 20,
        fontFamily: "Roboto",
        fontWeight: 'bold',
        textAlign: 'center'
    },
    textoOrdenSD: {
        color: "#ff0000",
        fontSize: 20,
        fontFamily: "Roboto",
        fontWeight: 'bold',
        textAlign: 'center'
    },
    botonPagarActivo: {
        textAlign: "center",
        color: "#fff",
        fontSize: 18,
        fontFamily: "Roboto",
        fontWeight: "bold",
    },
    botonPagarInactivo: {
        textAlign: "center",
        color: "rgba(255,255,255,0.30);",
        fontSize: 18,
        fontFamily: "Roboto",
        fontWeight: "bold",
    },
    uso: {
        color: '#4BAA2B'
    }
});

export default withNavigation(MoneyBox);
