import React, {Component} from 'react';
import {StyleSheet, Text, View, I18nManager} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Title,
  Icon,
  Row,
  CheckBox,
  Picker,
} from 'native-base';
import {Button} from 'react-native-elements';
import {CommonActions} from '@react-navigation/native';
import RNRestart from 'react-native-restart';
import axios from 'axios';
import {connect} from 'react-redux';

import * as colors from '../assets/css/Colors';
import {Loader} from '../components/GeneralComponents';
import {
  api_url,
  privacy,
  font_title,
  font_description,
} from '../config/Constants';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/PrivacyActions';
import strings from '../languages/strings.js';

class ConfiemPrivacyPolicy extends Component {
  constructor(props) {
    super(props);
    this.privacy_policy();
    this.state = {
      accepted: false,
      language: global.lang,
    };
  }

  async language_change(lang) {
    try {
      await AsyncStorage.setItem('lang', lang);
      this.setState({language: lang});
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

  privacy_policy = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post',
      url: api_url + privacy,
      data: {lang: global.lang},
    })
      .then(async response => {
        await this.props.serviceActionSuccess(response.data);
      })
      .catch(error => {
        this.props.serviceActionError(error);
      });
  };

  render() {
    const {isLoding, error, data, message, status} = this.props;

    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}} />
          <Body style={styles.header_body}>
            <Title style={styles.title}>{strings.privacy_policy}</Title>
          </Body>
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
        <Content style={{padding: 10}}>
          {data.map((row, index) => (
            <View>
              {/* <Row>
                <Text style={styles.policy_title}>{row.title}</Text>
              </Row> */}
              <Row>
                <Text style={styles.description}>{row.description}</Text>
              </Row>
              <View style={{margin: 10}} />
            </View>
          ))}
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <CheckBox
              checked={this.state.accepted}
              color={colors.theme_fg_two}
              onPress={() => this.setState({accepted: !this.state.accepted})}
            />
            <Text style={{marginLeft: 20}}>
              {strings.read_privacy_policy_checkbox}
            </Text>
          </View>
          <View
            style={{
              marginBottom: 30,
              marginLeft: '25%',
              width: '50%',
            }}>
            <Button
              title={strings.accept_button}
              disabled={!this.state.accepted}
              buttonStyle={{backgroundColor: colors.theme_bg}}
              onPress={async () => {
                await AsyncStorage.setItem('confirmPrivacyPolicy', 'true');
                this.props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'OtpLogin'}],
                  }),
                );
              }}
            />
          </View>
        </Content>

        <Loader visible={isLoding} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.privacy.isLoding,
    error: state.privacy.error,
    data: state.privacy.data,
    message: state.privacy.message,
    status: state.privacy.status,
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
)(ConfiemPrivacyPolicy);

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
  policy_title: {
    fontSize: 16,
    fontFamily: font_title,
    color: '#202028',
  },
  description: {
    fontSize: 13,
    marginTop: 5,
    fontFamily: font_description,
  },
});
