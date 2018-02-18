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
              <View style={styles.circle}>
                <Text style={styles.avatar}>5</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCity}>{item.city}</Text>
              </View>
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
