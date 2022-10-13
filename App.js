/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  Button,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { BleManager } from 'react-native-ble-plx';

function scanDevices(manager, updateDevices) {
  let devices = []
  manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
    const shouldListDevice = device?.name
      && !devices.find(({ name }) => name === device.name)
    if (shouldListDevice) {
      devices.push(device)
      console.log('name', device.name)
    }

    if (error) {
      console.error(JSON.stringify(error))
      // Handle error (scanning will be stopped automatically)
      return
    }
  });

  setTimeout(() => {
    // TODO: Needs a loading component or some kind of indicator
    updateDevices(devices);
    manager.stopDeviceScan();
  }, 3000);
}

async function connectToDevice(device) {
  try {
    // So far this hasn't given me any useful information, I'm either using it wrong or there's some other bug in my code
    const deviceConnected = await device.connect()
    const deviceData = await deviceConnected.discoverAllServicesAndCharacteristics()
    return deviceData
  } catch (error) {
    console.error(error)
  }
}

const requestPermissions = async () => {
  console.log('Requesting Permissions');

  try {
    const scanGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Permission Scan Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    console.log('Bluetooth scan permission:', scanGranted);

    const connectGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Permission Connect Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    console.log('Bluetooth connect permission:', connectGranted);

    const locationGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Localisation Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    console.log('Bluetooth location permission:', locationGranted);
  } catch (err) {
    console.warn(err);
  }
}

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  let manager;
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [devices, updateDevices] = React.useState([])

  React.useEffect(() => {
    manager = new BleManager();
    return () => {
      manager.destroy();
      manager = undefined;
    }
  }, [BleManager]);

  React.useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        requestPermissions()
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, [manager]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="My Bluetooth App">
            This is the app that connects to your device's bluetooth
          </Section>
          <Section title="Devices">
            <View>
              {devices.length ? <Text>Click to connect:</Text> : null}
              {devices.map(device => (
                <View style={{ marginTop: 5 }} key={device.name}>
                  <Button title={device.name} onPress={() => connectToDevice(device)} />
                </View>
              ))}
              </View>
          </Section>
          <View style={{ marginTop: 10 }}>
            <Button title="Scan for devices" onPress={() => scanDevices(manager, updateDevices)} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
