import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  I18nManager,
  Platform,
} from 'react-native';
import {Loader} from '../components/GeneralComponents';
import {
  img_url,
  api_url,
  service,
  completed_icon,
  active_icon,
  font_title,
  font_description,
  app_messages,
} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
  setApp_messages,
} from '../actions/HomeActions';
import {filterType} from '../actions/MyOrdersActions';
import {productListReset} from '../actions/ProductActions';
import {CommonActions, TabActions} from '@react-navigation/native';
import Slideshow from 'react-native-image-slider-show';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Container,
  Header,
  Content,
  Left,
  Right,
  Title,
  Col,
  Card,
  Row,
  Picker,
} from 'native-base';
import strings from '../languages/strings.js';
import RNRestart from 'react-native-restart';
import { Alert } from 'react-native';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 1,
      dataSource: [],
      language: global.lang,
      active_order: 0,
      completed_order: 0,
    };
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.Service();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async componentWillMount() {
    const user_id = await AsyncStorage.getItem('user_id');
    if (user_id != null && global.customer_name == null) {
      Alert.alert('Complete Profile',  
        'Please complete your profile.',  
        [   
          {text: 'Ok', onPress: () => this.props.navigation.navigate('Profile')},  
        ],  
        {cancelable: false}  
      )  
    }
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position:
            this.state.position === this.state.dataSource.length
              ? 0
              : this.state.position + 1,
        });
      }, 3000),
    });
  }

  product = async (id, service_name) => {
    await this.props.productListReset();
    await this.props.navigation.navigate('Product', {
      id: id,
      service_name: service_name,
    });
  };

  Service = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post',
      url: api_url + service,
      data: {customer_id: global.id, lang: global.lang},
    })
      .then(async response => {
        this.setState({
          dataSource: response.data.banner_images,
          active_order: response.data.order.active,
          completed_order: response.data.order.completed,
        });
        await this.props.serviceActionSuccess(response.data);
      })
      .catch(error => {
        this.props.serviceActionError(error);
      });
    axios({
      method: 'post',
      url: api_url + app_messages,
      data: {lang: global.lang},
    }).then(async response => {
      this.props.setApp_messages(response.data.result);
    });
  };

  async language_change(lang) {
    try {
      await AsyncStorage.setItem('lang', lang);
      strings.setLanguage(lang);
      if (lang == 'ar') {
        I18nManager.forceRTL(true);
        RNRestart.Restart();
      } else {
        I18nManager.forceRTL(false);
        RNRestart.Restart();
      }
    } catch (e) {}
  }

  my_orders = async type => {
    await this.props.filterType(type);
    const jumpToAction = TabActions.jumpTo('MyOrders');
    this.props.navigation.dispatch(jumpToAction);
  };

  render() {
    const {isLoding, error, data, message, status} = this.props;
    return (
      <Container style={{backgroundColor: colors.theme_bg}}>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <Title style={styles.title}>{strings.app_name}</Title>
          </Left>
          <Right>
            <Picker
              mode="dropdown"
              selectedValue={this.state.language}
              style={{
                height: 50,
                width: Platform.OS === 'ios' ? 110 : 120,
                color: colors.theme_fg_two,
                fontFamily: font_description,
              }}
              onValueChange={itemValue => this.language_change(itemValue)}>
              <Picker.Item label="English || الإنجليزية" value="en" />
              <Picker.Item label="Arabic || عربى" value="ar" />
            </Picker>
          </Right>
        </Header>
        <Content>
          <Loader visible={Platform.OS === 'ios' ? false : isLoding} />
          <View>
            <Slideshow
              arrowSize={0}
              indicatorSize={0}
              scrollEnabled={true}
              position={this.state.position}
              dataSource={this.state.dataSource}
            />
          </View>
          <View style={{padding: 20}}>
            <Text
              style={{
                color: colors.theme_fg,
                fontSize: 18,
                fontFamily: font_title,
              }}>
              {strings.are_you_looking_for}
            </Text>
            <View style={{margin: 10}} />
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {data.map(row => {
                let service_image = img_url + row.image;
                return (
                  <Card
                    style={{
                      marginRight: 20,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.theme_bg_three,
                      padding: 10,
                      width: '43%',
                    }}>
                    <TouchableOpacity
                      style={{alignItems: 'center', justifyContent: 'center'}}
                      activeOpacity={1}
                      onPress={() => this.product(row.id, row.service_name)}>
                      <View style={styles.service_icon}>
                        <Image
                          style={{
                            flex: 1,
                            width: undefined,
                            height: undefined,
                          }}
                          source={{uri: service_image}}
                        />
                      </View>
                      <Text
                        style={{
                          color: colors.theme_fg,
                          fontFamily: font_title,
                        }}>
                        {row.service_name}
                      </Text>
                    </TouchableOpacity>
                  </Card>
                );
              })}
            </View>
          </View>
          <View style={{padding: 20}}>
            <Text
              style={{
                color: colors.theme_fg,
                fontSize: 18,
                fontFamily: font_title,
              }}>
              {strings.your_orders}
            </Text>
            <View style={{margin: 10}} />
            <Row>
              <Col>
                <Card
                  style={{
                    marginRight: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.theme_bg_three,
                    padding: 10,
                  }}>
                  <TouchableOpacity
                    style={{alignItems: 'center', justifyContent: 'center'}}
                    activeOpacity={1}
                    onPress={() => this.my_orders(1)}>
                    <View style={styles.orders_icon}>
                      <Image
                        style={{flex: 1, width: undefined, height: undefined}}
                        source={active_icon}
                      />
                    </View>
                    <View style={{margin: 5}} />
                    <Text
                      style={{
                        color: colors.theme_fg,
                        fontFamily: font_title,
                      }}>
                      {strings.active_orders} ({this.state.active_order})
                    </Text>
                  </TouchableOpacity>
                </Card>
              </Col>
              <Col>
                <Card
                  style={{
                    marginRight: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.theme_bg_three,
                    padding: 10,
                  }}>
                  <TouchableOpacity
                    style={{alignItems: 'center', justifyContent: 'center'}}
                    activeOpacity={1}
                    onPress={() => this.my_orders(2)}>
                    <View style={styles.orders_icon}>
                      <Image
                        style={{flex: 1, width: undefined, height: undefined}}
                        source={completed_icon}
                      />
                    </View>
                    <View style={{margin: 5}} />
                    <Text
                      style={{
                        color: colors.theme_fg,
                        fontFamily: font_title,
                      }}>
                      {strings.complete_orders} ({this.state.completed_order})
                    </Text>
                  </TouchableOpacity>
                </Card>
              </Col>
            </Row>
          </View>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.home.isLoding,
    error: state.home.error,
    data: state.home.data,
    message: state.home.message,
    status: state.home.status,
  };
}

const mapDispatchToProps = dispatch => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: error => dispatch(serviceActionError(error)),
  serviceActionSuccess: data => dispatch(serviceActionSuccess(data)),
  setApp_messages: data => dispatch(setApp_messages(data)),

  productListReset: () => dispatch(productListReset()),
  filterType: data => dispatch(filterType(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);

const styles = StyleSheet.create({
  service_name: {
    color: colors.theme_bg_three,
    fontSize: 18,
    fontFamily: font_title,
  },
  service_icon: {
    height: 120,
    width: 120,
  },
  orders_icon: {
    height: 80,
    width: 80,
  },
  language_icon: {
    height: 30,
    width: 30,
  },
  header: {
    // backgroundColor: colors.theme_bg_three,
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
    color: colors.theme_fg,
    fontSize: 18,
    fontFamily: font_title,
  },
});
