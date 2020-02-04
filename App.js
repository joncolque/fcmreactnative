/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
    View,
    Text,
    AsyncStorage,
    Alert,
    Platform
} from 'react-native';

import firebase from 'react-native-firebase';

export default class App extends React.Component {

    async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();


        // Firebase Cloud Messaginf - Foreground
        const channel = new firebase.notifications.Android.Channel(
      'channelId',
      'Channel Name',
      firebase.notifications.Android.Importance.High
    ).setDescription('A natural description of the channel');
    firebase.notifications().android.createChannel(channel);

    // the listener returns a function you can use to unsubscribe
    this.unsubscribeFromNotificationListener = firebase.notifications().onNotification((notification) => {
        console.log("********* ENTRA AL FOREGROUND  ***********")
      if (Platform.OS === 'android') {

        const localNotification = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
          })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .setSound('default')
          .android.setChannelId('channelId') // e.g. the id you chose above
          .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
          .android.setColor('#000000') // you can set a color here
          .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));

      } else if (Platform.OS === 'ios') {

        const localNotification = new firebase.notifications.Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .ios.setBadge(notification.ios.badge);

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));

      }
    });
    }

    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();

        this.unsubscribeFromNotificationListener();
    }

    //1
    async checkPermission() {
        console.log("****** checkPermission() ******")
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        console.log("****** getToken() *******")
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
        console.log("TOKEN-EMULATOR", fcmToken)
    }

    //2
    async requestPermission() {
        console.log("****** requestPermission() *******")
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Text>Welcome to React Native!</Text>
            </View>
        );
    }



    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
       console.log("****** createNotificationListeners() ******")
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            console.log("****** onNotification ******", notification)
            const { title, body } = notification;
            console.log("****** title, body , foreground *****",title, body)
            this.showAlert(title, body);
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            console.log("****** onNotificationOpened ******", notificationOpen)
            const { title, body } = notificationOpen.notification;
            console.log("****** title, body , background *****",title, body)
            this.showAlert(title, body);
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            console.log("getInitialNotification()", notificationOpen)
            const { title, body } = notificationOpen.notification;
            console.log("****** title, body , close *****",title, body)
            this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            console.log("****** message , foreground *****")
            console.log(JSON.stringify(message));
        });
    }

    showAlert(title, body) {
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

}
