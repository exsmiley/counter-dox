import React from 'react';
import Fire from '../api/Fire'
import * as firebase from 'firebase'
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

export default class CounterScreen extends React.Component {

  constructor() {
      super();
      this.state = {};
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Counters"
    }
  };

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
    var items = [];
    if (this.state.sent_doxxes) {
      _.forEach(this.state.sent_doxxes, (value, key) => {
          items.push({
              id: key,
              tweet: value
          });
      });
    }

    return (
      <View style={styles.container}>
        <FlatList style={styles.flatList}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => {
            return (<View style={styles.item}>
              <Text style={styles.itemName}>{item.tweet}</Text>
            </View>);
          }
        }
        >
        </FlatList>
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
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  flatList: {
    flex: 1,
  },
  item: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  itemName: {
      fontSize: 15,
      color: "#000",
  },
  itemCity: {
    fontSize: 12,
    color: "#555",
  },
});
