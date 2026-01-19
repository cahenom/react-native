import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MyTabBar from '../components/BottomTab';
import {
  BpjsKesehatan,
  DompetElektronik,
  Games,
  HomeScreen,
  Internet,
  LayananPLN,
  MasaAktif,
  PDAM,
  PLNPascabayar,
  PLNPrabayar,
  ProfilScreen,
  Pulsa,
  SettingsScreen,
  SuccessNotif,
  TopupDompet,
  TopupGames,
  TopupMasaAktif,
  TopupTV,
  TopupVoucher,
  TV,
  Voucher,
} from '../pages';
import Transaksi from '../pages/Transaksi';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Transaksi"
        component={Transaksi}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfilScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function ProtectedRoute() {
  return (
    <Stack.Navigator initialRouteName="MyTabs">
      <Stack.Screen
        name="MyTabs"
        component={MyTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Pulsa"
        component={Pulsa}
        options={{
          title: 'Topup Pulsa & Data',
        }}
      />
      <Stack.Screen
        name="LayananPLN"
        component={LayananPLN}
        options={{
          title: 'Pilih Layanan PLN',
        }}
      />
      <Stack.Screen
        name="PLNPrabayar"
        component={PLNPrabayar}
        options={{
          title: 'PLN Prabayar',
        }}
      />
      <Stack.Screen
        name="PLNPascabayar"
        component={PLNPascabayar}
        options={{
          title: 'PLN Pascabayar',
        }}
      />
      <Stack.Screen
        name="SuccessNotif"
        component={SuccessNotif}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="DompetElektronik"
        component={DompetElektronik}
        options={{
          title: 'Dompet Elektronik',
        }}
      />
      <Stack.Screen
        name="TopupDompet"
        component={TopupDompet}
        options={{
          title: 'Topup Dompet Elektronik',
        }}
      />
      <Stack.Screen
        name="Games"
        component={Games}
        options={{
          title: 'Topup Games',
        }}
      />
      <Stack.Screen
        name="TopupGames"
        component={TopupGames}
        options={{
          title: 'Topup Games',
        }}
      />
      <Stack.Screen
        name="MasaAktif"
        component={MasaAktif}
        options={{
          title: 'Masa Aktif',
        }}
      />
      <Stack.Screen
        name="TopupMasaAktif"
        component={TopupMasaAktif}
        options={{
          title: 'Topup Masa Aktif',
        }}
      />
      <Stack.Screen
        name="TV"
        component={TV}
        options={{
          title: 'TV Berlangganan',
        }}
      />
      <Stack.Screen
        name="TopupTV"
        component={TopupTV}
        options={{
          title: 'Topup TV',
        }}
      />
      <Stack.Screen
        name="Voucher"
        component={Voucher}
        options={{
          title: 'Voucher',
        }}
      />
      <Stack.Screen
        name="TopupVoucher"
        component={TopupVoucher}
        options={{
          title: 'Topup Voucher',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Pengaturan Profil',
        }}
      />
      <Stack.Screen
        name="BpjsKesehatan"
        component={BpjsKesehatan}
        options={{
          title: 'Bpjs Kesehatan',
        }}
      />
      <Stack.Screen
        name="PDAM"
        component={PDAM}
        options={{
          title: 'PDAM',
        }}
      />
      <Stack.Screen
        name="Internet"
        component={Internet}
        options={{
          title: 'Internet Pasca',
        }}
      />
    </Stack.Navigator>
  );
}

export default ProtectedRoute;
