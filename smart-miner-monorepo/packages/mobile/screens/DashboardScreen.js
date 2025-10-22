import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, SegmentedButtons } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import MiningService from '../services/MiningService';
import PoolService from '../services/PoolService';
import WalletService from '../services/WalletService';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const [hashrate, setHashrate] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [chartData, setChartData] = useState([0]);
  const [poolStatus, setPoolStatus] = useState('Disconnected');
  const [wallet, setWallet] = useState(null);
  const [miningMode, setMiningMode] = useState('cpu');

  useEffect(() => {
    const loadWallet = async () => {
      const existingWallet = await WalletService.getWallet();
      if (existingWallet) {
        setWallet(existingWallet);
      }
    };
    loadWallet();
  }, []);

  useEffect(() => {
    const miningSubscription = MiningService.subscribe(({ hashrate, earnings }) => {
      setHashrate(hashrate);
      setEarnings(earnings);
      setChartData(prevData => [...prevData.slice(-6), hashrate]);
    });

    const statusSubscription = PoolService.subscribe('status', data => {
      setPoolStatus(data.status);
    });

    return () => {
      miningSubscription();
      statusSubscription.remove();
    };
  }, []);

  const handleStartMining = () => {
    if (wallet) {
      PoolService.connect(wallet.address);
      const job = PoolService.getCurrentJob();
      if (job) {
        if (miningMode === 'cpu') {
          MiningService.start(job.blob);
        } else {
          MiningService.startGpuMining(job.blob);
        }
      }
    }
  };

  const handleStopMining = () => {
    MiningService.stop();
    PoolService.disconnect();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Live Stats</Title>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Paragraph style={styles.statLabel}>Hashrate</Paragraph>
              <Paragraph style={styles.statValue}>{hashrate} H/s</Paragraph>
            </View>
            <View style={styles.stat}>
              <Paragraph style={styles.statLabel}>Earnings</Paragraph>
              <Paragraph style={styles.statValue}>{earnings.toFixed(6)}</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <SegmentedButtons
        value={miningMode}
        onValueChange={setMiningMode}
        buttons={[
          {
            value: 'cpu',
            label: 'CPU',
          },
          {
            value: 'gpu',
            label: 'GPU (Simulated)',
          },
        ]}
        style={styles.segmentedButtons}
      />

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Pool Status</Title>
          <Paragraph style={styles.paragraph}>{poolStatus}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Hashrate History</Title>
          <LineChart
            data={{
              labels: ['-10s', '-8s', '-6s', '-4s', '-2s', 'Now'],
              datasets: [
                {
                  data: chartData,
                },
              ],
            }}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleStartMining} style={styles.button}>
          Start Mining
        </Button>
        <Button mode="outlined" onPress={handleStopMining} style={styles.button}>
          Stop Mining
        </Button>
      </View>
    </ScrollView>
  );
};

const chartConfig = {
    backgroundColor: '#1E3A8A',
    backgroundGradientFrom: '#1E3A8A',
    backgroundGradientTo: '#10B981',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#10B981',
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
    },
    paragraph: {
      color: '#D1D5DB',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    stat: {
      alignItems: 'center',
    },
    statLabel: {
      color: '#D1D5DB',
      fontSize: 14,
    },
    statValue: {
      color: '#F3F4F6',
      fontSize: 18,
      fontWeight: 'bold',
    },
    chart: {
      marginVertical: 8,
      borderRadius: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
      marginBottom: 32,
    },
    button: {
      flex: 1,
      marginHorizontal: 8,
    },
    segmentedButtons: {
      marginBottom: 16,
    },
  });

export default DashboardScreen;
