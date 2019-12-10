import React, {Component} from 'react';
import Navigator from './src/pages/AppNavigator';
import Splash from './src/pages/Splash';
import NavigationService from "./src/components/NavigationService";


export default class App extends Component<{}> {
  constructor(props){
    super(props);
    this.state = {
      currentScreen: 'Splash'};
          setTimeout( ()=>{this.setState({currentScreen: 'Swipper'})},2000)
    }

render(){
    const {currentScreen} = this.state
    let mainScreen = currentScreen === 'Splash' ? <Splash/> : <Navigator

    ref = {
        navigatorRef =>{
            NavigationService.setTopLevelNavigator(navigatorRef);
        }
    }

    />
    return(
        mainScreen
    );
}
}

