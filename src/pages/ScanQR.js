//This is an example code to Scan QR code//
import React from 'react';
import {
  View, ActivityIndicator, PermissionsAndroid,
  Alert, AsyncStorage, BackHandler, Text, StyleSheet, Platform, TouchableOpacity
} from 'react-native';

import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { withNavigation } from 'react-navigation'
import Icon from "react-native-vector-icons/Ionicons";
import { info_api } from '../api/Variables';
import * as RNLocalize from "react-native-localize";
import I18n from "../utils/i18n";



class ScanQR extends React.Component {

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
  state = { isPermitted: false }
  constructor(props) {
    super(props);

    this.state = {
      session: false
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);


    var that = this;
    async function requestCameraPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA, {
            'title': 'CameraExample App Camera Permission',
            'message': 'CameraExample App needs access to your camera '
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          requestExternalWritePermission();
        } else {
          alert("CAMERA permission denied");
        }
      } catch (err) {
        alert("Camera permission err",err);
        console.log(err)
      }
    }
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            'title': 'CameraExample App External Storage Write Permission',
            'message': 'CameraExample App needs access to Storage data in your SD Card '
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          requestExternalReadPermission();
        } else {
          alert("WRITE_EXTERNAL_STORAGE permission denied");
        }
      } catch (err) {
        alert("Write permission err",err);
        console.log(err)
      }
    }
    async function requestExternalReadPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
            'title': 'CameraExample App Read Storage Write Permission',
            'message': 'CameraExample App needs access to your SD Card '
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          that.setState({ isPermitted: true })
        } else {
          alert("READ_EXTERNAL_STORAGE permission denied");
        }
      } catch (err) {
        alert("Read permission err",err);
        console.log(err)
      }
    }
    requestCameraPermission();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {


    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {


    this.props.navigation.goBack();
    return true;


  }


  onBarcodeScan(qrvalue) {
    //called after te successful scanning of QRCode/Barcode
    this.setState({ qrvalue: qrvalue });
  }
  onContinueScan() {
    //To continue Scanning
    this.setState({ qrvalue: '' });
  }

  Login = async () => {

    const { navigation } = this.props;
    var code = "";
    var active = "";
    var usuario_id = 0;


    var privacy = await AsyncStorage.getItem("privacity");

    await fetch(info_api.url + "usuarios/find_by_user?username=" + this.state.qrvalue.toString(), {
      headers: {
        'Natura-Api-Key': info_api.api_key
      }
    })
        .then( res => res.json())
        .then( response => {
          code = JSON.stringify(response.code);
          switch (code) {
            case "200":
              active = JSON.stringify(response.usuario.activo);

              if (active === "true") {
                switch (privacy){

                  case "true":
                    AsyncStorage.setItem("usrID", response.usuario.id.toString());
                    AsyncStorage.setItem("typePlan", response.usuario.tipo_plan.toString());
                    AsyncStorage.setItem("User", this.state.qrvalue.toString());
                    AsyncStorage.setItem("session", "true");
                    AsyncStorage.setItem("hotelId", response.usuario.hotel_id.toString());
                    AsyncStorage.setItem("RoomUsr", response.usuario.numero_habitacion.toString());
                    this.props.navigation.navigate("Lugares");
                    break;
                  default:
                    AsyncStorage.setItem("usrID", response.usuario.id.toString());
                    AsyncStorage.setItem("typePlan", response.usuario.tipo_plan.toString());
                    AsyncStorage.setItem("User", this.state.qrvalue.toString());
                    AsyncStorage.setItem("session", "true");
                    AsyncStorage.setItem("hotelId", response.usuario.hotel_id.toString());
                    AsyncStorage.setItem("RoomUsr", response.usuario.numero_habitacion.toString());
                    this.props.navigation.navigate("Privacity");
                    break;
                }

              } else {
                Alert.alert("Usuario inválido, verifique el código QR");
                this.props.navigation.goBack();
              }
              break;
            default:
              Alert.alert("Usuario inválido, verifique el código QR");
              this.props.navigation.goBack();
          }

        })
        .catch(error => alert(error))

        .done();
  }




  render() {



    if (this.state.isPermitted) {
      //If qrvalue is set then return this view
      if (this.state.qrvalue) {
        // Alert.alert(this.state.qrvalue.toString());
        this.Login();
        //  Alert.alert(isUserAuthorizedCamera.toString());

      }
      //Initial/After Reset return this view
      return (

        <View style={{ flex: 1 }}>
          <View style={styles.headerSite}>
            <View>
              <TouchableOpacity style={styles.btnRegreso} onPress={() => this.handleBackButtonClick()}>
                <Icon name={Platform.OS === "ios" ? "ios-arrow-back" : "ios-arrow-back"} color="#FFF" size={20} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => this.handleBackButtonClick()}>
                <Text style={styles.txtTextoQR}>{I18n.t("lectorQR.escanearQR")}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerWhite}>
            <Text style={{ fontFamily: "Roboto" }}>{I18n.t("lectorQR.solicitudQR")}</Text>
            <Text style={styles.textGray}>{I18n.t("lectorQR.instruccionQR")}</Text>
          </View>
          <CameraKitCameraScreen

            ref={cam => this.camera = cam}
            /*permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}*/

            showFrame={false}
            //Show/hide scan frame
            scanBarcode={true}
            //Can restrict for the QR Code only
            laserColor={'blue'}
            //Color can be of your choice
            frameColor={'yellow'}
            //If frame is visible then frame color
            colorForScannerFrame={'black'}
            //Scanner Frame color
            onReadCode={event =>
              this.onBarcodeScan(event.nativeEvent.codeStringValue)
            }
          />
        </View>
      );
    }
    else {
      return (
        <ActivityIndicator />
      )
    }
  }
}

export default withNavigation(ScanQR);

const styles = StyleSheet.create(
  {
    headerSite: {
      backgroundColor: "#F98806",
      color: "#FFFFFF",
      fontSize: 18,
      fontFamily: "Roboto",
      height: 36,
      flexDirection: "row"
    },

    text: {

      position: 'relative',
      left: 50,
      color: "#FFFFFF",
      fontSize: 18,
      fontFamily: "Roboto",
      paddingRight: 5,
      alignContent: "center",
      justifyContent: "center",
      width: 300,
      height: 36

    },
    headerWhite: {
      width: '100%',
      paddingTop: 6,
      paddingLeft: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#FFF",
      height: 55
    },
    textGray: {
      fontSize: 12,
      fontFamily: "Roboto",
      paddingLeft: 10,
      paddingRight: 10
    },

    btnRegreso: {
      color: "#FFFFFF",
      fontSize: 18,
      borderRadius: 360,
      justifyContent: "center",
      alignItems: "center",
      width: 36,
      height: 36,
      top: 0,
      marginLeft: -5
    },
    txtTextoQR: {
      color: "#FFFFFF",
      fontSize: 18,
      fontFamily: "Roboto",
      height: 36,
      justifyContent: "center",
      borderColor: "#F98806",
      borderWidth: 1,
      alignContent: "center",
      marginTop: 10
    },


  }
);