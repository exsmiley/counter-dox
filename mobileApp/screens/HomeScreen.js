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

export default class HomeScreen extends React.Component {

  constructor() {
      super();
      this.state = {};
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Monitoring",
      headerRight: (
        <Button
          onPress={() => navigation.navigate('MyModal')}
          title="Add"
          color="#000"
        />
      )
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
    if (this.state.protections) {
      _.forEach(this.state.protections, (value, key) => {
          value["id"] = key;
          items.push(value);
      });
    }
    return (
      <View style={styles.container}>
        <FlatList style={styles.flatList}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCity}>{item.city}</Text>
            </View>
          )}
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
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: "#FFFFFF",
    borderStyle: "solid",
    borderBottomWidth: 2,

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
