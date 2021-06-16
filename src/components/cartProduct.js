import React from 'react';
import {
  Title,
  Icon,
  Row,
  Col,
  List,
  ListItem,
} from 'native-base';

import {StyleSheet, Text,View} from 'react-native';
import { useDispatch} from 'react-redux';

import * as colors from '../assets/css/Colors';
import strings from '../languages/strings.js';
import {font_title, font_description} from '../config/Constants';
import {updateToCart,useSelector} from '../actions/ProductActions';
import {subTotal} from '../actions/CartActions';

const amountstyleWidth = global.lang == 'ar' ? 60 : 80;


const CartProduct =({cart})=>{
	
	const dispatch = useDispatch();
	//const cartItems = useSelector((state)=> state.)

	const updateCart=(service_id,product_id,length)=>{
		
		if(length){
				let product = cart[service_id + '-' + product_id];
				product.qty -=1; 
				if(product.qty){
					delete cart[service_id + '-' + product_id];
					dispatch(updateToCart(cart));
					cart[service_id + '-' + product_id] = product;
					dispatch(updateToCart(cart));
				}else{
					delete cart[service_id + '-' + product_id];
					dispatch(updateToCart(cart));
					
				}
		}
		else{
			delete cart[service_id + '-' + product_id];
			dispatch(updateToCart(cart));
			
		}

		//await this.props.subTotal(sub_total);
	}
	
	const newuicart_items = {};
	let sub_total= 0;
    Object.keys(cart).map(key => {
      if (cart[key]?.hasLength) {
        [...Array(cart[key].qty).keys()].map(item => {
			sub_total += cart[key].price;
			newuicart_items[`${item} ${key}`] = {...cart[key], qty: 1};
        });
      } else {
		sub_total += cart[key].price;
        newuicart_items[key] = cart[key];
      }
    });
	dispatch(subTotal(parseFloat(sub_total)));

	return(<><List>
            {Object.keys(newuicart_items).map(key => {
				return (<ListItem>
							<Row>
								<Col style={{width: 40}}>
								  <Text style={styles.qty}>
									{newuicart_items[key].qty}x
								  </Text>
								</Col>
								<Col>
								  <Text>
									{newuicart_items[key].product_name}({' '}
									{newuicart_items[key].service_name} )
								  </Text>
								</Col>
								<Col>
									<Icon
										onPress={()=>updateCart(newuicart_items[key].service_id,newuicart_items[key].product_id,newuicart_items[key]?.hasLength)}
										  style={styles.icon}
										  name="trash"
										/>
								</Col>
								<Col style={{width: 60}}>
								  {newuicart_items[key]?.hasLength ? (
									<View>
									  <Text style={{fontSize: 12}}>
										{newuicart_items[key].price} {' / '}
										{global.currency}
									  </Text>
									  <Text style={{fontSize: 9}}>
										{strings.this_price_calculate_later}
									  </Text>
									</View>
								  ) : (
									<Text style={{width: amountstyleWidth}}>
									  {newuicart_items[key].price} {global.currency}
									</Text>
								  )}
								</Col>
							  </Row>	
						</ListItem>);
					})}
          </List></>);
	
	
}

export default CartProduct;


const styles = StyleSheet.create({
	
  icon: {
    color: colors.theme_fg_two,
  },
  
  qty: {
    fontSize: 15,
    color: colors.theme_fg,
    fontFamily: font_title,
  },
  
});
	
