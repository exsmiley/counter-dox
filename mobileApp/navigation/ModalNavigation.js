import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigator } from 'react-navigation';

import Colors from '../constants/Colors';

import AddModal from '../screens/AddModal';

export default StackNavigator(
  {
    Home: {
      screen: AddModal,
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
