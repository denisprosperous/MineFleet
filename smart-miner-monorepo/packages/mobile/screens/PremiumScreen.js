import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import PremiumService from '../services/PremiumService';
import ReferralService from '../services/ReferralService'; // To get dev addresses

const PremiumScreen = () => {
  const [transactionHash, setTransactionHash] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState('');

  React.useEffect(() => {
    const checkPremium = async () => {
      const premium = await PremiumService.isPremium();
      setIsPremium(premium);
    };
    checkPremium();
  }, []);

  const handleUnlockPremium = async () => {
    if (transactionHash) {
      // In a real app, you would verify the transaction hash on a backend.
      // Here, we'll just simulate the unlock.
      await PremiumService.unlockPremium();
      setIsPremium(true);
      setStatus('Premium unlocked successfully!');
    } else {
      setStatus('Please enter a transaction hash.');
    }
  };

  const devAddresses = ReferralService.DEV_ADDRESSES;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Unlock Premium Features</Title>
          <Paragraph style={styles.paragraph}>
            {isPremium
              ? 'You are a premium user! Thank you for your support.'
              : 'Unlock premium features by sending a small payment to one of the addresses below.'}
          </Paragraph>

          {!isPremium && (
            <>
              <Title style={styles.subTitle}>Developer Wallets</Title>
              <Paragraph style={styles.address}>USDT (TRC20): {devAddresses.USDT}</Paragraph>
              <Paragraph style={styles.address}>ETH/BNB (BEP20): {devAddresses.ETH}</Paragraph>
              <Paragraph style={styles.address}>BTC: {devAddresses.BTC}</Paragraph>

              <TextInput
                label="Transaction Hash"
                value={transactionHash}
                onChangeText={setTransactionHash}
                style={styles.input}
              />
              <Button mode="contained" onPress={handleUnlockPremium} style={styles.button}>
                Verify & Unlock
              </Button>
            </>
          )}

          {status ? <Paragraph style={styles.status}>{status}</Paragraph> : null}
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
  subTitle: {
    color: '#F3F4F6',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    color: '#D1D5DB',
    marginBottom: 16,
  },
  address: {
    color: '#D1D5DB',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  input: {
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  status: {
    marginTop: 16,
    color: '#10B981',
    textAlign: 'center',
  },
});

export default PremiumScreen;
