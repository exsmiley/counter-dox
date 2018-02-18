import { Notifications } from 'expo';
import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import Fire from '../api/Fire'
import { Ionicons } from '@expo/vector-icons';

import HomeNavigation from './HomeNavigation';
import ModalScreen from '../screens/AddModal';
import AlertNavigation from './AlertNavigation';
import CounterNavigation from './CounterNavigation';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import ModalNavigation from './ModalNavigation';

export default TabNavigator(
  {
    Home: {
        screen: HomeNavigation,
    },
    Alerts: {
        screen: AlertNavigation,
    },
    Counters: {
      screen: CounterNavigation,
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-desktop`;
        } else if (routeName === 'Alerts') {
          iconName = `ios-alert`;
        } else if (routeName === 'Counters') {
          iconName = `ios-flash`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
