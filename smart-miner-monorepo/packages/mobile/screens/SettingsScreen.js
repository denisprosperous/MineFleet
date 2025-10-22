import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Switch, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import DeviceHealthService from '../services/DeviceHealthService';
import PremiumService from '../services/PremiumService';

const SettingsScreen = () => {
  const [mineOnMobileData, setMineOnMobileData] = useState(DeviceHealthService.mineOnMobileData);
  const [isPremium, setIsPremium] = useState(false);
  const [aggressiveMode, setAggressiveMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkPremium = async () => {
      const premium = await PremiumService.isPremium();
      setIsPremium(premium);
    };
    checkPremium();
  }, []);

  const handleToggleMobileMining = () => {
    const newValue = !mineOnMobileData;
    setMineOnMobileData(newValue);
    DeviceHealthService.setMineOnMobileData(newValue);
  };

  const handleToggleAggressiveMode = () => {
    if (isPremium) {
      setAggressiveMode(!aggressiveMode);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Mining Settings</Title>
          <View style={styles.settingContainer}>
            <Paragraph style={styles.paragraph}>Mine on Mobile Data</Paragraph>
            <Switch value={mineOnMobileData} onValueChange={handleToggleMobileMining} />
          </View>
          <View style={styles.settingContainer}>
            <Paragraph style={styles.paragraph}>Aggressive Mode (Premium)</Paragraph>
            <Switch value={aggressiveMode} onValueChange={handleToggleAggressiveMode} disabled={!isPremium} />
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>AI Settings</Title>
          <Button mode="contained" onPress={() => navigation.navigate('ApiKeys')} style={{marginBottom: 10}}>
            Configure AI API Keys
          </Button>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Premium</Title>
          <Button mode="contained" onPress={() => navigation.navigate('Premium')}>
            Unlock Premium Features
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1F2937',
  },
  cardTitle: {
    color: '#F3F4F6',
    marginBottom: 8,
  },
  paragraph: {
    color: '#D1D5DB',
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SettingsScreen;
