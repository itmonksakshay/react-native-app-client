import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  Alert
} from 'react-native';
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
  Tab,
  Tabs,
  Col,
  List,
  ListItem,
} from 'native-base';
import {Button} from 'react-native-elements';


import {
  img_url,
  api_url,
  product,
  height_30,
  no_data,
  font_title,
  font_description,
} from '../config/Constants';
import {Loader} from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
  addToCart,
  refreshToCart,
} from '../actions/ProductActions';
import ProductFooter from '../components/productFooter';
import AppHeader from '../components/appHeader';
import ProductItem from '../components/productItem';
import {subTotal} from '../actions/CartActions';
import strings from '../languages/strings.js';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

class Product extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      service_id: this.props.route.params.id,
      service_name: this.props.route.params.service_name,
    };
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
     this.Product();
      
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }


  Product = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post',
      url: api_url + product,
      data: {service_id: this.state.service_id, lang: global.lang},
    })
      .then(async response => {
        await this.props.serviceActionSuccess(response.data);
      })
      .catch(error => {
        alert(JSON.stringify(error));
        this.props.serviceActionError(error);
      });
  };

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };




  render() {
    const {
      isLoding,
      error,
      data,
      message,
      status,
      cart_items,
      cart_count,
      navigation,
   } = this.props;
    
    return (<Container>
				<AppHeader navigation={this.props.navigation} title={this.state.service_name}/>
				{data != 0 && data != undefined && (
					<Tabs tabBarUnderlineStyle={{backgroundColor: colors.theme_bg_three}}>
            {data.map((row, index) => (
              <Tab
                heading={row.category_name}
                tabStyle={{backgroundColor: colors.theme_bg}}
                activeTabStyle={{backgroundColor: colors.theme_bg}}
                textStyle={{
                  fontFamily: font_title,
                  color: colors.theme_fg_three,
                }}
                activeTextStyle={{
                  color: colors.theme_bg_three,
                  fontFamily: font_title,
                }}>
               <ProductItem
					products={row.product}
					hasLength={row.has_length} 
					service_id={this.state.service_id}
					service_name={this.state.service_name}
				/>
                
              </Tab>
            ))}
          </Tabs>
        )}
        {data == 0 && (
          <Body style={{marginTop: height_30}}>
            <Text style={{fontFamily: font_description}}>{no_data}</Text>
          </Body>
        )}
        {cart_count ? (<ProductFooter navigation={this.props.navigation}/>) : null}
        <Loader visible={isLoding} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.product.isLoding,
    error: state.product.error,
    data: state.product.data,
    message: state.product.message,
    status: state.product.status,
    cart_count: state.product.cart_count,
    cart_items: state.product.cart_items,
    sub_total: state.cart.sub_total,
  };
}

const mapDispatchToProps = dispatch => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: error => dispatch(serviceActionError(error)),
  serviceActionSuccess: data => dispatch(serviceActionSuccess(data)),
  addToCart: data => dispatch(addToCart(data)),
  subTotal: data => dispatch(subTotal(data)),
  refreshToCart: data => dispatch(refreshToCart(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Product);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.theme_bg_two,
  },
  icon: {
    color: colors.theme_fg_two,
  },
  title: {
    alignSelf: 'center',
    color: colors.theme_fg_two,
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: font_title,
  },

  view_cart_container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  view_cart: {
    color: colors.theme_fg_three,
    fontFamily: font_title,
  },
  footerBtn: {
    backgroundColor: colors.theme_bg,
    marginBottom: 5,
  },
});
