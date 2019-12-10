import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Alert,
    TouchableOpacity, AsyncStorage, BackHandler
} from 'react-native';
import { withNavigation } from 'react-navigation';
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";



const dataCheck = [
    {
        label: 'Estoy de Acuerdo',
        value: 1
    }
]
class Privacity extends Component<{}> {
    static navigationOptions = {
        header: null,
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
        this.state = {}
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.textos = {
            avisoTextoNegritaUno:
                "GRUPO LA ISLA HUATULCO",
            avisoTextNegritaDos: "GRUPO LA ISLA HUATULCO," +
                " HOTEL LA ISLA HUATULCO, HOTEL ISLA NATURA BEACH HUATULCO" +
                ", Y CLUB DE PLAYA LATITUD 15."
        };
    }
    componentDidMount = () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick() {
        this._handleOnPress();
        return true
    }
    _handleOnPress = () => {
        Alert.alert(
            'Cancelar operación ',
            'Al cancelar el aviso de privacidad, finalizará NATURAMovil',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                { text: 'Aceptar', onPress: () => this._LogOut() },
            ],
            { cancelable: false },
        );
    }
    _Cancelar = () => {
        this._handleOnPress();
    }
    _savePrivacity = async () => {
        const { navigation } = this.props;
        await AsyncStorage.setItem('session', 'true');
        await AsyncStorage.setItem('privacity', 'true');
        navigation.navigate('Lugares')
    }
    _LogOut = async () => {
        await AsyncStorage.setItem('session', 'false');
        await AsyncStorage.setItem('privacity', 'false');
        BackHandler.exitApp();
        this.componentWillUnmount();
    }
    _onSelect = (item) => {
        Alert.alert(item);
    };
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerSite}>
                    <Text style={styles.avisoTitulo}>{I18n.t("avisoPrivacidad.avisoTitulo")}</Text>
                </View>
                <ScrollView >
                    <View style={styles.wraper}>
                        <Text>{""}</Text>
                        <Text style={styles.avisoTextoNegrita}>{I18n.t("avisoPrivacidad.avisoSubTitulo")}</Text>
                        <Text>{""}</Text>
                        <Text style={styles.avisoTextoNegrita}>
                            {this.textos.avisoTextoNegritaUno}{" "}
                            <Text style={styles.avisoTextoNormal}>
                                {" "}{I18n.t("avisoPrivacidad.avisoParteUno")}{" "}
                            </Text>
                            <Text style={styles.avisoTextoNegrita} >{this.textos.avisoTextNegritaDos}</Text>{" "}
                            <Text style={styles.avisoTextoNormal}> {I18n.t("avisoPrivacidad.avisoParteDos")}{" "}</Text>
                            <Text style={styles.avisoTextoNegrita}>
                                {I18n.t("avisoPrivacidad.avisoDireccion")}
                            </Text>
                            <Text style={styles.avisoTextoNormal}>
                                {I18n.t("avisoPrivacidad.avisoFinal")}
                            </Text>
                            {"\n"}{"\n"}
                        </Text>
                    </View>
                    <View style={styles.contenedorTerminos}>
                        <Text style={styles.terminos}>
                            {I18n.t("avisoPrivacidad.avisoTerminos")}
                        </Text>
                    </View>
                    <View style={styles.contenedorBotones}>
                        <TouchableOpacity style={styles.botonAceptar} onPress={() => { this._savePrivacity() }} >
                            <Text style={styles.textoBoton}>{I18n.t("avisoPrivacidad.btnAceptar")}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    headerSite: {
        position: "relative",
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
        width: '100%',
        paddingTop: 15,
        backgroundColor: "#FFF"
    },
    text: {
        alignItems: 'center',
        position: "relative",
        color: "#000",
        fontSize: 20,
        fontFamily: "Roboto",
        fontWeight: 'bold',
        paddingRight: 10,
        flexDirection: "column",
        height: 36
    },
    avisoTitulo: {
        color: '#4D4D4D',
        textAlign: 'center',
        marginTop: 15,
        fontSize: 20
    },
    avisoTextoNegrita: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "justify",
        fontSize: 15
    },
    avisoTextoNormal: {
        color: "#616161",
        textAlign: "justify",
        marginTop: 15,
        fontSize: 15
    },
    terminos: {
        paddingRight: 10,
        paddingLeft: 10,
        fontSize: 12,
        fontFamily: "Roboto"
    },
    contenedorTerminos: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 15
    },
    contenedorBotones: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        paddingBottom: 50,
        alignItems: 'center'
    },
    botonAceptar: {
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4BAA2B',
        borderRadius: 5,
        marginTop: 10
    },
    textoBoton: {
        color: '#FFF',
        fontSize: 20
    },
    textoCheck: {
        color: '#616161',
        fontSize: 20
    },
    wraper: {
        paddingBottom: 20,
        paddingLeft: 25,
        paddingRight: 25,
        alignItems: "baseline"
    }
});
export default withNavigation(Privacity);