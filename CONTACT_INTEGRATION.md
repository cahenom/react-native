# Instalasi dan Konfigurasi React Native Contacts

Ikuti langkah-langkah berikut untuk mengintegrasikan fitur kontak ke aplikasi Anda:

## 1. Instalasi Package

Package `react-native-contacts` mungkin sudah tidak dipelihara lagi. Alternatif yang bisa digunakan:

### Opsi 1: react-native-contacts (lama)
```bash
npm install react-native-contacts
```

### Opsi 2: react-native-get-contact
```bash
npm install react-native-get-contact
```

### Opsi 3: Expo Contacts (jika menggunakan Expo)
```bash
npx expo install expo-contacts
```

Pastikan untuk memilih package yang paling sesuai dengan kebutuhan dan versi React Native Anda.

## 2. Konfigurasi Platform Spesifik

### Untuk react-native-contacts:

#### Android
1. Tambahkan izin ke `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.WRITE_CONTACTS" />
```

2. Lakukan link otomatis (jika menggunakan React Native 0.60+):
```bash
cd android && ./gradlew clean && cd ..
```

Catatan: Tidak perlu manual linking untuk React Native 0.60+ karena menggunakan autolinking.

#### iOS
1. Jalankan pod install:
```bash
cd ios && pod install && cd ..
```

2. Tambahkan izin ke `ios/[NamaProject]/Info.plist`:
```xml
<key>NSContactsUsageDescription</key>
<string>Aplikasi ini membutuhkan akses ke kontak untuk memudahkan pengisian nomor tujuan.</string>
```

### Untuk react-native-get-contact:

#### Android
Tambahkan izin ke `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
```

#### iOS
Tambahkan izin ke `ios/[NamaProject]/Info.plist`:
```xml
<key>NSContactsUsageDescription</key>
<string>Aplikasi ini membutuhkan akses ke kontak untuk memudahkan pengisian nomor tujuan.</string>
```

### Untuk Expo Contacts:
Tidak perlu konfigurasi tambahan selama Anda menggunakan Expo SDK.

## 3. Penggunaan di Kode

### Contoh Implementasi untuk react-native-contacts:

```javascript
const openContactPicker = async () => {
  try {
    const Contacts = require('react-native-contacts');

    const permission = await Contacts.requestPermission();
    if (permission === 'authorized') {
      Contacts.getAllWithoutPhotos((err, contacts) => {
        if (err) {
          console.error('Error getting contacts:', err);
          Alert.alert('Error', 'Gagal mengambil kontak: ' + err.message);
          return;
        }

        const contactsWithPhone = contacts.filter(contact =>
          contact.phoneNumbers && contact.phoneNumbers.length > 0
        );

        if (contactsWithPhone.length === 0) {
          Alert.alert('Info', 'Tidak ada kontak dengan nomor telepon ditemukan.');
          return;
        }

        // Tampilkan daftar kontak
        const contactNames = contactsWithPhone.map(contact =>
          `${contact.displayName || contact.givenName || 'Tanpa Nama'} - ${contact.phoneNumbers[0].number}`
        );

        Alert.alert(
          'Pilih Kontak',
          'Pilih kontak dari daftar:',
          contactNames.map((name, index) => ({
            text: name,
            onPress: () => {
              if (index < contactsWithPhone.length) {
                let phoneNumber = contactsWithPhone[index].phoneNumbers[0].number;
                phoneNumber = phoneNumber.replace(/\D/g, '');

                if (phoneNumber.startsWith('62')) {
                  phoneNumber = '0' + phoneNumber.substring(2);
                } else if (phoneNumber.startsWith('+62')) {
                  phoneNumber = '0' + phoneNumber.substring(3);
                } else if (phoneNumber.startsWith('0062')) {
                  phoneNumber = '0' + phoneNumber.substring(4);
                }

                setNomor(phoneNumber);
              }
            }
          })).concat([{ text: 'Batal', style: 'cancel' }])
        );
      });
    } else {
      Alert.alert('Izin Dibutuhkan', 'Aplikasi membutuhkan izin untuk mengakses kontak Anda.');
    }
  } catch (error) {
    console.error('Error accessing contacts:', error);
    Alert.alert('Error', 'Gagal mengakses kontak: ' + error.message);
  }
};
```

### Contoh Implementasi untuk react-native-get-contact:

```javascript
import Contacts from 'react-native-get-contact';

const openContactPicker = async () => {
  try {
    const permission = await Contacts.requestPermission();
    if (permission === 'authorized') {
      const contacts = await Contacts.getAll();
      const contactsWithPhone = contacts.filter(contact => contact.phoneNumbers.length > 0);

      if (contactsWithPhone.length === 0) {
        Alert.alert('Info', 'Tidak ada kontak dengan nomor telepon ditemukan.');
        return;
      }

      const contactNames = contactsWithPhone.map(contact =>
        `${contact.displayName || 'Tanpa Nama'} - ${contact.phoneNumbers[0]}`
      );

      Alert.alert(
        'Pilih Kontak',
        'Pilih kontak dari daftar:',
        contactNames.map((name, index) => ({
          text: name,
          onPress: () => {
            if (index < contactsWithPhone.length) {
              let phoneNumber = contactsWithPhone[index].phoneNumbers[0];
              phoneNumber = phoneNumber.replace(/\D/g, '');

              if (phoneNumber.startsWith('62')) {
                phoneNumber = '0' + phoneNumber.substring(2);
              } else if (phoneNumber.startsWith('+62')) {
                phoneNumber = '0' + phoneNumber.substring(3);
              } else if (phoneNumber.startsWith('0062')) {
                phoneNumber = '0' + phoneNumber.substring(4);
              }

              setNomor(phoneNumber);
            }
          }
        })).concat([{ text: 'Batal', style: 'cancel' }])
      );
    } else {
      Alert.alert('Izin Dibutuhkan', 'Aplikasi membutuhkan izin untuk mengakses kontak Anda.');
    }
  } catch (error) {
    console.error('Error accessing contacts:', error);
    Alert.alert('Error', 'Gagal mengakses kontak: ' + error.message);
  }
};
```

### Contoh Implementasi untuk Expo Contacts:

```javascript
import * as Contacts from 'expo-contacts';

const openContactPicker = async () => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const contactsWithPhone = data.filter(contact =>
        contact.phoneNumbers && contact.phoneNumbers.length > 0
      );

      if (contactsWithPhone.length === 0) {
        Alert.alert('Info', 'Tidak ada kontak dengan nomor telepon ditemukan.');
        return;
      }

      const contactNames = contactsWithPhone.map(contact =>
        `${contact.name || 'Tanpa Nama'} - ${contact.phoneNumbers[0].number}`
      );

      Alert.alert(
        'Pilih Kontak',
        'Pilih kontak dari daftar:',
        contactNames.map((name, index) => ({
          text: name,
          onPress: () => {
            if (index < contactsWithPhone.length) {
              let phoneNumber = contactsWithPhone[index].phoneNumbers[0].number;
              phoneNumber = phoneNumber.replace(/\D/g, '');

              if (phoneNumber.startsWith('62')) {
                phoneNumber = '0' + phoneNumber.substring(2);
              } else if (phoneNumber.startsWith('+62')) {
                phoneNumber = '0' + phoneNumber.substring(3);
              } else if (phoneNumber.startsWith('0062')) {
                phoneNumber = '0' + phoneNumber.substring(4);
              }

              setNomor(phoneNumber);
            }
          }
        })).concat([{ text: 'Batal', style: 'cancel' }])
      );
    } else {
      Alert.alert('Izin Dibutuhkan', 'Aplikasi membutuhkan izin untuk mengakses kontak Anda.');
    }
  } catch (error) {
    console.error('Error accessing contacts:', error);
    Alert.alert('Error', 'Gagal mengakses kontak: ' + error.message);
  }
};
```

## 4. Penanganan Izin Runtime

Izin kontak akan diminta secara otomatis saat pengguna pertama kali menggunakan fitur ini.

## 5. Troubleshooting

Jika mengalami masalah:
- Pastikan versi React Native Anda kompatibel
- Untuk Android, cek apakah targetSdkVersion >= 23
- Untuk iOS, pastikan provisioning profile sudah benar