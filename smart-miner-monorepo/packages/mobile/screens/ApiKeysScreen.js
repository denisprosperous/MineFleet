import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, TextInput, Button, Paragraph } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

const ApiKeysScreen = () => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openAiApiKey, setOpenAiApiKey] = useState('');
  const [status, setStatus] = useState('');

  const saveApiKey = async (key, value) => {
    if (value) {
      await SecureStore.setItemAsync(key, value);
      setStatus(`${key} API Key saved successfully!`);
    } else {
      setStatus(`Please enter a value for the ${key} API Key.`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>AI API Keys</Title>
          <Paragraph style={styles.paragraph}>
            Enter your API keys for different AI providers to enable smart recommendations.
          </Paragraph>

          <TextInput
            label="Google Gemini API Key"
            value={geminiApiKey}
            onChangeText={setGeminiApiKey}
            style={styles.input}
            secureTextEntry
          />
          <Button mode="contained" onPress={() => saveApiKey('geminiApiKey', geminiApiKey)} style={styles.button}>
            Save Gemini Key
          </Button>

          <TextInput
            label="OpenAI API Key"
            value={openAiApiKey}
            onChangeText={setOpenAiApiKey}
            style={styles.input}
            secureTextEntry
          />
          <Button mode="contained" onPress={() => saveApiKey('openAiApiKey', openAiApiKey)} style={styles.button}>
            Save OpenAI Key
          </Button>

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
  paragraph: {
    color: '#D1D5DB',
    marginBottom: 16,
  },
  input: {
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

export default ApiKeysScreen;
