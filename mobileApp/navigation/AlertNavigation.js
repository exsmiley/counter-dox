import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigator } from 'react-navigation';

import Colors from '../constants/Colors';

import AlertScreen from '../screens/AlertScreen';

export default StackNavigator(
  {
    AlertScr: {
      screen: AlertScreen,
    },
    
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  },
);
