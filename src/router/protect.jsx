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
  LihatSemuaScreen,
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
  Indosat,
  DepositPage,
  DataPackage,
  DataType,
  TopupData,
  TypeEmoney,
  DepositSuccess,
  DepositFailed,
} from '../pages';
import Transaksi from '../pages/Transaksi';
import {
  PaymentPage,
  PaymentSuccessPage,
} from '../pages';


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
          title: 'Topup Pulsa',
        }}
      />
      <Stack.Screen
        name="DataPackage"
        component={DataPackage}
        options={{
          title: 'Paket Data',
        }}
      />
      <Stack.Screen
        name="DataType"
        component={DataType}
        options={{
          title: 'Jenis Paket Data',
        }}
      />
      <Stack.Screen
        name="TopupData"
        component={TopupData}
        options={{
          title: 'Topup Paket Data',
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
        name="TypeEmoney"
        component={TypeEmoney}
        options={{
          title: 'Jenis Dompet Elektronik',
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
      <Stack.Screen
        name="LihatSemua"
        component={LihatSemuaScreen}
        options={{
          title: 'Semua Layanan',
        }}
      />
      <Stack.Screen
        name="Indosat"
        component={Indosat}
        options={{
          title: 'Indosat',
        }}
      />
      <Stack.Screen
        name="PaymentPage"
        component={PaymentPage}
        options={{
          title: 'Detail Pembayaran',
        }}
      />
      <Stack.Screen
        name="PaymentSuccessPage"
        component={PaymentSuccessPage}
        options={{
          title: 'Pembayaran Berhasil',
        }}
      />
      <Stack.Screen
        name="DepositPage"
        component={DepositPage}
        options={{
          title: 'Deposit Saldo',
        }}
      />
      <Stack.Screen
        name="DepositSuccess"
        component={DepositSuccess}
        options={{
          title: 'Deposit Berhasil',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DepositFailed"
        component={DepositFailed}
        options={{
          title: 'Deposit Gagal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default ProtectedRoute;
