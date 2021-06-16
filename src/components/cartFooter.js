import React from 'react';
import {Footer} from 'native-base';
import {Button} from 'react-native-elements';
import {View,StyleSheet} from 'react-native';
import Snackbar from 'react-native-snackbar';
import * as colors from '../assets/css/Colors';
import {font_title,font_description,} from '../config/Constants';

const CartFooter=({btn_title,navigation,deliverDate,msg})=>{
	
	const selectAddress = () => {
    if (deliverDate != undefined) {
      navigation.navigate('AddressList', {from: 'cart'});
    } else {
      showSnackbar(msg);
    }
  };

  const showSnackbar=(msg)=> {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }
	
	
	return(<Footer style={styles.footer}>
            <View style={styles.footer_content}>
              <Button
                onPress={selectAddress}
                title={btn_title}
                buttonStyle={styles.select_address}
                titleStyle={{
                  // color: colors.theme_bg_three,
                  color: colors.theme_fg_three,
                  fontFamily: font_description,
                }}
              />
            </View>
          </Footer>);
	
	
	
	}
	
export default CartFooter;

const styles = StyleSheet.create({

  footer: {
    backgroundColor: 'transparent',
  },
  footer_content: {
    width: '90%',
  },
  select_address: {
    backgroundColor: colors.theme_bg,
  },
	

})
