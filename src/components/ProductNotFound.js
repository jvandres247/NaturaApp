import React from "react";
import {View,StyleSheet, Text} from "react-native";
import {withNavigation} from "react-navigation";

class ProductNotFound extends React.Component {

    constructor(props){
        super(props);

    }
    render() {
        return (
            <View>
                <Text style={styles.texto}> {"\n\n\n\n\n"}Disculpe las molestias no se ha encontrado el producto</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imagen:{
        width: "100%",
        height: "100%",
        alignContent:"center",
        justifyContent: "center"
    },
    texto:{
        alignContent:"center",
        justifyContent:"center",
        textAlign: "center",
        color:"#000",
        fontSize: 18,
        fontFamily: "Roboto"
    }

});


export default withNavigation(ProductNotFound);