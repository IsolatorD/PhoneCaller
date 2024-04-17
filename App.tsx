import React, {useEffect, useState} from 'react';
import {
  AppState,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
} from 'react-native';
import CallKeep from 'react-native-callkeep';

export default function App() {
  const [isInCall, setIsInCall] = useState(false);
  useEffect(() => {
    // Configuración de CallKeep
    CallKeep.setup({
      ios: {
        appName: 'MiApp',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription:
          'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
        selfManaged: true,
        imageName: 'phone_account_icon',
        additionalPermissions: [],
        // Required to get audio in background when using Android 11
        foregroundService: {
          channelId: 'com.phonecaller',
          channelName: 'PhoneCaller Foreground Service',
          notificationTitle: 'My app is running on background',
          notificationIcon: 'Path to the resource icon of the notification',
        },
      },
    });

    // Manejo del cambio de estado de la aplicación
    AppState.addEventListener('change', handleAppStateChange);

    CallKeep.addEventListener('didReceiveStartCallAction', handler => {
      console.log('START CALL', handler);
      setIsInCall(true);
    });
    CallKeep.addEventListener('endCall', handler => {
      console.log('END CALL', handler);
      setIsInCall(false);
    });

    return () => {
      CallKeep.removeEventListener('didReceiveStartCallAction')
      CallKeep.removeEventListener('endCall')
    }
  }, []);

  const handleAppStateChange = (nextAppState: any) => {
    if (nextAppState === 'active') {
      // Configuración adecuada al volver a la aplicación
      CallKeep.setup({
        ios: {
          appName: 'MiApp',
        },
        android: {
          alertTitle: 'Permissions required',
          alertDescription:
            'This application needs to access your phone accounts',
          cancelButton: 'Cancel',
          okButton: 'ok',
          imageName: 'phone_account_icon',
          selfManaged: true,
          additionalPermissions: [],
          // Required to get audio in background when using Android 11
          foregroundService: {
            channelId: 'com.phonecaller',
            channelName: 'PhoneCaller Foreground Service',
            notificationTitle: 'My app is running on background',
            notificationIcon: 'Path to the resource icon of the notification',
          },
        },
      });
    }
  };

  const startCall = () => {
    const callUUID = '12345'; // UUID único para identificar la llamada
    const number = '+584127550254'; // Número de teléfono al que se realizará la llamada

    CallKeep.startCall(callUUID, number, 'Daniel', 'number', false);
  };

  return (
    <View>
      <TouchableOpacity onPress={startCall}>
        <View>
          <Text>Make phonecall</Text>
        </View>
      </TouchableOpacity>
      {isInCall && <Text>En una llamada</Text>}
    </View>
  );
}
