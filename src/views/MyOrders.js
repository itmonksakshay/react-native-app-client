import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Title,
  Col,
  Fab,
  Icon,
  Button,
} from 'native-base';
import {
  api_url,
  my_orders,
  height_30,
  washing_machine,
  font_title,
  font_description,
  logo_square_icon,
} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import {Loader} from '../components/GeneralComponents';
import Moment from 'moment';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
  filterType,
} from '../actions/MyOrdersActions';
import ProgressCircle from 'react-native-progress-circle-rtl';
import strings from '../languages/strings.js';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.state = {
      fab_active: false,
    };
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      let fab_active = (await this.props.filter_type) == 0 ? false : true;
      this.setState({fab_active: fab_active});
      await this.my_orders();
    });

    this.didBlurSubscription = this.props.navigation.addListener(
      'blur',
      async () => {
        await this.props.filterType(0);
      },
    );
  }

  onPressOk(){
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'OtpLogin'}],
      }),
    );
  }

  componentWillUnmount() {
    this._unsubscribe();
    this.didBlurSubscription();
  }

  myorders_details = data => {
    this.props.navigation.navigate('OrderDetails', {data: data});
  };

  my_orders = async () => {
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
    this.props.serviceActionPending();
    await axios({
      method: 'post',
      url: api_url + my_orders,
      data: {
        customer_id: global.id,
        filter_type: this.props.filter_type,
        lang: global.lang,
      },
    })
      .then(async response => {
        await this.props.serviceActionSuccess(response.data);
      })
      .catch(error => {
        this.props.serviceActionError(error);
      });
  };

  reset = async () => {
    this.setState({fab_active: false});
    await this.props.filterType(this.props.filter_type);
    await this.my_orders();
    this.setState({fab_active: true});
  };

  render() {
    // console.log('global values ***** ',global)
    Moment.locale('en');
    const {isLoding, error, data, message, status} = this.props;
    const amountstyleWidth = global.lang == 'ar' ? 80 : 80;
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}} />
          <Body style={styles.header_body}>
            <Title style={styles.title}>{strings.my_orders}</Title>
          </Body>
          <Right style={{flex: 1}}>
            {this.state.fab_active && (
              <Button transparent onPress={this.reset.bind(this)}>
                <Icon style={styles.icon} name="refresh" />
              </Button>
            )}
          </Right>
        </Header>
        <Content>
          <Loader visible={isLoding} />
          <List>
            {data.map((row, index) => (
              <ListItem onPress={() => this.myorders_details(row)}>
                <Col style={{width: '25%'}}>
                  <ProgressCircle
                    percent={row.status * 14.285}
                    radius={30}
                    borderWidth={3}
                    color="#115e7a"
                    shadowColor="#e6e6e6"
                    bgColor="#FFFFFF">
                    <View style={{height: 30, width: 30}}>
                      <Image
                        style={{flex: 1, width: undefined, height: undefined}}
                        source={logo_square_icon}
                      />
                    </View>
                  </ProgressCircle>
                </Col>
                <Col style={{width: '50%'}}>
                  <View style={{alignItems: 'flex-start'}}>
                    <Text style={styles.order_id}>
                      {strings.order_id}: {row.order_id}
                    </Text>
                    <View style={{margin: 1}} />
                    <Text style={{fontSize: 10, fontFamily: font_description}}>
                      {Moment(row.created_at).format('DD MMM-YYYY hh:mm')}
                    </Text>
                    <Text
                      style={{
                        color: colors.theme_fg,
                        fontFamily: font_description,
                      }}>
                      {row.label_name}
                    </Text>
                  </View>
                </Col>
                <Col>
                  <Text style={[styles.total, {width: amountstyleWidth}]}>
                    {row.total} {global.currency}
                  </Text>
                </Col>
              </ListItem>
            ))}
          </List>
          {data.length == 0 ? (
            <Body style={{marginTop: height_30}}>
              <Text>{strings.sorry_no_data_found}</Text>
            </Body>
          ) : null}
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.myorders.isLoding,
    error: state.myorders.error,
    data: state.myorders.data,
    filter_type: state.myorders.filter_type,
    message: state.myorders.message,
    status: state.myorders.status,
  };
}

const mapDispatchToProps = dispatch => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: error => dispatch(serviceActionError(error)),
  serviceActionSuccess: data => dispatch(serviceActionSuccess(data)),
  filterType: data => dispatch(filterType(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyOrders);

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
  order_id: {
    fontSize: 15,
    fontFamily: font_title,
    color: colors.theme_fg_two,
  },
  total: {
    fontSize: 15,
    fontFamily: font_title,
    color: colors.theme_fg_two,
  },
});
