import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, BackHandler, AsyncStorage, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AllIncluded from './AllIncluded';
import MoneyBox from '../components/MoneyBox';
import PagoTarjeta from '../components/PagoTarjeta';
import { withNavigation } from 'react-navigation';
import RadioForm from 'react-native-simple-radio-button';
import Navbar from "../components/Navbar";
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";

var radio_props_All = [
    { label: I18n.t("pago.txtTarjeta"), value: 0 },
    { label: I18n.t("pago.txtDeposito"), value: 1 },
    { label: I18n.t("pago.txtTodoIncluido"), value: 2 }
];

var radio_props_NoAll =
    [
        { label: I18n.t("pago.txtTarjeta"), value: 0 },
        { label: I18n.t("pago.txtDeposito"), value: 1 }
    ];

class TipoPago extends Component {
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
            valor: 0,
            tipo_plan: ""

        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillMount() {
        this._isMounted = true;

        }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.ObternerPlan();
        this._isMounted && BackHandler.addEventListener(
            "hardwareBackPress",
            this.handleBackButtonClick
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
        BackHandler.removeEventListener(
            "hardwareBackPress",
            this.handleBackButtonClick
        );
    };

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    };

    ObternerPlan = async () => {


        await AsyncStorage.getItem("typePlan")
            .then(tipo_plan => {
                this.setState({tipo_plan:tipo_plan});
            });

    }

    render() {
        const { navigation } = this.props;
        const nombre = navigation.getParam("lugar", "NO-NAME");
        return (
            <View style={styles.container}>
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
                            <Text style={styles.txtSubheader}>{I18n.t("pago.txtRealizarPago")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View style={styles.containerTP}>
                        <Text style={styles.tipoPago}>{I18n.t("pago.txtTipoPago")}</Text>
                    </View>
                    <View style={styles.containerRB}>
                        <RadioForm
                            formHorizontal={true}
                            buttonHorizontal={true}
                            labelHorizontal={true}
                            buttonSize={7}
                            buttonOuterSize={17}
                            buttonStyle={{ borderWidth: 0.5 }}
                            selectedButtonColor={'#4baa2b'}
                            selectedButtonOuterColor={'#000'}
                            buttonColor={'#000'}
                            labelStyle={{
                                fontSize: 18,
                                color: '#000',
                                fontFamily: 'Roboto',
                                paddingLeft: 5,
                                paddingRight: 15
                            }}
                            radio_props={(this.state.tipo_plan !== "TODO INCLUIDO") ? radio_props_NoAll : radio_props_All}
                            initial={this.state.valor}
                            onPress={(value) => {
                                this.setState({ value: value })
                            }}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, width: '100%', flexDirection: 'column' }}>
                    {
                        (this.state.value === 1) ? (<MoneyBox />) : (this.state.value === 2) ? (<AllIncluded />) : (<PagoTarjeta />)
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    containerRB: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 15,
        height: 50
    },
    containerTP: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    tipoPago: {
        position: 'relative',
        color: "#4e4e4d",
        fontFamily: "Roboto",
        fontSize: 18,
        left: 5
    },
    text: {
        position: 'relative',
        color: "#FFFFFF",
        fontSize: 15,
        top: 4,
        left: 5,
        fontFamily: "Roboto",
        alignItems: "flex-end",
        justifyContent: "flex-end"
    },
    Buttons: {
        backgroundColor: '#4baa2b',
        paddingLeft: 1,
        paddingRight: 1
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
});


export default withNavigation(TipoPago);
