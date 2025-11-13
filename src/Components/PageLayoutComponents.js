import React from 'react'
import { Image } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

    export const HeaderLogoComponent = () => {
        return (
            <Image
                style={{ width: 350, height: 45 }}
                resizeMode={'contain'}
                source={require('../Assets/Icons/WorkFoceWhiteSmallLogo.png')}
            />
        );
    };

    export const DrawerIconComponent = props => {
        return (
            <EvilIcons
                name="navicon"
                color={'#111'}
                style={{ paddingLeft: 10, paddingRight: 0 }}
                onPress={() => props.navigation.openDrawer()}
                size={26}
            />
        );
    };