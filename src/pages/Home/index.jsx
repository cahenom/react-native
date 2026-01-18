import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {AddIkon, BellIkon, HeaderBG, SendIkon} from '../../assets';
import {
  BOLD_FONT,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  FONT_SEDANG,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  windowHeight,
  windowWidth,
} from '../../utils/const';
import {mainmenus} from '../../data/mainmenu';
import {useAuth} from '../../context/AuthContext';

export default function HomeScreen({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';
  const {isLoggedIn} = useAuth();

  console.log(isLoggedIn);
  return (
    <ImageBackground
      source={HeaderBG}
      style={{
        width: windowWidth,
        height: windowHeight * 0.2,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: FONT_NORMAL,
            fontWeight: '500',
            fontFamily: MEDIUM_FONT,
          }}>
          Hai, Gagas
        </Text>
        <BellIkon />
      </View>
      <View
        style={{
          backgroundColor: isDarkMode ? DARK_BACKGROUND : '#FFF',
          marginHorizontal: HORIZONTAL_MARGIN,
          padding: 15,
          borderRadius: 10,
          height: 70,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
          marginTop: windowHeight * 0.06,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
            fontFamily: MEDIUM_FONT,
            fontSize: FONT_NORMAL,
          }}>
          Rp. 15.000
        </Text>
        <View
          style={{
            flexDirection: 'row',
            columnGap: 15,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              rowGap: 5,
            }}>
            <SendIkon />
            <Text
              style={{
                fontFamily: REGULAR_FONT,
                fontSize: FONT_SEDANG,
                color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
              }}>
              Transfer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              rowGap: 5,
            }}>
            <AddIkon />
            <Text
              style={{
                fontFamily: REGULAR_FONT,
                fontSize: FONT_SEDANG,
                color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
              }}>
              Topup
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginHorizontal: HORIZONTAL_MARGIN,
        }}>
        <View
          style={{
            marginVertical: 35,
          }}>
          <Text
            style={{
              fontFamily: BOLD_FONT,
              fontSize: FONT_NORMAL,
            }}>
            Topup & Tagihan
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 25,
          }}>
          {mainmenus.map(item => {
            return (
              <TouchableOpacity
                key={item.label}
                style={{
                  width: 100,
                  backgroundColor: isDarkMode ? DARK_BACKGROUND : '#FFF',
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: isDarkMode ? 1 : 0,
                  borderColor: isDarkMode ? SLATE_COLOR : '',
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate(item.path)}>
                <Image source={item.ikon} />
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: MEDIUM_FONT,
                    fontSize: FONT_SEDANG,
                    marginTop: 10,
                  }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
