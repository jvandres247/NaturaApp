import React from "react";
import { StyleSheet, Text, View, BackHandler, AsyncStorage, Platform, TouchableOpacity } from "react-native";


class Numeric extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            valor: 1,
            results: []
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.retrieveItem();
        this._isMounted && this.setState({ valor: this.props.cantidad });
    }

    componentDidUpdate() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    retrieveItem = async () => {
        try {
          const bookmarksString = await AsyncStorage.getItem('@MyStore:bookmarks');
          if (bookmarksString !== null) {
            const bookmarksArray = JSON.parse(bookmarksString);
            this.setState({ results: bookmarksArray });
          }
        } catch (error) {
            console.log(error);
        }
    }

    decrement = async (id) => {
        if (this.state.valor > 1) {
            this.setState({ valor: this.state.valor - 1 });
            orders = this.state.results;
            for (let index = 0; index < orders.length; index++) {
                if (orders[index].id == id) {
                    orders[index].cantidad = orders[index].cantidad - 1; 
                }
            }
            this.setState({ results: orders });
            const bookmarksString = JSON.stringify(orders);
            await AsyncStorage.setItem('@MyStore:bookmarks',bookmarksString);
        }
    }

    increment = async (id) => {
        this.setState({ valor: this.state.valor + 1 });
        for (let index = 0; index < this.state.results.length; index++) {
            if (this.state.results[index].id == id) {
                this.state.results[index].cantidad = this.state.results[index].cantidad + 1; 
            }
        }
        this.setState({ results: this.state.results });
        const bookmarksString = JSON.stringify(this.state.results);
        await AsyncStorage.setItem('@MyStore:bookmarks',bookmarksString);
    }

    render() {
        return(
            <View style={styles.numeric}>
                {/* <TouchableOpacity onPress={ () => this.decrement(this.props.id) }>
                    <View> 
                        <Text style={styles.less}> - </Text>
                    </View>
                </TouchableOpacity> */}
                <View>
                    <Text style={styles.text}> {this.state.valor} </Text>
                </View>
                {/* <TouchableOpacity onPress={ () => this.increment(this.props.id) }>
                    <View> 
                        <Text style={styles.more}> + </Text>
                    </View>
                </TouchableOpacity> */}
            </View>
        );
    }
}

export default Numeric;

const styles = StyleSheet.create({
    numeric: {
        flexDirection: "row",
        marginLeft: 5,
        marginTop: 5,
    },
    less: {
        color: "#4e4e4d",
        fontFamily: "LemonMilkbolditalic",
        fontSize: 18,
        borderColor: "#5e605d",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    more: {
        color: "#4e4e4d",
        fontFamily: "LemonMilkbolditalic",
        fontSize: 18,
        borderColor: "#5e605d",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    text: {
        color: "#4e4e4d",
        fontFamily: "LemonMilkbolditalic",
        fontSize: 18,
        borderColor: "#5e605d",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    }
});