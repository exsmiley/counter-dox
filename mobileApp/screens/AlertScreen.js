import React from 'react';
import Fire from '../api/Fire'
import * as firebase from 'firebase'
import { Ionicons } from '@expo/vector-icons';
const _ = require("lodash");
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
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
                <Icon
                  style={{
                    marginLeft: 10,
                  }}
                  name='bolt' size={25} color={"white"}
                  onPress={() => {
                      Fire.shared.doxx(item.id)
                  }}
                  />
              )
            }

            return (<View style={styles.item}>
              <View style={styles.circle}>
                <Text style={styles.avatar}>5</Text>
              </View>
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
