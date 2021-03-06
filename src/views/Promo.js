import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, TextInput} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Icon,
  Item,
  Input,
} from 'native-base';
import {Button} from 'react-native-elements';

import {
  api_url,
  promo_code,
  font_title,
  font_description,
} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import {Loader} from '../components/GeneralComponents';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
  addPromo,
} from '../actions/PromoActions';
import {promo} from '../actions/CartActions';
import strings from '../languages/strings.js';

class Promo extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.Promo();
    this.state = {
      promo_code: '',
    };
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  Promo = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post',
      url: api_url + promo_code,
      data: {lang: global.lang},
    })
      .then(async response => {
        await this.props.serviceActionSuccess(response.data);
      })
      .catch(error => {
        this.props.serviceActionError(error);
      });
  };

  apply = async () => {
    const resultPromo = this.props.data.find(
      item => item.promo_code === this.state.promo_code,
    );
    if (resultPromo) {
      await this.props.promo(resultPromo);
      this.handleBackButtonClick();
    } else {
      alert(strings.promo_not_found);
    }
  };

  render() {
    const {isLoding, error, data, message, status} = this.props;

    return (
      <Container style={{backgroundColor: colors.theme_bg_three}}>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <Icon
              onPress={this.handleBackButtonClick}
              style={styles.icon}
              name="arrow-back"
            />
          </Left>
          <Body style={styles.header_body}>
            <Title style={styles.title}>{strings.apply_coupons}</Title>
          </Body>
          <Right />
        </Header>
        <View style={{marginTop: 200, alignItems: 'center'}}>
          <View style={styles.input}>
            <Item>
              <Input
                placeholder={strings.enter_promo_code}
                value={this.state.promo_code}
                onChangeText={TextInputValue =>
                  this.setState({promo_code: TextInputValue})
                }
                style={styles.text_input}
              />
            </Item>
          </View>
          <View style={{marginTop: 20}}>
            <Button
              title={strings.add_promo_code}
              onPress={() => this.apply()}
              buttonStyle={{backgroundColor: colors.theme_bg}}
              titleStyle={{
                color: colors.theme_fg_three,
                fontFamily: font_description,
              }}
            />
          </View>
        </View>
        {/* <ScrollView>
          <View style={styles.container}>
            {data.map((row, index) => (
              <View style={styles.promo_block}>
                <View style={{flexDirection: 'row'}}>
                  <Left>
                    <Text style={styles.promo_code}>{row.promo_code}</Text>
                  </Left>
                  <Right>
                    <Text onPress={() => this.apply(row)} style={styles.apply}>
                      {strings.apply}
                    </Text>
                  </Right>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Left>
                    <Text style={styles.promo_name}>{row.promo_name}</Text>
                  </Left>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Left>
                    <Text style={styles.description}>{row.description}</Text>
                  </Left>
                </View>
              </View>
            ))}
          </View>
        </ScrollView> */}
        <Loader visible={isLoding} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.promo.isLoding,
    error: state.promo.error,
    data: state.promo.data,
    message: state.promo.message,
    status: state.promo.status,
  };
}

const mapDispatchToProps = dispatch => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: error => dispatch(serviceActionError(error)),
  serviceActionSuccess: data => dispatch(serviceActionSuccess(data)),
  addPromo: data => dispatch(addPromo(data)),
  promo: data => dispatch(promo(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Promo);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
    color: colors.theme_fg_two,
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: font_title,
  },
  promo_block: {
    width: '100%',
    padding: 20,
    backgroundColor: colors.theme_bg_three,
    marginTop: 10,
  },
  promo_code: {
    borderWidth: 1,
    borderColor: colors.promo_color,
    color: colors.promo_color,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    fontFamily: font_description,
  },
  apply: {
    fontSize: 14,
    fontFamily: font_title,
    color: colors.theme_fg,
  },
  promo_name: {
    fontSize: 15,
    fontFamily: font_title,
    color: colors.theme_fg_two,
    marginTop: 10,
  },
  description: {
    fontSize: 12,
    marginTop: 5,
    fontFamily: font_description,
  },
  input: {
    height: 40,
    width: '80%',
    marginTop: 10,
    fontFamily: font_description,
  },
  text_input: {
    borderColor: colors.theme_bg,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontFamily: font_description,
  },
});
