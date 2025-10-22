import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import ReferralService from '../services/ReferralService';

const ReferralsScreen = () => {
  const [referralCode, setReferralCode] = useState('');
  const [referrer, setReferrer] = useState('');
  const [referralTree, setReferralTree] = useState({});

  useEffect(() => {
    const loadReferralData = async () => {
      setReferralCode(await ReferralService.getOrCreateReferralCode());
      setReferrer(await ReferralService.getReferrer());
      setReferralTree(await ReferralService.getReferralTree());
    };
    loadReferralData();
  }, []);

  const handleSetReferrer = () => {
    ReferralService.setReferrer(referrer);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Your Referral Code</Title>
          <Paragraph style={styles.paragraph}>{referralCode}</Paragraph>
          <Button mode="contained" onPress={() => {}} style={styles.button}>
            Share Code
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Enter Referrer Code</Title>
          <TextInput
            label="Referrer Code"
            value={referrer}
            onChangeText={setReferrer}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleSetReferrer} style={styles.button}>
            Set Referrer
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Referral Tree</Title>
          <Paragraph style={styles.paragraph}>
            {JSON.stringify(referralTree, null, 2)}
          </Paragraph>
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
  button: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default ReferralsScreen;
