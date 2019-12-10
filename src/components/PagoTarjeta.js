import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
    ScrollView,
    AsyncStorage, BackHandler, Linking
} from "react-native";
import { withNavigation } from 'react-navigation';
import { CheckBox } from "react-native-elements";
import NumericInput from 'react-native-numeric-input';
import Conekta from 'react-native-conekta';
import { info_api } from '../api/Variables';
import Icon from "react-native-vector-icons/FontAwesome";
import Check from '../components/CheckUser';
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";

class PagoTarjeta extends Component<Props> {
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
            name: '',
            number: '',
            exp_year: 2019,
            exp_month: 1,
            cvc: '',
            //orden: '',
            userId: '',
            tipo_pago: "Tarjeta",
            disabled: true,
            checked: false,
            disabledCheck: false,
            total: "",
            errores: '',
            username:'',
            texto: I18n.t("pago.btnPagar")

        };

    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.retrieveItem();
    }

    componentWillUnmount() {
        this._isMounted = false;
        this._isMounted && this.InputChecked();
    };

    retrieveItem = async () => {
        try {
            const bookmarksString = await AsyncStorage.getItem('@MyStore:bookmarks');
            if (bookmarksString !== null) {
                const bookmarksArray = JSON.parse(bookmarksString);
                this.setState({ results: bookmarksArray });
                this.setState({ orden: this.state.results });
                this.setState({ userId: await AsyncStorage.getItem("usrID") });
                this.setState({ total: await AsyncStorage.getItem("subtotal") })
                this.setState({username: await AsyncStorage.getItem("User")});
            }
        } catch (error) {
            console.log(error);
        }


    }

    CheckBoxCheck = () => {
        this.setState({ checked: !this.state.checked })
        this.setState({ disabled: !this.state.disabled })
    }

    validate_name = () => {
        const { name } = this.state;
        var nombre = name.toString().toUpperCase();
        var pattern = /^[ A-ZÁÉÍÓÚÑ\s]+$/;
        var error_empty = "* El nombre del titular es un campo requerido \n";
        var error_format = "* El nombre no debe contener números o caracteres especiales \n";
        //Validación de input nombre
        if (nombre === "") {
            Alert.alert("", error_empty);
            this.UncheckedBox();
            return false;
        }

        if (pattern.test(nombre)) {
            return true;
        } else {
            Alert.alert("", error_format);
            this.UncheckedBox();
            return false;
        }
    }

    validate_number = () => {
        const { number } = this.state;
        var error_empty = " * El numero de tarjeta es un campo requerido \n";
        var error_size = " * El numero de tarjeta debe ser 13 digitos o bien 16 digitos, revise la información de su tarjeta \n";
        var cifras = number.toString();
        //Validación de input numero de tarjeta
        if (cifras === "") {
            Alert.alert("", error_empty);
            this.UncheckedBox();
            return false;
        } else {
            if (cifras.length == 13 || cifras.length == 16) {
                return true;
            } else {
                Alert.alert("", error_size);
                this.UncheckedBox();
                return false;
            }
        }
    }


    validate_cvv = () => {
        const { cvc } = this.state;
        var cifras = cvc.toString();
        var error_empty = "* El numero de seguridad CVC es un campo requerido\n";
        var error_size = "* El numero de seguridad CVC debe contener 3 digitos, revise la información de su tarjeta \n";
        //Validación de input CVC
        if (cifras === "") {
            Alert.alert("", error_empty);
            this.UncheckedBox();
            return false;
        } else {
            if (cifras.length < 3) {
                Alert.alert("", error_size);
                this.UncheckedBox();
                return false;
            } else {
                this.setState({ state_cvc: "true" });
                return true;
            }
        }
    }

    UncheckedBox = () => {
        this.setState({ checked: !this.state.checked });
        this.setState({ disabled: !this.state.disabled });
    }

    DisabledPayButton = () => {
        this.setState({ disabled: !this.state.disabled });
        this.setState({disabledCheck: !this.state.disabledChek});
        this.setState({texto:I18n.t("pago.btnProcess")});

    }

    InputChecked = () => {
        const {navigation} = this.props;
        var code="";
        var active="";
        if (this.validate_name() === true && this.validate_number() === true && this.validate_cvv() === true) {
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
    }
    SuccessFull_Payment = () => {

        const {navigation} = this.props;
        const lugar = navigation.getParam("lugar","NO-NAME");
        navigation.navigate("PagoExitoso", {lugar:lugar});
        AsyncStorage.setItem("@MyStore:bookmarks","");
        AsyncStorage.setItem("subtotal","");
    }

    Failed_Pay = () =>{
        const {navigation} = this.props;
        const lugar = navigation.getParam("lugar","NO-NAME");
        navigation.navigate("PagoErroneo",{lugar:lugar})
    }


    OrderPay = () => {

        Check.functions.checarUsuario();
        const { navigation } = this.props;
        const { name } = this.state;
        var nombre = name.toString().toUpperCase();
        const { number } = this.state;
        const { exp_month } = this.state;
        const { exp_year } = this.state;
        const { cvc } = this.state;
        const lugar = navigation.getParam("lugar", "NO_NAME");
        const { orden } = this.state;
        const { userId } = this.state;
        var _thisRef = this;



        var conektaKey="";



        var conektaApi = new Conekta();

        //hacer un fecth par aobtener el apykeyde conekta

        fetch(info_api.url+"/pedidos/get_conekta_key?usuarioId= "+ userId,
            {

                headers: {
                    "Natura-Api-Key": info_api.api_key
                }
            })
            .then(response => response.json())
            .then(conekta_Key =>{
                conektaKey =  conekta_Key;


                conektaApi.setPublicKey(conekta_Key.key.toString());
                conektaApi.api_version = info_api.conekta_api_version;

                conektaApi.createToken({

                        cardNumber: number.toString(),
                        name: nombre.toString(),
                        cvc: cvc.toString(),
                        expMonth: exp_month.toString(),
                        expYear: exp_year.toString()
                    },
                    function (data) {
                        if (data.id === undefined) {
                            Alert.alert(data.message_to_purchaser.toString());
                            _thisRef.UncheckedBox();
                        } else {
                            const productos = orden;

                            // console.warn(productos);
                            var compras = {
                                "order": productos,
                                "usuarioId": userId,
                                "token": data.id,
                                "tipo_pago": _thisRef.state.tipo_pago,
                                "lugar": lugar,
                                "calificacion": 0,
                                "calificado": false
                            }

                            //  console.warn(JSON.stringify(compras));

                            fetch(info_api.url + "pedidos/conekta_create", {
                                    method: 'POST',
                                    headers: {
                                        "Natura-Api-Key": info_api.api_key
                                    },
                                    body: JSON.stringify(compras)
                                }
                            )
                                .then((res) => res.json())
                                .then((response) => {


                                    var estado = response.response.estado.toString();

                                    estado.toString() === "Pagado" ? _thisRef.SuccessFull_Payment():_thisRef.Failed_Pay()

                                })
                                .catch((error) => {

                                    Alert.alert("", error.toString());
                                })
                                .done();
                        }
                    }, function (error) {
                        console.log('Error al procesar la orden');
                    })



            })
            .catch((error) => {

                Alert.alert("", error.toString());
            })

    }

    render() {
        const { total } = this.state;
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.box1}>
                    <View style={styles.contenedorPago}>
                        <Text style={{ paddingLeft: 20, fontWeight: 'bold', fontSize: 18, fontFamily: 'Roboto' }}>TOTAL A PAGAR:</Text>
                        <Text style={{ paddingLeft: 20, color: '#F98806', fontWeight: 'bold', fontSize: 18, fontFamily: 'Roboto' }}> {"$" + total.toString()} </Text>
                    </View>
                </View>
                <View style={styles.box2}>
                    <View style={styles.contendorDatos}>
                        <View style={{ alignItems: 'center', marginBottom: 12 }}>
                            <Text style={styles.datos}>Datos de la tarjeta</Text>
                        </View>
                        <View style={styles.contedorLogoCC}>
                            <Icon name='cc-visa' size={28}/>
                            <Icon name='cc-mastercard' size={28} style={{ marginLeft: 15 }}/>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <TextInput
                                ref={component => this._Name = component}
                                style={styles.Inputs}
                                placeholder={'Nombre del Titular de la Tarjeta'}
                                maxLength={50}
                                keyboardtype={"default"}
                                onChangeText={name => this.setState({ name })}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <TextInput
                                ref={component => this._Number = component}
                                style={styles.Inputs}
                                placeholder={'Número de Tarjeta'}
                                maxLength={16}
                                keyboardType={"numeric"}
                                onChangeText={number => this.setState({ number })}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.box3}>
                    <View style={styles.contendorFecha}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.datos}>Fecha de Vencimiento y CCV</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 12, marginTop: 10 }}>
                            <NumericInput
                                totalWidth={70}
                                totalHeight={40}
                                type='up-down'
                                editable={false}
                                minValue={1}
                                maxValue={12}
                                initValue={this.state.exp_month}
                                onChange={exp_month => this.setState({ exp_month })}
                            />
                            <Text style={{ width: 15 }}></Text>
                            <NumericInput
                                totalWidth={70}
                                totalHeight={40}
                                type='up-down'
                                editable={false}
                                minValue={2019}
                                maxValue={2031}
                                initValue={this.state.exp_year}
                                onChange={exp_year => this.setState({ exp_year })}
                            />
                            <TextInput
                                ref={component => this._CVC = component}
                                style={styles.InputSmall}
                                placeholder={'CVC'}
                                maxLength={4}
                                keyboardType={"numeric"}
                                onChangeText={cvc => this.setState({ cvc })}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.box4}>
                    <View style={styles.contendorInformacion}>
                        <CheckBox
                            title= {
                                <Text>
                                    He leído y estoy de acuerdo con las <Text style={styles.uso} onPress={ ()=> Linking.openURL(info_api.urlPoliticas)}>Condiciones de Uso</Text>{'\n'}del Servicio a tráves de la App
                                </Text>}
                            checked={this.state.checked}
                            checkedColor={"#4BAA2B"}
                            onPress={() => this.CheckBoxCheck()}
                            disabled={this.state.disabledCheck}

                        />
                    </View>
                    <TouchableOpacity style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        backgroundColor: this.state.disabled ? "#5E605D" : '#4BAA2B',
                        height: 50
                    }} disabled={this.state.disabled} onPress={() => this.InputChecked()}>
                        <Text style={styles.botonPagar}>{this.state.texto}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    box4: {
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
    contendorDatos: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contedorLogoCC: {
        flex: 1,
        flexDirection: 'row'
    },
    contendorFecha: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contendorInformacion: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botonPagar: {
        textAlign: "center",
        color: "#fff",
        fontSize: 18,
        fontFamily: "Roboto",
        fontWeight: "bold",
    },
    Inputs: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        width: '90%',
        height: 40,
        fontSize: 16,
        textTransform: 'uppercase',
        fontFamily: 'Roboto',
        borderColor: '#c0c0c0',
        textAlign: 'center'
    },
    InputSmall: {
        marginLeft: 15,
        marginRight: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '13%',
        height: 40,
        fontSize: 14,
        fontFamily: 'Roboto',
        borderColor: '#c0c0c0',
        textAlign: 'center'
    },
    datos:{
        color: "#4e4e4d",
        fontSize: 18,
        fontFamily: "Roboto",
        fontWeight: 'bold'
    },
    uso:{
        color: '#4BAA2B'
    }
});
export default withNavigation(PagoTarjeta);

