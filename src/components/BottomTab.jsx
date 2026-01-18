import {View, Text, TouchableOpacity, useColorScheme} from 'react-native';
import {BLUE_COLOR, DARK_BACKGROUND, LIGHT_COLOR} from '../utils/const';
import {
  HomeActive,
  HomeDefault,
  TransaksiActive,
  TransaksiDefault,
  UserActive,
  UserDefault,
} from '../assets';

function MyTabBar({state, descriptors, navigation}) {
  const isDarkMode = useColorScheme() === 'dark';

  const IkonMenu = ({label, active}) => {
    if (label === 'Home') return active ? <HomeActive /> : <HomeDefault />;
    if (label === 'Transaksi')
      return active ? <TransaksiActive /> : <TransaksiDefault />;
    if (label === 'Profil') return active ? <UserActive /> : <UserDefault />;
    return <HomeDefault />;
  };

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              backgroundColor: isDarkMode ? DARK_BACKGROUND : '#FFF',
              padding: 10,
              alignItems: 'center',
            }}>
            <IkonMenu label={label} active={isFocused} />
            <Text style={{color: isFocused ? BLUE_COLOR : LIGHT_COLOR}}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default MyTabBar;
