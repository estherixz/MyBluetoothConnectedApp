#MyBluetoothConnectedApp

## Goal
I created this very small app so I can start experimenting with bluetooth connectivity using react-native.
I wanted to see what kind of information I could retrieve from devices connected to the phone.
* My aspirational goal was to be able to connect and control a mini printer via this app,
which I knew there was a big risk it wouldn't be possible at all.

## Run the app
`npm run android`, `npm start`
You need to accept permissionso popups. After that you can click *scan for devices* and you'll get a list of all the available BLE device names you can potentially connect to.
* This app has only been tested with an android physical device.

## Bluetooth library
There are two main libraries that handle bluetooth connectivity.
On this app  I have used [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx),
but depending on the use case it might be best to use [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager) instead
as it does have a few extra features for Android, like bonding peripherals.

## Bluetooth limitations
Where do I start...

### Bluetooth versions
There are different bluetooth versions used by different devices and depending on the manufacturer and capabilities of each device, retrieved information can vary greatly.
A big difference you might encounter between devices is whether they use *Bluetooth Classic* or *Bluetooth Low Energy* (often referred to as BLE).
As it's probably obvious by their names and quite clearly documented, the libraries I'm citing above can only handle BLE.
Luckily I had two devices on BLE so I was able to continue experimenting.

### IOS / Android
As each operating system has their own way of interpreting/handling/connecting to bluetooth it's probably best (and advised by the library docs) to use the ios/android subfolders for most of the bluetooth specific development. As I didn't have time and resources to look into ios I kept everything in the main App.js with the knowledge that the app will probably crash on an ios device.

### Permissions
This is probably less specific to bluetooth and more related to general phone permissions.
I had trouble figuring out the correct bluetooth permissions in order for my app to start working at all the 
As is stated on the [android docs](https://developer.android.com/guide/topics/connectivity/bluetooth/permissions),
the set of permissions that you declare in your app depends on your app's target SDK version.
The operating system on the device I'm using to test my app is Android 13, so I had to setup the correct permissions in my `AndroidManifest.xml`
but also very importantly ask for specific user permissions after the app starts,
following the camera permissions example in the [react-native docs - permissionsandroid](https://reactnative.dev/docs/permissionsandroid).
I'm new to this so there might be a more efficient way to handle permissions,
or I may have possibly not needed all the permissions I set,
but this was what worked for me after quite a bit of fiddling with different options.

## Result
The only useful(?) information I managed to retrieve at this point was the name of the device.

### Other Notes
There is a warning about the calling of `new NativeEventEmitter()`, which is probably due to the way I'm initiating `new BleManager();`. I looked at doing it from within the App component but it didn't really make a difference to this warning so I kept it simple.
