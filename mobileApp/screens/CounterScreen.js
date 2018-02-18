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
    backgroundColor: "#14161B"
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
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: "#FFFFFF",
    borderStyle: "solid",
    borderBottomWidth: 2,

  },
  avatar: {
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    color: "#6FED8B",
    fontFamily: "AvenirNext-Bold"
  },
  circle: {
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#96F3F3",
    height: 40,
    width: 40,
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 10,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  itemName: {
      fontSize: 15,
      color: "#FFFFFF",
      fontFamily: "AvenirNext-Bold"
  },
  itemCity: {
    fontSize: 12,
    color: "#F3F3F3",
    fontFamily: "AvenirNext-DemiBold"
  },
});
