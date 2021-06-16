import React, {Component} from 'react';
import {View, StyleSheet, Image, I18nManager} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {api_url, logo, settings} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import {StatusBar, Loader} from '../components/GeneralComponents';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/SplashActions';
import {notifications} from 'react-native-firebase-push-notifications';
import strings from '../languages/strings.js';
import { Platform } from 'react-native';
import RNRestart from 'react-native-restart';

class Splash extends Component {
  async componentDidMount() {
    // await AsyncStorage.removeItem('confirmPrivacyPolicy');
    await this.home();
    await this.getToken();
    await this.settings();
  }

  getToken = async () => {
    if(Platform.OS === "ios"){
      await notifications.requestPermission()
    }
    
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      let fcmToken = await notifications.getToken();
      if (fcmToken) {
        try {
          await AsyncStorage.setItem('fcmToken', fcmToken);
          global.fcm_token = fcmToken;
        } catch (e) {}
      }
    } else {
      global.fcm_token = fcmToken;
    }
  };

  getInitialNotification = async () => {
    //get the initial token (triggered when app opens from a closed state)
    const notification = await notifications.getInitialNotification();
    console.log('getInitialNotification', notification);
    return notification;
  };

  onNotificationOpenedListener = () => {
    //remember to remove the listener on un mount
    //this gets triggered when the application is in the background
    this.removeOnNotificationOpened = notifications.onNotificationOpened(
      notification => {
        console.log('onNotificationOpened', notification);
        //do something with the notification
      },
    );
  };

  onNotificationListener = () => {
    //remember to remove the listener on un mount
    //this gets triggered when the application is in the forground/runnning
    //for android make sure you manifest is setup - else this wont work
    //Android will not have any info set on the notification properties (title, subtitle, etc..), but _data will still contain information
    this.removeOnNotification = notifications.onNotification(notification => {
      //do something with the notification
      console.log('onNotification', notification);
    });
  };

  onTokenRefreshListener = () => {
    //remember to remove the listener on un mount
    //this gets triggered when a new token is generated for the user
    this.removeonTokenRefresh = messages.onTokenRefresh(token => {
      //do something with the new token
    });
  };

  setBadge = async number => {
    //only works on iOS for now
    return await notifications.setBadge(number);
  };

  getBadge = async () => {
    //only works on iOS for now
    return await notifications.getBadge();
  };

  hasPermission = async () => {
    //only works on iOS
    return await notifications.hasPermission();
    //or     return await messages.hasPermission()
  };

  requestPermission = async () => {
    //only works on iOS
    return await notifications.requestPermission();
    //or     return await messages.requestPermission()
  };

  componentWillUnmount() {
    //remove the listener on unmount
    if (this.removeOnNotificationOpened) {
      this.removeOnNotificationOpened();
    }
    if (this.removeOnNotification) {
      this.removeOnNotification();
    }

    if (this.removeonTokenRefresh) {
      this.removeonTokenRefresh();
    }
  }

  settings = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'get',
      url: api_url + settings,
    })
      .then(async response => {
        await this.props.serviceActionSuccess(response.data);
      })
      .catch(error => {
        this.props.serviceActionError(error);
      });
  };

  home = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    const customer_name = await AsyncStorage.getItem('customer_name');
    const lang = await AsyncStorage.getItem('lang');
    global.currency = this.props && this.props.data ? this.props.data.default_currency : 'SAR';
    global.stripe_key = this.props && this.props.data ? this.props.data.stripe_key : '';
    if (lang != null) {
      strings.setLanguage(lang);
      global.lang = await lang;
    } else {
      global.lang = 'ar';
      console.log("inside splash");
      strings.setLanguage('ar');
    }

    if (user_id !== null) {
      global.id = user_id;
      global.customer_name = customer_name;
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
    } else {
      global.id = '';
      const confirmPrivacyPolicy = await AsyncStorage.getItem(
        'confirmPrivacyPolicy',
      );
      if (!confirmPrivacyPolicy) {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'ConfirmPrivacyPolicy'}],
          }),
        );
      } else {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'OtpLogin'}],
          }),
        );
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <StatusBar />
        </View>
        <View style={styles.image_view}>
          <Image
            style={{flex: 1, width: undefined, height: undefined}}
            source={logo}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.splash.isLoding,
    error: state.splash.error,
    data: state.splash.data,
    message: state.splash.message,
    status: state.splash.status,
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
)(Splash);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
  },
  image_view: {
    height: 200,
    width: 350,
  },
});
