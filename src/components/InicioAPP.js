import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, Image, AsyncStorage, Alert, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { withNavigation } from 'react-navigation';
import Menu from "./Menu";
import { info_api } from '../api/Variables';
import Navbar2 from "../components/Navbar2";



const Slider = props => (
    <View>
      <Image source={props.uri} />
    </View>
)

class InicioAPP extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      data: [],
      total_items: 0,
      userId:"",
      lugarId:"",
      username:""
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.retrieveItem();

  }
  componentWillMount() {
    this._isMounted = true;
    this._isMounted && this.makeRemoteRequest();
  }

  componentWillUnmount() {
    this._isMounted = false;

  }

  retrieveItem = async () => {

    try {
      const bookmarksString = await AsyncStorage.getItem('@MyStore:bookmarks');
      if (bookmarksString !== null) {
        const bookmarksArray = JSON.parse(bookmarksString);
        this.setState({
          total_items: bookmarksArray.length
        });

        }
    } catch (error) {
      console.log(error);
    }

  }

  makeRemoteRequest = () => {

    this.setState({loading: true});



    AsyncStorage.getItem("usrID")
        .then(usuarioId =>{
    fetch(info_api.url + "inicio_app?usuarioId="+usuarioId.toString(), {
      headers: {
        "Natura-Api-Key": info_api.api_key
      }
    })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            data: responseJson.inicio_apps
          });
        })
        .catch(error => {
          this.setState({error});
        })
        .done();
  });
  };

  renderItem = ({ item }) => {
    return (
        <Image
            style={styles.image_lugar}
            source={{ uri: item.url_image }}
        />
    );
  };

  render() {


    const { navigation } = this.props;
    const username = navigation.getParam("username","NO-NAME");
    const nombre = navigation.getParam("lugar","NO-NAME");
    const usuarioId = navigation.getParam("userId","NO-NAME");
    const lugarId = navigation.getParam("lugarId","NO-NAME");
    return (
        <View style={styles.container}>
          <View>
            <Navbar2 nombre={nombre} navigation={navigation}></Navbar2>
          </View>


          <Swiper style={styles.wrapper} KeyExtractor={item => item.imgid} horizontal={true} autoplay>
            {
              this.state.data.map((item, i) => <View key={i}>
                    <Image style={styles.stretch} source={{ uri: item.url_image }} />
                  </View>
              )
            }
          </Swiper>
          <View style={{ marginTop: 49 }}>
            <Menu  total_items={this.state.total_items} lugar={nombre} userId={usuarioId} lugarId={lugarId} username={username}/>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerSite: {
    width: '100%',
    paddingTop: 4,
    paddingLeft: 4,
    flexDirection: "row",
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: "#F98806"
  },
  roll: {
    width: 300,
    position: 'relative',
    flexDirection: "row",
    left: 3
  },
  search: {
    position: 'relative',
    top: -8,
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  text: {
    position: 'relative',
    width: 300,
    textDecorationColor: "#FFF",
    color: "#FFFFFF",
    fontSize: 15,
    top: -1,
    left: 5,
    fontFamily: "Roboto",
    height: 36,
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB"
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5"
  },
  image: {
    flex: 1
  },
  headerUbicacion: {
    backgroundColor: "#F98806",
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Roboto",
    height: 36,
    paddingVertical: 6
  },
  stretch: {
    width: '100%',
    height: '100%'
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
    height: 25,
    marginLeft: 8
  },
});

export default withNavigation(InicioAPP);