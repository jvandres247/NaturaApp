import React, { Component } from 'react';

import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, AsyncStorage, Linking } from "react-native";

import { withNavigation } from 'react-navigation';
import { info_api } from "../api/Variables";
import { CheckBox } from "react-native-elements";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";


class AllIncluded extends Component<Props>{
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
            NoIncluded: '',
            orden: '',
            userId: '',
            tipo_pago: "Todo Incluido",
            saldo: '',
            total: '',
            min_trans: 0,
            time_skip: 0,
            mensaje: '',
            checked: false,
            disabled: true,
            disabledCheck: false,
            username:"",
            texto: I18n.t("pagoIncluido.btnPagar")
        }
    }
    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.retrieveItem();
        this._isMounted && this.TimerCheck();

    }
    componentWillUnmount() {
        this._isMounted = false;


    };

    retrieveItem = async () => {
        try {
            const bookmarksString = await AsyncStorage.getItem('@MyStore:bookmarks');
            if (bookmarksString !== null) {
                const bookmarksArray = JSON.parse(bookmarksString);
                this.setState({ results: bookmarksArray });
                this.setState({ orden: this.state.results });

                var cadena = "";
                var cont = 0;
                var i = 0;
                this.setState({ NoIncluded: "" });
                while (i < this.state.results.length) {
                    if (this.state.results[i].todo_incluido !== true) {
                        cadena = cadena + "* " + this.state.results[i].nombre + "\n";
                        cont++;
                    }
                    i++;
                }
                this.setState({ NoIncluded: cadena });
                this.setState({ userId: await AsyncStorage.getItem("usrID") });
            }
        } catch (error) {
            console.log(error.message);
        }



    }

    TimerCheck = async () => {
        var usuario_id = await AsyncStorage.getItem("usrID");
        var tiempo;
        var espera = 0;
        var message = "";

        await fetch(info_api.url + "pedidos/calculate_time_next_order?usuario_id=" +
            usuario_id.toString() + "&tipo_pago=" + this.state.tipo_pago, {
                headers: {
                    "Natura-Api-Key": info_api.api_key
                },
            }
        )
            .then((response) => response.json())
            .then((responseData) => {
                message = responseData.mensaje;
                if (message === "Si hay pedidos") {
                    tiempo = responseData.tiempo_transcurrido;
                    this.setState({ min_trans: tiempo });

                    if (tiempo < 90) {
                        this.setState({ time_skip: espera = 90 - tiempo });
                    } else {
                        this.setState({ min_trans: tiempo });
                    }
                } else {
                    this.setState({ mensaje: message });
                    this.setState({ min_trans: responseData.tiempo_transcurrido });
                }
            })
            .catch((error) => {

                Alert.alert("", error.toString());
            })
            .done();
    }
    DisabledPayButton = () => {
        this.setState({ disabled: !this.state.disabled });
        this.setState({disabledCheck: !this.state.disabledCheck});
        this.setState({texto:I18n.t("pago.btnProcess")});
    }

    InputChecked = () => {
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
        this.setState({ NoIcluded: "" });
    }
    Failed_Pay = () => {
        const { navigation } = this.props;
        const lugar = navigation.getParam("lugar", "NO-NAME");
        navigation.navigate("PagoErroneo", { lugar: lugar })
    }
    CheckBoxCheck = () => {
        this.setState({ checked: !this.state.checked })
        this.setState({ disabled: !this.state.disabled })

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

        fetch(info_api.url + "pedidos/conekta_create", {
            method: 'POST',
            headers: {
                "Natura-Api-Key": info_api.api_key
            },
            body: JSON.stringify(compras)
        }
        )
            .then((response) => response.json())
            .then((responseData) => {
                var estado = responseData.response.estado;
                estado === "Pagado" ? this.SuccessFull_Payment() : this.Failed_Pay();
            })
            .catch((error) => {

                Alert.alert("", error.toString());
            })
            .done();
    }


    render() {
        const { navigation } = this.props;
        const lugar = navigation.getParam("lugar", "NO-NAME");
        if (this.state.NoIncluded !== "") {
            return (
                <View style={{ alignContent: "center", justifyContent: "center", alignItems: "center" }} >
                    <Text style={{ marginLeft: 15, fontFamily: 'Roboto', fontSize: 14 }}>{I18n.t("pagoIncluido.txtInfoProductos")}</Text>
                    <Text style={{ fontWeight: "bold", fontFamily: 'Roboto', fontSize: 14 }} >{"\n" + this.state.NoIncluded.toString()}</Text>
                    <Text style={{ marginLeft: 15, fontFamily: 'Roboto', fontSize: 14 }}>{I18n.t("pagoIncluido.txtEliminarUno")}{" "}<Text style={{ color: "#F98806", textDecorationLine: "underline" }} onPress={() => navigation.navigate("ShoppingCart", { lugar: lugar })}>{I18n.t("pagoIncluido.txtLinkProducto")}</Text>{" "}{I18n.t("pagoIncluido.txtEliminarDos")}</Text>
                </View>
            )
        } else {
            if (this.state.min_trans > 90) {
                return (
                    <View style={styles.container}>
                        <View style={styles.box1}>
                            <View style={styles.contenedorPago}>
                                <Text style={styles.nota}>
                                    {I18n.t("pagoIncluido.txtNotaUno")}<Text style={{ color: "#F98806" }} >{I18n.t("pagoIncluido.txtTiempo")}</Text>{" "}{I18n.t("pagoIncluido.txtNotaDos")}
                                </Text>
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
                                    disabled={this.state.disabledCheck}
                                />
                            </View>
                            <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: '100%', backgroundColor: this.state.disabled ? "#5E605D" : '#4BAA2B', height: 50 }} disabled={this.state.disabled} onPress={() => this.InputChecked()}>
                                <Text style={this.state.disabled ? styles.botonPagarInactivo : styles.botonPagarActivo}>{I18n.t("pagoIncluido.btnPagar")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
            else {
                var tiempo = 0;
                tiempo = 90 - this.state.min_trans;
                return (
                    <View style={styles.container}>
                        <View style={styles.box2}>
                            <View style={styles.contenedorTiempo}>
                                <Text style={styles.notaTiempo} >{I18n.t("pagoIncluido.txtNotaTiempoUno")}
                                    <Text style={{ color: "#F98806" }}>{" " + tiempo + " "}</Text>
                                    {I18n.t("pagoIncluido.txtNotaTiempoDos")}</Text>
                            </View>
                        </View>
                    </View>
                )
            }

        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    box1: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '25%'
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
        backgroundColor: '#E6E6E6',
        alignItems: 'center'
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
        fontSize: 18,
        fontFamily: "Roboto",
        fontWeight: 'bold'
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
    },
    nota: {
        color: "#4e4e4d",
        fontSize: 16,
        fontFamily: "Roboto",
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center'
    },
    notaTiempo: {
        color: "#4e4e4d",
        fontSize: 18,
        fontFamily: "Roboto",
        fontWeight: 'bold',
        marginRight: 15,
        marginLeft: 15,
        width: '100%',
        textAlign: 'center'
    },
    contenedorTiempo: {
        flexDirection: 'row',
        width: '95%',
        justifyContent: "center",
        alignItems: 'center',
        height: 55,
        backgroundColor: '#E6E6E6',
        alignItems: 'center'
    }
});

export default withNavigation(AllIncluded);
