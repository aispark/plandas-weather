import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Loading from './Loading';
import * as Location from 'expo-location';
import axios from 'axios'
import Weather from './Weather';

const API_KEY = 'fe79e41f4446e1bf30ddbf7bb5bca9a3';

export default class extends React.Component {
  state = {
    isLoading: true
  };
  getWeather = async(latitude, longitude) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`;
    const { 
      data: {
        main: {temp},
        weather
      }
    } = await axios.get(url);
    this.setState({ 
      isLoading: false, 
      temp: temp, 
      condition: weather[0].main
    });
  }
  getLocation = async() => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
      this.setState({ isLoading: true });
    } catch (error) {
      console.log(error);
      Alert.alert('위치를 찾을 수 없습니다.', '권한을 허용해 주세요.');
    }
  }
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? <Loading /> : <Weather temp={Math.round(temp)} condition={condition}/>;
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center'
  },
  yellowView: {
    flex: 1,
    backgroundColor: 'yellow'
  },
  blueView: {
    flex: 1,
    backgroundColor: 'blue'
  }
});
