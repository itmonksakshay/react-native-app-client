import React,{useState,useEffect} from 'react';
import UIStepper from 'react-native-ui-stepper';
import * as colors from '../assets/css/Colors';
import {
  Row,
  Col,
  List,
  ListItem,
} from 'native-base';

import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';

import strings from '../languages/strings.js';
import {
	font_title,
	font_description,
	img_url,
} from '../config/Constants';

import {addToCart,updateToCart} from '../actions/ProductActions';

import { useDispatch,useSelector} from 'react-redux';

const ProductItem =({products,hasLength,service_id,service_name})=>{

	const dispatch = useDispatch();
	const cart_items = useSelector(state => state.product.cart_items);

		const cartQty =(product_id)=>{
			if(cart_items[service_id + '-' + product_id]){
				return cart_items[service_id +'-' +product_id].qty;
			}
			else{
				
				return 0;
			}
		}
		const addToCartAction= async(qty,product_id,product_name,price,hasLength)=>{
		
			if (qty > 0) {
				let product_data = {
					service_id:service_id,
					service_name:service_name,
					product_id: product_id,
					product_name: product_name,
					qty: qty,
					price: hasLength ? price : parseFloat(qty * price),
					hasLength,
				};
				cart_items[service_id + '-' + product_id] = product_data;
				dispatch(addToCart(cart_items));
						
			}else{
				delete cart_items[service_id + '-' + product_id];
				dispatch(updateToCart(cart_items));		
			}
		}
	

		
	
	const ProductPrice =({string,product_price})=>(<Col style={{width: 70}}>
                                  <Text style={styles.price}>
                                    {product_price} {global.currency} /
                                  </Text>
                                  <Text style={styles.piece}>
                                    {string}
                                  </Text>
                                </Col>);
                                
	return(<ScrollView>
                  <List>
                    <FlatList
                      data={products}
                      renderItem={({item, index}) => (<ListItem key={index}>
	
						 <Row style={{padding: 10}}>
							<Col style={{width: 100}}>
								
								<View style={styles.image_container}>
									<Image style={styles.product_image} source={{uri: img_url + item.image}}/>
								</View>
							</Col>
							<Col>
								<Text style={styles.product_name}>{item.product_name}</Text>
								<View style={{marginTop: 10}}>	
									
							<UIStepper onValueChange={(value, dd) => {
								addToCartAction(value,item.id,item.product_name,item.price,hasLength);
								}}
								displayValue={true}
								initialValue={cartQty(item.id)}
								value={cartQty(item.id)}
								borderColor="#115e7a"
								textColor="#115e7a"
								tintColor="#115e7a"
							  />
				
								</View>
							</Col>
							  {hasLength ? 
								  (<ProductPrice product_price={item.price} string={strings.piece}/>):
								  (<ProductPrice product_price={item.price} string={strings.square_meter}/>)
							  }
						 </Row>
						 </ListItem>)}
						keyExtractor={item => item.faq_name}
                    />
				</List>
               </ScrollView>);
						 
	
	
}

export default ProductItem;

const styles = StyleSheet.create({

	product_image:{
		flex: 1,
		width: undefined,
		height: undefined,
	},
	image_container: {
		height: 75,
		width: 75,
	},
	product_name: {
		fontSize: 15,
		fontFamily: font_title,
		color: colors.theme_fg_two,
	},
	piece: {
		fontSize: 12,
		color: colors.theme_fg,
		fontFamily: font_description,
	},
	price: {
		fontSize: 15,
		color: colors.theme_fg,
		fontFamily: font_description,
		width: 50,
	},

});
