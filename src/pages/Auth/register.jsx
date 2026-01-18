import { StyleSheet, Text, View, TextInput, TouchableOpacity, useColorScheme} from 'react-native'
import React, {useState} from 'react'
import { BLUE_COLOR, BOLD_FONT, DARK_BACKGROUND, DARK_COLOR, GREY_COLOR, HORIZONTAL_MARGIN, LIGHT_COLOR, REGULAR_FONT, SLATE_COLOR, WHITE_BACKGROUND, WHITE_COLOR } from '../../utils/const'
import { Eye, EyeCros } from '../../assets'

export default function RegisterPage({navigation}) {
    const isDarkMode = useColorScheme() === 'dark'

    const [isSecure, setIsSecure] = useState(true)

  return (
    <View style={{
        flex : 1,
        backgroundColor : isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND
     }}>
        <View style={{
            marginHorizontal : HORIZONTAL_MARGIN,
            justifyContent : 'center',
            height : '100%',
         }}>
            <View style={{
                marginBottom : 15
             }}>
                <Text style={{
                    fontFamily : BOLD_FONT,
                    fontSize : 24,
                    color : isDarkMode ? DARK_COLOR : LIGHT_COLOR
                }}>Register</Text>
            </View>
            <TextInput
            style={{
                borderWidth: 1,
                borderColor : isDarkMode ? SLATE_COLOR : GREY_COLOR,
                borderRadius : 5,
                padding : 10,
                fontFamily : REGULAR_FONT,
                color : isDarkMode ? DARK_COLOR : LIGHT_COLOR
             }}
             placeholder='Masukan Nama'
             placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
            />
             <View style={{height : 20}}/>
            <TextInput
            style={{
                borderWidth: 1,
                borderColor : isDarkMode ? SLATE_COLOR : GREY_COLOR,
                borderRadius : 5,
                padding : 10,
                fontFamily : REGULAR_FONT,
                color : isDarkMode ? DARK_COLOR : LIGHT_COLOR
             }}
             placeholder='Masukan email'
             placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
            />

            <View style={{height : 20}}/>

            <View
              style={{
                borderWidth: 1,
                borderColor : isDarkMode ? SLATE_COLOR : GREY_COLOR,
                borderRadius : 5,
                flexDirection: 'row',
                alignItems : 'center',
                justifyContent : 'space-between',
                paddingHorizontal: 10
             }}
            >
                <TextInput style={{
                fontFamily : REGULAR_FONT,
                color : isDarkMode ? DARK_COLOR : LIGHT_COLOR,
                flex : 1
             }}
             placeholder='Password'
             placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
             secureTextEntry={isSecure}/>
               <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                {isSecure ? <Eye /> : <EyeCros />}
               </TouchableOpacity>
            </View>

            <View style={{height : 20}}/>

            <TouchableOpacity style={{
                backgroundColor : BLUE_COLOR,
                padding : 10,
                borderRadius : 5,
             }}>
                <Text style={{ color : WHITE_COLOR, textAlign : 'center', fontFamily : REGULAR_FONT }}>Register</Text>
            </TouchableOpacity>

        </View>
    </View>
  )
}

const styles = StyleSheet.create({})