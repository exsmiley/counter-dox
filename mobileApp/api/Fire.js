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

  saveScore = score => {
    this.saveUserInfo({
      timestamp: new Date().getTime(),
      score,
    });
  };

  getPagedScore = async ({ size, start }) => {
    const slug = getSlug();

    let ref = this.db
      .collection('users')
      .where('slug', '==', slug)
      .orderBy('score', 'desc')
      .limit(size);
    try {
      if (start) {
        ref = ref.startAfter(start);
      }

      const querySnapshot = await ref.get();
      const data = [];
      querySnapshot.forEach(function(doc) {
        const _data = doc.data();
        data.push({ key: doc.id, ..._data, title: _data.deviceName });
      });
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { data, cursor: lastVisible };
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

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