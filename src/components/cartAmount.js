import React from 'react';
import * as colors from '../assets/css/Colors';
import strings from '../languages/strings.js';
import {font_title, font_description} from '../config/Constants';
import {StyleSheet, Text,} from 'react-native';
import {Row,Col,View} from 'native-base';
import { useDispatch} from 'react-redux';
import {total} from '../actions/CartActions';
const amountstyleWidth = global.lang == 'ar' ? 60 : 80;

const CartAmount=({subTotal,expressService,totalAmount,promoAmount,promo})=>{
	
	const dispatch = useDispatch();
	
    if (promo == undefined) {
		let net_total = parseFloat(subTotal);
		dispatch(total({promoAmount: 0, total: net_total.toFixed(2)}));
    } else {
		if (promo.promo_type == 1) {
			let net_total = parseFloat(subTotal - promo.discount);
			if (net_total >= 0) {
				dispatch(total({promo_amount: promo.discount.toFixed(2),total: net_total.toFixed(2)}));
			} else {
				alert('Sorry this promo is not valid!');
			}
		} else {
			let discount = (promo.discount / 100) * subTotal;
			let net_total = parseFloat(subTotal - discount);
			if (net_total >= 0) {
				dispatch(total({promo_amount: discount.toFixed(2),total: net_total.toFixed(2)}));
			} else {
				alert('Sorry this promo is not valid!');
			}
		}
    }
	
	
	return(<View><Row style={styles.sub_total}>
            <Col>
              <Text>{strings.subtotal}</Text>
            </Col>
            <Col style={{width: 60}}>
              <Text style={{fontFamily: font_title, width: amountstyleWidth}}>
                {subTotal} {global.currency}
              </Text>
            </Col>
          </Row>
          {expressService ? (
            <Row style={styles.discount}>
              <Col>
                <Text style={{width: 100}}>{strings.express_service}</Text>
              </Col>
              <Col style={{width: 60}}>
                <Text style={{fontFamily: font_title, width: amountstyleWidth}}>
                  {subTotal / 2} {global.currency}
                </Text>
              </Col>
            </Row>
          ) : null}
          <Row style={styles.discount}>
            <Col>
              <Text style={{width: amountstyleWidth}}>{strings.discount}</Text>
            </Col>
            <Col style={{width: 60}}>
              <Text style={{fontFamily: font_title, width: amountstyleWidth}}>
                {promoAmount} {global.currency}
              </Text>
            </Col>
          </Row>
          <Row style={styles.total}>
            <Col>
              <Text style={{width: 100}}>{strings.total}</Text>
            </Col>
            <Col style={{width: 60}}>
              <Text style={styles.total_amount}>
                {expressService
                  ? parseFloat(
                      (subTotal * 50) / 100 + parseFloat(totalAmount),
                    )
                  : totalAmount}{' '}
                {global.currency}
              </Text>
            </Col>
          </Row>
         </View>);
	
	
}

export default CartAmount;

const styles = StyleSheet.create({


  sub_total: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
    total_amount: {
    fontFamily: font_title,
    color: colors.theme_fg_two,
  },
    discount: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
    total: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
