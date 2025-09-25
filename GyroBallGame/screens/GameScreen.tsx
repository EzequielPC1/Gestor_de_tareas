import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'expo-sensors';

const AREA_SIZE = 320;
const BALL_SIZE = 48;
const SENSITIVITY = 15;

export default function GameScreen() {
  const [position, setPosition] = useState({ x: AREA_SIZE / 2, y: AREA_SIZE / 2 });
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [lost, setLost] = useState(false);

  useEffect(() => {
    Gyroscope.setUpdateInterval(50);
    const subscription = Gyroscope.addListener(({ x, y, z }) => {
      setGyroData({ x, y, z });

      if (!lost) {
        setPosition(prev => {
          const newX = prev.x + y * SENSITIVITY;
          const newY = prev.y + x * SENSITIVITY;

          const outOfBounds =
            newX < 0 || newX > AREA_SIZE - BALL_SIZE || newY < 0 || newY > AREA_SIZE - BALL_SIZE;

          if (outOfBounds) {
            setLost(true);
            return prev;
          }

          return { x: newX, y: newY };
        });
      }
    });

    return () => subscription.remove();
  }, [lost]);

  const resetGame = () => {
    setPosition({ x: AREA_SIZE / 2, y: AREA_SIZE / 2 });
    setLost(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giroscopio</Text>
      <Text style={styles.data}>
        x: {gyroData.x.toFixed(2)} | y: {gyroData.y.toFixed(2)} | z: {gyroData.z.toFixed(2)}
      </Text>

      <View style={styles.area}>
        <View
          style={[
            styles.ball,
            { left: position.x, top: position.y },
          ]}
        />
      </View>

      {lost && (
        <>
          <Text style={styles.lostText}>¡Perdiste!</Text>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Reiniciar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E3', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  data: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  area: {
    width: AREA_SIZE,
    height: AREA_SIZE,
    borderWidth: 4,
    borderColor: '#000',
    backgroundColor: '#DCEFEF', 
    position: 'relative',
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: '#FF6F61', 
    borderWidth: 3,
    borderColor: '#000',
    position: 'absolute',
  },
  lostText: {
    fontSize: 20,
    color: '#D7263D',
    marginTop: 20,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});