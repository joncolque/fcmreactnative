import firebase from 'react-native-firebase';
// Optional flow type

export default async (remoteMessage) => {
    // handle your message
    console.log("*******remoteMessage******", remoteMessage)
    return Promise.resolve();
}