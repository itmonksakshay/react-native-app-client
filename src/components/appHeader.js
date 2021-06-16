import React from 'react';
import {Header,
  Left,
  Body,
  Right,
  Title,
  Icon,} from 'native-base';
import {StyleSheet} from 'react-native';
import * as colors from '../assets/css/Colors';

import {font_title,font_description,} from '../config/Constants';

const AppHeader=({title,navigation})=>{
	
	const handleBackButton =()=>{
		navigation.goBack(null);
	}
	
	return(<Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
				<Left style={{flex: 1}}>
					<Icon
					  onPress={handleBackButton}
					  style={[styles.icon, {width: global.lang == 'ar' ? -150 : 150}]}
					  name="arrow-back"
					/>
				</Left>
				<Body style={styles.header_body}>
					<Title style={styles.title}>{title}</Title>
				</Body>
			<Right />
        </Header>);
	
	
}

export default AppHeader;

const styles = StyleSheet.create({
	
  header: {
    backgroundColor: colors.theme_bg_three,
  },
  icon: {
    color: colors.theme_fg_two,
  },
  header_body: {
    flex: 3,
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    color: colors.theme_fg_two,
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: font_title,
  },
	
});
