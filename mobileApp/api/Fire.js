const axios = require('axios');
const firebase = require('firebase');
// Required for side-effects

// import getUserInfo from './utils/getUserInfo';
// import getSlug from './utils/getSlug';
var config = {
  apiKey: "AIzaSyCU9BRSRVuYSRFXYsXqV43fQPdyRZsCvQ0",
  authDomain: "counterdox-2f53d.firebaseapp.com",
  databaseURL: "https://counterdox-2f53d.firebaseio.com",
  projectId: "counterdox-2f53d",
  storageBucket: "counterdox-2f53d.appspot.com",
  messagingSenderId: "721634891184"
};

class Fire {
  constructor() {
    this.init();
    this.observeAuth();
  }

  init = () => firebase.initializeApp(config);

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    } else {
      this.saveUser();
    }
  };

  saveUser = () => {
    // const user = getUserInfo();
    // this.saveUserInfo(user);
  };

  userNode = () => {
    if (!this.uid) {
      return null;
    }
    return this.db.child('users').child(this.uid);
  };

  addProtection = (name, city) => {
    return this.db.child('users').child(this.uid).child("protections").push({
        name,
        city
    })
  };

  saveUserInfo = info => {
    const { uid } = this;
    if (!uid) {
      return;
    }
    console.log('saveUserInfo', uid, info);
    const ref = this.db.child('users').child(uid);
    const setWithMerge = ref.set({ uid, ...info }, { merge: true });
  };

  doxx = (alertID) => {
    const { uid } = this;
    axios.get(
      `https://counterdox.lib.id/doxxer@0.0.3/?user=${uid}&alert=${alertID}`
    ).then(function (response) {

    }).catch(function (err) {

    });
  }

  get db() {
    return firebase.database().ref();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
}

Fire.shared = new Fire();
export default Fire;