import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Keyboard,
  I18nManager,
  Platform,
  Alert,
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {Card, CardItem, Picker} from 'native-base';
import Snackbar from 'react-native-snackbar';
import {
  api_url,
  login,
  otp_login,
  height_40,
  login_image,
  font_title,
  font_description,
} from '../config/Constants';
import {StatusBar, Loader} from '../components/GeneralComponents';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/OtpLoginActions';
import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';
import * as colors from '../assets/css/Colors';
import strings from '../languages/strings.js';
import RNRestart from 'react-native-restart';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class OtpLogin extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      email: '',
      validation: true,
      fcm_token: global.fcm_token,
      language: global.lang,
    };
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  otplogin = async () => {
    Keyboard.dismiss();
    this.checkValidate();

    if (this.state.validation) {
        this.props.serviceActionPending();
        await axios({
          method: 'post',
          url: api_url + otp_login,
          data: {
            phone_number: this.state.email,
            fcm_token: this.state.fcm_token
          },
        })
        .then(async response => {
        await this.props.serviceActionSuccess(response.data);
        this.otp(response.data);
        })
        .catch(error => {
        this.props.serviceActionError(error);
        });
    }
  };

    otp(data) {
        if (this.props.status == 1) {
            this.props.navigation.navigate('VerifyOtp', {customer_data: data.result});
        } else {
            alert(this.props.message);
        }
    }
    checkValidate() {
        if (this.state.email == '') {
            this.state.validation = false;
            this.showSnackbar('Please enter mobile no.');
            return true;
        } else {
            this.state.validation = true;
            return true;
        }
    }

  home = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

  showSnackbar(msg) {
    Snackbar.show({
      text: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

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
    } catch (e) {
      console.log(e);
    }
  }

  navigateToHome(){
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  }

  render() {
    const {isLoding, error, data, message, status} = this.props;

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <View>
            <StatusBar />
          </View>
          <Loader visible={isLoding} />
          <View style={styles.header_section}>
            <View style={styles.logo_content}>
              <Image style={styles.logo} source={login_image} />
            </View>
          </View>
          <View style={styles.bottom_section}>
            <Card style={{marginLeft: 15, marginRight: 15, borderRadius: 20}}>
              <CardItem bordered style={{borderRadius: 20}}>
                <View style={styles.body_section}>
                  <Text style={styles.register_name}>{strings.login}</Text>
                  <View
                    style={[
                      styles.input,
                      {
                        height: 40,
                        marginTop: 30,
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '80%',
                        marginLeft: -40,
                      },
                    ]}>
                    { this.state.language === 'ar'?
                      <>
                        {I18nManager.isRTL === true?
                          <>
                            <View
                              style={{width: '100%', marginTop: 5, marginLeft: -10}}>
                              <Input
                                inputStyle={{
                                  fontSize: 13,
                                  fontFamily: font_description,
                                }}
                                placeholder={strings.phone}
                                keyboardType="phone-pad"
                                onChangeText={TextInputValue =>
                                  this.setState({email: TextInputValue})
                                }
                                leftIcon={
                                  <Icon name="call" size={20} color={colors.theme_bg} />
                                }
                              />
                            </View>
                            <View
                              style={{
                                width: '25%',
                                marginLeft: -5,
                                marginTop: Platform.OS === 'ios' ? 11 : 0,
                              }}>
                              <Input
                                inputStyle={{
                                  fontSize: 13,
                                  fontFamily: font_description,
                                  color: colors.theme_fg_four,
                                }}
                                value="+966"
                                editable={false}
                              />
                            </View>
                          </> :
                          <>
                            <View
                              style={{
                                width: '25%',
                                marginLeft: -5,
                                marginTop: Platform.OS === 'ios' ? 11 : 0,
                              }}>
                              <Input
                                inputStyle={{
                                  fontSize: 13,
                                  fontFamily: font_description,
                                  color: colors.theme_fg_four,
                                }}
                                value="+966"
                                editable={false}
                              />
                            </View>
                            <View
                              style={{width: '100%', marginTop: 5, marginLeft: -10}}>
                              <Input
                                inputStyle={{
                                  fontSize: 13,
                                  fontFamily: font_description,
                                }}
                                placeholder={strings.phone}
                                keyboardType="phone-pad"
                                onChangeText={TextInputValue =>
                                  this.setState({email: TextInputValue})
                                }
                                leftIcon={
                                  <Icon name="call" size={20} color={colors.theme_bg} />
                                }
                              />
                            </View>
                          </>
                        }
                      </>
                      : 
                      <>
                      <View
                          style={{
                            width: '25%',
                            marginLeft: -5,
                            marginTop: Platform.OS === 'ios' ? 11 : 0,
                          }}>
                          <Input
                            inputStyle={{
                              fontSize: 13,
                              fontFamily: font_description,
                              color: colors.theme_fg_four,
                            }}
                            value="+966"
                            editable={false}
                          />
                        </View>
                        <View
                          style={{width: '100%', marginTop: 5, marginLeft: -10}}>
                          <Input
                            inputStyle={{
                              fontSize: 13,
                              fontFamily: font_description,
                            }}
                            placeholder={strings.phone}
                            keyboardType="phone-pad"
                            onChangeText={TextInputValue =>
                              this.setState({email: TextInputValue})
                            }
                            leftIcon={
                              <Icon name="call" size={20} color={colors.theme_bg} />
                            }
                          />
                        </View>
                      </>
                    }
                    
                  </View>
                  <View style={{margin: 10}} />
                  <View style={styles.footer_section}>
                    <View
                      style={{
                        height: 40,
                        width: '93%',
                        marginTop: 10,
                        marginBottom: 10,
                      }}>
                      <Button
                        title={strings.next}
                        onPress={this.otplogin}
                        buttonStyle={{backgroundColor: colors.theme_bg}}
                        titleStyle={{
                          color: colors.theme_bg_three,
                          fontFamily: font_description,
                        }}
                      />
                    </View>
                  </View>
                  <View style={{marginTop: 10}} />
                </View>
              </CardItem>
            </Card>
          </View>
          <View style={{bottom:30}}>
            <Button
              title={strings.continue_as_guest}
              onPress={()=>this.navigateToHome()}
              buttonStyle={{backgroundColor: colors.theme_bg}}
              titleStyle={{
                color: colors.theme_bg_three,
                fontFamily: font_description,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              bottom:30
              // marginTop: 20,
            }}>
            <Text
              style={{
                color: colors.theme_fg,
                fontSize: 16,
                fontFamily: font_description,
                marginRight: 10,
              }}>
              language || اللغة
            </Text>
            <View style={{width: Platform.OS === 'ios' ? 110 : 120}}>
              <Picker
                mode="dropdown"
                selectedValue={this.state.language}
                style={{
                  height: 50,
                  color: colors.theme_fg_two,
                  fontFamily: font_description,
                }}
                onValueChange={itemValue => this.language_change(itemValue)}>
                <Picker.Item label="English || الإنجليزية" value="en" />
                <Picker.Item label="Arabic || عربى" value="ar" />
              </Picker>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.otplogin.isLoding,
    error: state.otplogin.error,
    data: state.otplogin.data,
    message: state.otplogin.message,
    status: state.otplogin.status,
  };
}

const mapDispatchToProps = dispatch => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: error => dispatch(serviceActionError(error)),
  serviceActionSuccess: data => dispatch(serviceActionSuccess(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OtpLogin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header_section: {
    width: '100%',
    height: height_40,
    backgroundColor: colors.theme_bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo_content: {
    height: 150,
    width: 300,
  },
  logo: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
  },
  register_name: {
    color: colors.theme_fg,
    fontSize: 20,
    fontFamily: font_title,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  body_section: {
    width: '100%',
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 30,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  input_text: {
    borderColor: colors.theme_bg,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontFamily: font_description,
  },
  footer_section: {
    width: '100%',
    alignItems: 'center',
  },
  login_content: {
    width: '100%',
    margin: 5,
    alignItems: 'center',
  },
  login_string: {
    color: colors.theme_fg,
  },
  btn_style: {
    backgroundColor: colors.theme_bg,
  },
  bottom_section: {
    left: 0,
    top: -60,
  },
  email: {
    borderColor: colors.theme_bg,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    height: 40,
  },
  forgot_password_container: {
    width: '95%',
    alignItems: 'flex-end',
  },
  signup_container: {
    width: '100%',
    // justifyContent: 'flex-end',
    alignItems: 'center',
    bottom:40
  },
});
