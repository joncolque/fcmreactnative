/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

//Firebase Cloud Messaging - react-native-firebase
import bgMessaging from './bgMessaging';

AppRegistry.registerComponent(appName, () => App);
// New task registration

//Firebase Cloud Messaging - react-native-firebase
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); // <-- Add this line
