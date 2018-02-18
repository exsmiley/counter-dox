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

export default class AlertScreen extends React.Component {

  constructor() {
      super();
      this.state = {};
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Alerts"
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
    if (this.state.alerts) {
      _.forEach(this.state.alerts, (value, key) => {
          value["id"] = key;
          items.push(value);
      });
    }

    return (
      <View style={styles.container}>
        <FlatList style={styles.flatList}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => {

            var actions;
            if (item.triggered) {
              actions = (
                <Text>Already Triggered</Text>
              )
            }
            else {
              actions = (
                <Button 
                  title="Trigger" 
                  onPress={() => {
                      Fire.shared.doxx(item.id)
                  }}
                  />
              )
            }

            return (<View style={styles.item}>
              <Text style={styles.avatar}>5</Text>
              <Text style={styles.itemName}>{item.tweet}</Text>
              {actions}
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
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 12,
    color: "#000",
  },
  item: {
    flex: 1,
    flexDirection: "row",
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
