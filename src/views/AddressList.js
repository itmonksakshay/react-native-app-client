import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Icon,
  Footer,
  Col,
} from 'native-base';
import {Button} from 'react-native-elements';
import axios from 'axios';
import {connect} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {Loader} from '../components/GeneralComponents';
import {
  listServiceActionPending,
  listServiceActionError,
  listServiceActionSuccess,
  deleteServiceActionPending,
  deleteServiceActionError,
  deleteServiceActionSuccess,
} from '../actions/AddressListActions';
import {selectAddress} from '../actions/CartActions';
import {
  api_url,
  address_list,
  address_delete,
  img_url,
  height_30,
  no_data,
  font_title,
  font_description,
} from '../config/Constants';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import * as colors from '../assets/css/Colors';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import strings from '../languages/strings.js';

class AddressList extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      dialogVisible: false,
      deleting_address: 0,
      from: this.props.route.params.from,
    };
  }

  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.address_list();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  address_list = async () => {
    this.setState({dialogVisible: false});
    this.props.deleteServiceActionPending();
    await axios({
      method: 'post',
      url: api_url + address_list,
      data: {customer_id: global.id},
    })
      .then(async response => {
        await this.props.deleteServiceActionSuccess(response.data);
      })
      .catch(error => {
        this.props.deleteServiceActionError(error);
      });
  };

  address_delete = async () => {
    this.setState({dialogVisible: false});
    this.props.deleteServiceActionPending();
    await axios({
      method: 'post',
      url: api_url + address_delete,
      data: {customer_id: global.id, address_id: this.state.deleting_address},
    })
      .then( response => {
        setTimeout(async () => {
          await this.props.deleteServiceActionSuccess(response.data);

        },1000)
         this.setState({deleting_address: 0});
      })
      .catch(error => {
        this.props.deleteServiceActionError(error);
      });
  };

  open_popup(id) {
    this.setState({dialogVisible: true, deleting_address: id});
  }

  close_popup() {
    this.setState({dialogVisible: false, deleting_address: 0});
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  add_address = () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization("whenInUse")
      setTimeout(() =>{
        this.props.navigation.navigate('Address', {id: 0});
      },2000)
    } else {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => {
          this.props.navigation.navigate('Address', {id: 0});
        })
        .catch(err => {
          alert(strings.please_enable_your_location);
        });
    }
  };

  edit_address = id => {
    this.props.navigation.navigate('Address', {id: id});
  };

  select_address = async id => {
    await this.props.selectAddress(id);
    await this.props.navigation.navigate('Payment');
  };

  render() {
    const {isLoding, error, data, message, status, address_count} = this.props;
    const address_list = data.map((row, key) => {
      return (
        <View style={styles.address_content}>
          <View style={{flexDirection: 'row'}}>
            <Left>
              <Text style={styles.address_title}>
                {strings.address}
                {key + 1}
              </Text>
            </Left>
          </View>
          <View style={styles.static_map}>
            <Image
              style={{flex: 1, width: undefined, height: undefined}}
              source={{uri: img_url + row.static_map}}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Left>
              <Text style={styles.address}>{row.address}</Text>
            </Left>
          </View>
          <View style={styles.address_footer}>
            <Col style={{width: '25%'}}>
              <Text
                onPress={this.edit_address.bind(this, row.id)}
                style={styles.btn}>
                {strings.edit}
              </Text>
            </Col>
            <Col style={{width: '25%'}}>
              <Text
                onPress={this.open_popup.bind(this, row.id)}
                style={styles.btn}>
                {strings.delete}
              </Text>
            </Col>
            {this.state.from == 'cart' && (
              <Col style={{width: '25%'}}>
                <Text
                  onPress={this.select_address.bind(this, row.id)}
                  style={styles.btn}>
                  {strings.select}
                </Text>
              </Col>
            )}
          </View>
        </View>
      );
    });

    return (
      <Container style={{backgroundColor: colors.theme_bg_two}}>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <Icon
              onPress={this.handleBackButtonClick}
              style={styles.icon}
              name="arrow-back"
            />
          </Left>
          <Body style={styles.header_body}>
            <Title
              style={{
                alignSelf: 'center',
                color: '#202028',
                fontSize: 16,
                fontFamily: font_title,
              }}>
              {strings.manage_addresses}
            </Title>
          </Body>
          <Right />
        </Header>
        <ScrollView>
          <View style={styles.container}>
            <View>
              <Text style={styles.your_address}>{strings.your_addresses}</Text>
            </View>
            {address_count == 0 ? (
              <View style={{marginTop: height_30}}>
                <Text style={{fontFamily: font_description}}>{no_data}</Text>
              </View>
            ) : (
              address_list
            )}
          </View>
        </ScrollView>
        <Footer style={styles.footer}>
          <View style={styles.footer_content}>
            <Button
              title={strings.add_new_address}
              onPress={this.add_address}
              buttonStyle={styles.add_address}
              titleStyle={{
                color: colors.theme_bg_three,
                fontFamily: font_description,
              }}
            />
          </View>
        </Footer>
       <Loader visible={isLoding} />
        <ConfirmDialog
          title={strings.confirm_dialog}
          message={strings.are_you_sure_about_that}
          animationType="fade"
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          positiveButton={{
            title: strings.yes,
            onPress: this.address_delete,
            titleStyle: {
              color: colors.theme_fg,
            },
          }}
          negativeButton={{
            title: strings.no,
            onPress: () => this.setState({dialogVisible: false}),
            titleStyle: {
              color: colors.theme_fg,
            },
          }}
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.address_list.isLoding,
    message: state.address_list.isLoding,
    status: state.address_list.isLoding,
    data: state.address_list.data,
    address_count: state.address_list.address_count,
  };
}

const mapDispatchToProps = dispatch => ({
  listServiceActionPending: () => dispatch(listServiceActionPending()),
  listServiceActionError: error => dispatch(listServiceActionError(error)),
  listServiceActionSuccess: data => dispatch(listServiceActionSuccess(data)),
  deleteServiceActionPending: () => dispatch(deleteServiceActionPending()),
  deleteServiceActionError: error => dispatch(deleteServiceActionError(error)),
  deleteServiceActionSuccess: data =>
    dispatch(deleteServiceActionSuccess(data)),
  selectAddress: data => dispatch(selectAddress(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressList);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  address_content: {
    width: '100%',
    padding: 20,
    backgroundColor: colors.theme_bg_three,
    marginBottom: 10,
  },
  address_title: {
    fontSize: 15,
    fontFamily: font_title,
    color: colors.theme_fg_two,
  },
  static_map: {
    height: 100,
    width: '100%',
    marginTop: 10,
  },
  address: {
    fontSize: 15,
    marginTop: 5,
  },
  address_footer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  btn: {
    fontSize: 14,
    fontFamily: font_title,
    color: colors.theme_fg,
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
    color: '#202028',
    fontSize: 16,
    fontFamily: font_title,
  },
  your_address: {
    fontSize: 12,
    margin: 10,
    fontFamily: font_description,
  },
  footer: {
    backgroundColor: colors.theme_bg_three,
  },
  footer_content: {
    width: '90%',
    justifyContent: 'center',
  },
  add_address: {
    backgroundColor: colors.theme_bg,
  },
});
