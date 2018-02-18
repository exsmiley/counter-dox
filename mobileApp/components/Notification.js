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
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 15 }}>{this.props.title}</Text>
        <Text style={{ fontSize: 12 }}>{this.props.subtitle}</Text>
        <View style={styles.buttonContainer}>
            <Button
                style={styles.button}
                title={"Yes"}
                onPress={this.props.pressedYes}
            />
            <View style={styles.spacer} />
            <Button
                style={styles.button}
                onPress={this.props.pressedNo}
                title={"No"}
            />
        </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 84,
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingTop: 25,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 50,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(125, 125, 125, 0.5)",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    display: "flex",
    marginBottom: 10,
  },
  spacer: {
    flex: 1,
  },
  button: {
    backgroundColor: "#000",
    flex: 1,
    padding: 10,
    borderRadius: 2,
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
