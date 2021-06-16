import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Icon,
  Row,
  Footer,
  Col,
  List,
  ListItem,
  CheckBox,
} from 'native-base';
import {Button, Divider} from 'react-native-elements';
import {Loader} from '../components/GeneralComponents';
import {connect} from 'react-redux';
import {font_title, font_description} from '../config/Constants';
import {
  subTotal,
  total,
  calculatePricing,
  selectDate,
  setexpressService,
} from '../actions/CartActions';
import {updateToCart} from '../actions/ProductActions';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Snackbar from 'react-native-snackbar';
import * as colors from '../assets/css/Colors';
import strings from '../languages/strings.js';
import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';
import {addToCart} from '../actions/ProductActions';
import AppHeader from '../components/appHeader';
import CartFooter from '../components/cartFooter';
import CartProduct from '../components/cartProduct';
import CartAmount from '../components/cartAmount';

class Cart extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
   // this.updateCart = this.updateCart.bind(this);
    this.state = {
      deliveryDatePickerVisible: false,
      isLoding: true,
      //service_id: this.props.route.params.id,
      //service_name: this.props.route.params.service_name,
    };
  }

  async componentDidMount() {
    /*this._unsubscribe = this.props.navigation.addListener('focus', () => {	
		this.calculate_total();
    });*/
    await this.my_cart();
  }

  componentWillUnmount() {
   // this._unsubscribe();
  }

  onPressOk(){
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'OtpLogin'}],
      }),
    );
  }

  my_cart = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    if(user_id == null){
      Alert.alert(
        strings.login_to_continue_title,
        strings.login_to_continue_desc,
        [
          { text: "OK", onPress: () => this.onPressOk() }
        ]
      );
    }
  }

  showDeliveryDatePicker = () => {
    this.setState({deliveryDatePickerVisible: true});
  };

  hideDeliveryDatePicker = () => {
    this.setState({deliveryDatePickerVisible: false});
  };

  handleDeliveryDatePicked = async date => {
    this.setState({deliveryDatePickerVisible: false});
    var d = new Date(date);
    let delivery_date =
      d.getDate() +
      '/' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '/' +
      d.getFullYear();
    await this.props.selectDate(delivery_date);
  };

  handleExpress_service() {
    this.props.setexpressService(!this.props.express_service);
    // this.calculate_total();
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  address_list = () => {
    this.props.navigation.navigate('AddressList');
  };

  select_address = () => {
    if (this.props.delivery_date != undefined) {
      this.props.navigation.navigate('AddressList', {from: 'cart'});
    } else {
      this.showSnackbar(strings.please_choose_delivery_date);
    }
  };

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  updateCart= async(cart_items,service_id,prd_id)=>{

 }

  promo = () => {
    this.props.navigation.navigate('Promo');
  };

  render() {
   const {
      isLoding,
      cart_items,
      sub_total,
      total_amount,
      promo_amount,
      promo,
      delivery_date,
      express_service,
      app_messages,
      cart_count,
    } = this.props;

    const amountstyleWidth = global.lang == 'ar' ? 60 : 80;
    const {delivery_note, service_note, tax_note} = app_messages;
    

    var empty_cart = this.props.cart_count === 0;
    
    
    return (
      <Container>
		<AppHeader navigation={this.props.navigation} title={strings.cart}/>
        <ScrollView>
          <Divider style={{backgroundColor: colors.theme_fg_two}} />
          <Row style={{padding: 10}}>
            <Left>
              <Text>{strings.your_clothes}</Text>
            </Left>
          </Row>
          <CartProduct cart={cart_items}/>
          {promo === undefined ? (
            <Row style={{padding: 20}}>
              <Col style={{width: 50}}>
                <Icon style={{color: colors.theme_fg_two}} name="pricetag" />
              </Col>
              <Col>
                <Text style={{fontSize: 12, fontFamily: font_description}}>
                  {strings.no_promotion_applied}
                </Text>
                <Text
                  onPress={() => this.promo()}
                  style={styles.choose_promotion}>
                  {strings.choose_promotion}
                </Text>
              </Col>
            </Row>
          ) : (
            <Row style={{padding: 20}}>
              <Col style={{width: 50}}>
                <Icon style={{color: colors.theme_fg}} name="pricetag" />
              </Col>
              <Col>
                <Text style={styles.promotion_applied}>{strings.promotion_applied}</Text>
                <Text style={{fontSize: 12, fontFamily: font_description}}>
                  {strings.you_are_saving} {global.currency}
                  {promo_amount}
                </Text>
                <Text onPress={() => this.promo()} style={styles.change_promo}>
                  {strings.change_promo}
                </Text>
              </Col>
            </Row>
          )}
          <Divider style={{backgroundColor: colors.theme_fg_two}} />
          <Row style={{padding: 20}}>
            <Col
              onPress={() => this.handleExpress_service()}
              style={{width: 50}}>
              <CheckBox
                checked={this.props.express_service}
                style={{marginTop: 10, marginLeft: -5}}
                onPress={() => this.handleExpress_service()}
              />
            </Col>
            <Col>
              <Text style={styles.choose_promotion}>
                {strings.express_service}
              </Text>
              <Text style={{fontSize: 12, fontFamily: font_description}}>
                {strings.express_service_info}
              </Text>
            </Col>
          </Row>
          <Divider style={{backgroundColor: colors.theme_fg_two}} />
			
			
			<CartAmount subTotal={sub_total} expressService={express_service} totalAmount={total_amount} promoAmount={promo_amount} promo={promo}/>
          
          
          <Divider style={{backgroundColor: colors.theme_fg_two}} />

          <View style={{marginHorizontal: 20, marginTop: 10}}>
            <Text style={styles.delivery_date_text}>
              {strings.note}:- {delivery_note}
            </Text>
            <Text style={styles.delivery_date_text}>
              {strings.note}:-{service_note}
            </Text>
            <Text style={styles.delivery_date_text}>
              {strings.note}:-{tax_note}
            </Text>
          </View>
          <Divider style={{backgroundColor: colors.theme_fg_two}} />
          {empty_cart ?
             null
            : 
            <Row style={styles.delivery_date}>
              <Col>
                <Button
                  title={strings.choose_expected_delivery_date}
                  type="outline"
                  buttonStyle={{borderColor: colors.theme_fg}}
                  titleStyle={{
                    color: colors.theme_fg,
                    fontFamily: font_description,
                  }}
                  onPress={this.showDeliveryDatePicker}
                />
                <DateTimePicker
                  locale={'ar'}
                  isVisible={this.state.deliveryDatePickerVisible}
                  onConfirm={this.handleDeliveryDatePicked}
                  onCancel={this.hideDeliveryDatePicker}
                  minimumDate={new Date()}
                  mode="date"
                />
              </Col>
            </Row>
          }

          {delivery_date != undefined && (
            <Row style={{justifyContent: 'center'}}>
              <Text style={styles.delivery_date_text}>{delivery_date}</Text>
            </Row>
          )}

          <View style={{marginHorizontal: 20, marginBottom: 20}}>
            <Button
              onPress={() => this.props.navigation.navigate('Home')}
              title={strings.select_more_product}
              buttonStyle={styles.select_address}
              titleStyle={{
                // color: colors.theme_bg_three,
                color: colors.theme_fg_three,
                fontFamily: font_description,
              }}
            />
          </View>
        </ScrollView>
        { empty_cart ? null : <CartFooter 
								navigation={this.props.navigation} 
								btn_title={strings.select_address}
								deliverDate={this.props.delivery_date}
								msg={strings.please_choose_delivery_date}/>
		}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    cart_items: state.product.cart_items,
    cart_count: state.product.cart_count,
    sub_total: state.cart.sub_total,
    promo: state.cart.promo,
    total_amount: state.cart.total_amount,
    promo_amount: state.cart.promo_amount,
    isLoding: state.cart.isLoding,
    delivery_date: state.cart.delivery_date,
    express_service: state.cart.express_service,
    app_messages: state.home.app_messages,
  };
}

const mapDispatchToProps = dispatch => ({
  updateToCart: cart_items => dispatch(updateToCart(cart_items)),	
  subTotal: data => dispatch(subTotal(data)),
  total: data => dispatch(total(data)),
  calculatePricing: () => dispatch(calculatePricing()),
  selectDate: data => dispatch(selectDate(data)),
  setexpressService: data => dispatch(setexpressService(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cart);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.theme_bg_two,
  },
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
  qty: {
    fontSize: 15,
    color: colors.theme_fg,
    fontFamily: font_title,
  },
  promotion_applied: {
    fontSize: 15,
    color: colors.theme_fg,
    fontFamily: font_title,
  },
  choose_promotion: {
    color: colors.theme_fg,
    fontFamily: font_title,
  },
  change_promo: {
    color: colors.theme_fg,
    fontSize: 13,
    fontFamily: font_description,
  },
  sub_total: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
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
  total_amount: {
    fontFamily: font_title,
    color: colors.theme_fg_two,
  },
  delivery_date: {
    padding: 20,
    justifyContent: 'center',
  },
  delivery_date_text: {
    color: colors.theme_fg,
    marginBottom: 20,
    fontFamily: font_description,
  },

});
