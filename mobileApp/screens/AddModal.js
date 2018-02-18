import React from 'react';
import Fire from '../api/Fire'
import * as firebase from 'firebase'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';

const _ = require("lodash");
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class ModalScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            nameInp: "",
            cityInp: "",
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
          title: "Add Dox Listener",
        }
      };

    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 15, textAlign: 'center' }}>Enter the name and city of person you would like to defend</Text>

          <FormLabel>Name</FormLabel>
          <FormInput
            ref={input => this.nameInput = input}
            onChangeText={(text) => {
                this.setState({
                    nameInp: text
                });
            }}/>
          <FormLabel>City</FormLabel>
          <FormInput
            ref={input => this.cityInput = input}
            onChangeText={(text) => {
                this.setState({
                    cityInp: text
                });
            }}/>
          <Button
            onPress={() => {
                if (!this.state.nameInp || !this.state.cityInp) {
                    Alert.alert(
                        'Information Missing',
                        'Please Enter both City and State',
                        [
                          {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: false }
                      )
                      return;
                }
                Fire.shared.addProtection(this.state.nameInp, this.state.cityInp)
                this.props.navigation.goBack()
            }}
            title="Submit"
          />
        </View>
      );
    }

    static navigationOptions = ({ navigation }) => {
        return {
          title: "Input",
          headerLeft: (
            <Button
              onPress={() => navigation.goBack()}
              title="Quit"
              color="#000"
            />
          )
        }
      };
}
