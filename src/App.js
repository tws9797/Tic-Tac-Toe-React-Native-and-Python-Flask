/*
 * Name: Tee Wen Seng, Liew Zher Yiu, Kho Yi Yung
 * Reg. No: 1505408, 1502697,
 */

import {
  createStackNavigator,
} from 'react-navigation';
import HomeScreen from './HomeScreen';
import MenuScreen from './MenuScreen';
import SinglePlayerScreen from './SinglePlayerScreen';
import MultiPlayerScreen from './MultiPlayerScreen';
import OnlineScreen from './OnlineScreen';
import OnlineBoard from './OnlineBoard';


//Navigation
export default createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Menu: {
    screen: MenuScreen
  },
  Single: {
    screen: SinglePlayerScreen
  },
  Multi: {
    screen: MultiPlayerScreen
  },
  Online: {
    screen: OnlineScreen
  },
  OnlineBoard: {
    screen: OnlineBoard
  }
}, {
  initialRouteName: 'Home',
  navigationOptions: {
    headerStyle: {
      height: 60,
      backgroundColor: '#FF3B2F',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
