import React from 'react';
import {
    createStackNavigator,
    createAppContainer,
    createSwitchNavigator
} from 'react-navigation';
import NavigationService from "../components/NavigationService";
import Login from './Login';
import Lugares from './Lugares';
import Categorias from './Categorias';
import ScanQR from './ScanQR';
import Privacity from './Privacity';
import Privacity2 from './Privacity2';
import Swipper from './Swipper';
import AuthLoadingScreen from './AuthLoadingScreen';
import Menu from '../components/Menu';
import Productos from '../components/Products';
import ProductosSearch from '../components/ProductResults';
import DetailProduct from '../components/DetailProduct';
import ShoppingCart from '../pages/ShoppingCart';
import InicioApp from '../components/InicioAPP';
import UserInfo from './UserInfo';
import ErrorPage from '../pages/ErrorPage';
import OrdersHistory from '../pages/OrdersHistory';
import TipoPago from '../components/TipoPago';
import PagoExitoso  from '../components/PagoExitoso';
import PagoErroneo  from '../components/PagoErroneo';
import ScanQRiOS from "./ScanQRiOS";


const AppStack = createStackNavigator({
    Lugares: { screen: Lugares },
    Categorias: { screen: Categorias },
    Privacity2: { screen: Privacity2 },
    Privacity: { screen: Privacity },
    UserInfo: {screen: UserInfo},
    Menu: { screen: Menu },
    Productos: { screen: Productos },
    ProductosSearch: {screen: ProductosSearch},
    DetailProduct: { screen: DetailProduct },
    ErrorPage: { screen: ErrorPage },
    ShoppingCart: { screen: ShoppingCart },
    TipoPago: {screen: TipoPago},
    PagoExitoso: {screen: PagoExitoso},
    PagoErroneo: {screen: PagoErroneo},
    OrdersHistory: { screen: OrdersHistory },
    InicioApp: { screen: InicioApp }
    },

    {initialRouteName: 'Lugares'}
    );

const AuthStack = createStackNavigator({
    Swipper: { screen: Swipper },
    Login: { screen: Login },
    ScanQR: { screen: ScanQR },
    ScanQRiOS: {screen: ScanQRiOS}
});
const TopLevelNavigator = createStackNavigator({
    Login: { screen: Login }
});


const Navigator = createAppContainer(

    createSwitchNavigator(
        {
            AuthLoading: { screen: AuthLoadingScreen },
            AuthStack: { screen: AuthStack },
            AppStack: { screen: AppStack },
            TopLevelNavigator: {screen: TopLevelNavigator}
        },
        {
            initialRouteName: 'AuthLoading'
        }
    )
);

export default Navigator;
