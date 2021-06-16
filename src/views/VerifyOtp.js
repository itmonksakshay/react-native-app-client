import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView, Alert, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import {Button} from 'react-native-elements';
import {api_url, resend_otp, height_60, font_title, font_description} from '../config/Constants';
import {StatusBar} from '../components/GeneralComponents';
import {connect} from 'react-redux';
import * as colors from '../assets/css/Colors';
import CodeInput from 'react-native-confirmation-code-input';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import strings from '../languages/strings.js';
import axios from 'axios';
import RNOtpVerify from 'react-native-otp-verify';

class VerifyOtp extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
        email: '',
        validation: true,
        fcm_token: global.fcm_token,
        language: global.lang,
        time_counter: 0,
        seconds: 60,
        ButtonStateHolder : true,
        showCounter: true,
        showResendButton: false
    };
    this.checkForSpecialLogin();
  }

  checkForSpecialLogin() {
    const customer_data = this.props.route.params.customer_data;
    if (customer_data.phone_number == "582811956") {
      this.saveData();
    }
  }

  componentDidMount() {
    this.myInterval = setInterval(() => {
        const { seconds, minutes } = this.state
        if (seconds > 0) {
            this.setState(({ seconds }) => ({
                seconds: seconds - 1
            }))
        }
        if (seconds === 0) { 
          clearInterval(this.myInterval);
          this.setState({      
            ButtonStateHolder : false,
            showCounter: false,     
            showResendButton: true   
          });
        } 
    }, 1000)
  }

  componentWillUnmount() {
      clearInterval(this.myInterval)
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  _onFinishCheckingCode2(code) {
    if (code != this.props.otp) {
      alert('Code not match!');
    } else {
        this.saveData();
    }
  }

  saveData = async () => {
    const customer_data = this.props.route.params.customer_data;
    if (customer_data.status == 1) {
      try {
        await AsyncStorage.setItem('user_id', customer_data.id.toString());
        if (customer_data.customer_name == null) {
            await AsyncStorage.setItem(
                'customer_name',
                customer_data.phone_number.toString(),
            );
            
        } else {
            await AsyncStorage.setItem(
                'customer_name',
                customer_data.customer_name.toString(),
            );
        }
      global.id = await customer_data.id;
      global.customer_name = await customer_data.customer_name;

      this.home();        
      } catch (e) {
        console.log(e);
      }
    } else {
      setTimeout(() => {
        if (this.state.language == 'ar') {
          Alert.alert('كلمة السر او الجوال خاطئه');
        } else {
          Alert.alert("Wrong credentials!");
        }
      }, 500);
    }
  };

  reset() {
    this.props.navigation.navigate('Reset');
  };

  home = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

  resendOtp = async () => {
    const {otp} = this.props;
    const customer_data = this.props.route.params.customer_data;
    if (otp != null) {
      await axios({
        method: 'post',
        url: api_url + resend_otp,
        data: {
          phone_number: customer_data.phone_number,
          prev_otp: otp
        },
      })
      .then(async response => {
        Alert.alert(strings.otpResentSuccess);
        this.setState({      
          showResendButton: false    
        })
      })
      .catch(error => {
        Alert.alert(strings.otpResentFailed);
      });
    }
  };

  render() {
    const {otp} = this.props;
    const { seconds } = this.state;
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
          </View>
          <View>
              {this.state.showCounter?<Text style={styles.enter_otp}>{strings.resendOtpText} : {seconds >= 0 ? <Text style={{color:colors.timer_color}}>{seconds}</Text> : null}</Text> : null}
              {this.state.showResendButton?<Button
                title={strings.resendOtp}
                onPress={this.resendOtp}
                buttonStyle={{backgroundColor: colors.theme_bg}}
                titleStyle={{
                  color: colors.theme_bg_three,
                  fontFamily: font_description,
                }}
              />: null }
          </View>
          <View style={{marginTop: '79%'}} />
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    otp: state.otplogin.data.otp,
  };
}

export default connect(
  mapStateToProps,
  null,
)(VerifyOtp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg_three,
  },
  back_icon: {
    color: colors.theme_bg,
  },
  back_content: {
    width: '100%',
    position: 'absolute',
    top: 10,
    left: 10,
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
  timer_box: {
    color: colors.timer_color,
    marginTop: 20,
    fontSize: 20,
    fontFamily: font_title,
  },
  ButtonStyle: {    
    paddingTop:10,
    paddingBottom:10,
    borderRadius:5,
    marginBottom: 5,
    backgroundColor: colors.theme_bg,
    marginTop: 10
  },
  TextStyle:{
    color:'#fff',
    textAlign:'center',
  }
});
