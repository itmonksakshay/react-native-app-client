import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Icon} from 'native-base';
import {
  height_60,
  font_title,
  font_description,
  profile,
  api_url,
} from '../config/Constants';
import {StatusBar} from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import CodeInput from 'react-native-confirmation-code-input';
import {CommonActions} from '@react-navigation/native';
import strings from '../languages/strings.js';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

class RegisterOtp extends Component {
  constructor(props) {
    super(props);
    this.state={
      timer: 10,
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount(){
    this.interval = setInterval(
      () => this.setState((prevState)=> ({ timer: prevState.timer - 1 })),
      1000
    );
  }
  
  componentDidUpdate(){
    if(this.state.timer === 0){ 
      clearInterval(this.interval);
    }
  }
  
  componentWillUnmount(){
   clearInterval(this.interval);
  }

  handleBackButtonClick() {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
    return true;
  }

  _onFinishCheckingCode2(code) {
    const {otp} = this.props.route.params.result;
    if (code != otp) {
      alert('Otp not match!');
    } else {
      this.saveData();
    }
  }

  saveData = async () => {
    try {
      await AsyncStorage.setItem(
        'user_id',
        this.props.route.params.result.id.toString(),
      );
      await AsyncStorage.setItem(
        'customer_name',
        this.props.route.params.result.customer_name.toString(),
      );
      global.id = await this.props.route.params.result.id;
      global.customer_name = await this.props.route.params.result.customer_name;
      const response = await axios({
        method: 'patch',
        url: api_url + profile + '/' + global.id,
        data: {
          customer_name: this.props.route.params.result.customer_name,
          phone_number: this.props.route.params.result.phone_number,
          email: this.props.route.params.result.email,
          status: 1,
        },
      });
      this.home();
    } catch (e) {
      console.log(e);
    }
  };

  sendOtpAgain = async () => {
    console.log('props ****** ',this.props)
    try {
      const response = await axios({
        method: 'post',
        url: `https://apps.gateway.sa/vendorsms/pushsms.aspx?user=carpet.pillow&password=q1w2e3r4&msisdn=${this.props.route.params.phoneNum}&sid=CP-LAUNDRY&msg=otp%20sent%20successfully&fl=0`
      });
      // console.log('response ******* ',response)
      if(response && response.status === 200){
        alert('Otp sent successfully')
      }
    } catch (e) {
      console.log(e);
    }
  };

  home = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

  render() {
    // const {otp} = this.props;

    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <View>
            <StatusBar />
          </View>
          <View style={styles.block_one}>
            <View style={styles.back_content}>
              <Icon
                onPress={this.handleBackButtonClick}
                style={styles.back_icon}
                name="arrow-back"
              />
            </View>
            <View>
              <Text style={styles.enter_otp}>{strings.enter_otp}</Text>
            </View>
            <View style={styles.code_content}>
              <Text style={styles.description}>
                {
                  strings.enter_the_code_you_have_received_by_phone_in_order_to_verify_account
                }
              </Text>
            </View>
            <View style={styles.code}>
              <CodeInput
                ref="codeInputRef2"
                keyboardType="numeric"
                codeLength={4}
                className="border-circle"
                autoFocus={false}
                codeInputStyle={{fontWeight: '800'}}
                activeColor={colors.theme_bg}
                inactiveColor={colors.theme_bg}
                onFulfill={isValid => this._onFinishCheckingCode2(isValid)}
              />
            </View>
            {/* {this.state.timer === 0 ?
            <Text onPress={()=>this.sendOtpAgain()} style={styles.resendCode}>{strings.resendOtp}</Text>
            :
            <Text style={styles.resendCode}>{strings.resendOtpText} {this.state.timer}</Text>
            } */}
          </View>
          <View style={{marginTop: '79%'}} />
        </View>
      </ScrollView>
    );
  }
}

export default RegisterOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg_three,
  },
  back_icon: {
    color: colors.theme_bg,
    marginTop: Platform.OS == "ios"? 20 : 0,
    marginLeft: Platform.OS == "ios"? 10 : 0,
  },
  back_content: {
    width: '100%',
    position: 'absolute',
    top:  10,
    left:  10,
  },
  block_one: {
    width: '100%',
    height: height_60,
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enter_otp: {
    color: colors.theme_fg,
    marginTop: 20,
    fontSize: 20,
    fontFamily: font_title,
  },
  code_content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  description: {
    marginTop: 20,
    fontSize: 13,
    textAlign: 'center',
    color: colors.theme_fg,
    fontFamily: font_description,
  },
  code: {
    height: '20%',
    marginTop: '5%',
    textAlign: 'center',
  },
  resendCode:{
    fontSize: 14,
    textAlign: 'right',
    color: colors.theme_fg,
    fontFamily: font_description,
  }
});
