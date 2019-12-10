import React from "react";
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, BackHandler, AsyncStorage, Alert, Platform, Button } from "react-native";
import PopMenu from "../components/PopupMenu";
import Icon from "react-native-vector-icons/Ionicons";


const Header = props => (
    <View style={styles.headerIOS}>
        <Text style={styles.txtIOS}>Oculto</Text>
    </View>
);

const HiddenHeader = Platform.select({
    ios: <Header />
});



export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state= {

            texto:""

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
                    <View style={{ position: "relative" }}>
                        <PopMenu />
                    </View>
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
        top: -1,
        left: 5,
        fontFamily: "Roboto",
        fontSize: 16,
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
});