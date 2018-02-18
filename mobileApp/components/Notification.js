import React from 'react';
import Fire from '../api/Fire'
import * as firebase from 'firebase'
import StatusBarAlert from 'react-native-statusbar-alert';

const _ = require("lodash");

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
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class Notification extends React.Component {

  constructor() {
      super();
      this.state = {};
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        return;
      }
      let node = Fire.shared.userNode();
      node.on("value", (snapshot) => {
        this.setState(snapshot.val());
      });
    });
  }

  render() {
    console.warn("notification")
    return (
      <View style={styles.container}>
        <StatusBarAlert
        visible={true}
        message="Dox detected! Would you like to counter dox?"
        style={styles.alert}
        onPress={() => this.navigator.push({id: 'SilentAlert'})}
        />
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    return (
      <View style={styles.container}>
        <FlatList>
          data={items}
          renderItem={({item}) => <Text>{item.name}</Text>}
        </FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      alignSelf: 'flex-end',
      marginTop: 50,
      height: 30,
    },
    alert: {
        backgroundColor: "#3CC29E",
        color: "white"
    },
    content: {
      flex: 1,
      alignItems: 'center',
    },
    text: {
      textAlign: 'center'
    }
});
