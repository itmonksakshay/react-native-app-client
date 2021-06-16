import React from 'react';
import {Footer} from 'native-base';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import strings from '../languages/strings.js';
import {CommonActions} from '@react-navigation/native';
import {StyleSheet,Alert} from 'react-native';
import * as colors from '../assets/css/Colors';
import {  font_title,font_description,} from '../config/Constants';

const ProductFooter =({navigation})=>{
	
	const cart = async () => {
		const user_id = await AsyncStorage.getItem('user_id');
		if(user_id !== null){
			navigation.navigate('Cart');
		}else{
			Alert.alert(
				strings.login_to_continue_title,
				strings.login_to_continue_desc,
				[{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
					},
					{ text: "OK", onPress: () => onPressOk() }]);  
		} 
	};

	const onPressOk=()=>{
		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{name: 'OtpLogin'}],
			}),
		);
	}
	
	
	
	
	return(<Footer style={styles.footer}>
        <Button
              onPress={() => navigation.navigate('Home')}
              title={strings.select_more_product}
              buttonStyle={styles.footerBtn}
              titleStyle={{
                color: colors.theme_fg_three,
                fontFamily: font_description,
              }}
            />
            <Button
              onPress={() => cart()}
              title={strings.view_cart}
              buttonStyle={styles.footerBtn}
              titleStyle={{
                color: colors.theme_fg_three,
                fontFamily: font_description,
              }}
            />
          </Footer>);}

export default ProductFooter;

const styles = StyleSheet.create({

  footer: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    marginBottom: 20,
  },
  footerBtn: {
    backgroundColor: colors.theme_bg,
    marginBottom: 5,
  },	
	
})
