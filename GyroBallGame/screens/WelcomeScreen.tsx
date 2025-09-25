// screens/WelcomeScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Welcome: undefined;
  Game: undefined;
};

import * as Animatable from 'react-native-animatable';
import { Audio } from 'expo-av';

export default function WelcomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Welcome'>>();
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/welcome-music.mp3') // reemplazá con tu archivo
      );
      soundRef.current = sound;
      await sound.playAsync();
    };

    loadSound();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="fadeInDown"
        duration={1500}
        source={require('../assets/welcome.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Animatable.Text animation="fadeInUp" delay={500} style={styles.title}>
        Bienvenido a GyroBall
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={1000}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Game')}>
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});