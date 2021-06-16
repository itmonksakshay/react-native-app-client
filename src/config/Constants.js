import {Dimensions} from 'react-native';
import strings from '../languages/strings.js';

// http://rithv2.demoproducts.in/
// https://idea2codeinfotech.com/laundry/

export const base_url = 'http://carpet-pillow.washworlds.com/';
export const api_url = 'http://carpet-pillow.washworlds.com/api/';
export const img_url = 'http://carpet-pillow.washworlds.com/public/uploads/';

export const settings = 'app_setting';
export const app_messages = 'app_message';
export const service = 'service';
export const faq = 'faq';
export const privacy = 'privacy_policy';
export const product = 'product';
export const register = 'customer';
export const login = 'customer/login';
export const otp_login = 'customer/otp_login';
export const resend_otp = 'customer/resend_otp';
export const address = 'address';
export const address_list = 'address/all';
export const address_delete = 'address/delete';
export const my_orders = 'get_orders';
export const promo_code = 'promo';
export const profile = 'customer';
export const profile_picture = 'customer/profile_picture';
export const forgot = 'customer/forgot_password';
export const reset = 'customer/reset_password';
export const place_order = 'order';
export const payment_list = 'payment';
export const stripe_payment = 'stripe_payment';

//Size
export const screenHeight = Math.round(Dimensions.get('window').height);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((35 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);

//Path
export const logo = require('.././assets/img/logo_with_name.png');
export const forgot_password = require('.././assets/img/forgot_password.png');
export const reset_password = require('.././assets/img/reset_password.png');
export const loading = require('.././assets/img/loading.png');
export const pin = require('.././assets/img/location_pin.png');
export const login_image = require('.././assets/img/logo_with_name.png');
export const washing_machine = require('.././assets/img/washing-machine.png');
export const completed_icon = require('.././assets/img/completed.png');
export const active_icon = require('.././assets/img/active.png');
export const logo_square_icon = require('.././assets/img/logo_square.png');

//Font Family
export const font_title = 'TitilliumWeb-Bold';
export const font_description = 'TitilliumWeb-Regular';

//Map
export const GOOGLE_KEY = 'AIzaSyAZhxlODY-nQhZrx_dqx-_R7MWQsIaNwYs';
export const LATITUDE_DELTA = 0.015;
export const LONGITUDE_DELTA = 0.0152;
