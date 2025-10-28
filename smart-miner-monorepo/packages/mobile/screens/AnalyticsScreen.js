import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import DatabaseService from '../services/DatabaseService';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const unsubscribe = DatabaseService.getSessions(data => {
      setSessions(data);
    });
    return () => {
      // In a real app, you might want to unsubscribe from database updates
    };
  }, []);

  const chartData = {
    labels: sessions.map(s => new Date(s.startTime).toLocaleDateString()),
    datasets: [
      {
        data: sessions.map(s => s.earnings),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Earnings History</Title>
          <BarChart
            data={chartData}
            width={screenWidth - 64}
            height={220}
            yAxisLabel="$"
            chartConfig={chartConfig}
            verticalLabelRotation={30}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#1E3A8A',
  backgroundGradientFrom: '#1E3A8A',
  backgroundGradientTo: '#10B981',
  decimalPlaces: 4,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
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
    textAlign: 'center',
  },
});

export default AnalyticsScreen;
