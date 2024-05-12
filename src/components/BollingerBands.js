import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { calculateBollingerBands1 } from '../components/FinanceApi'; 
const FinancialModeling = () => {
  const datasets = {
    set1: [220, 222, 218, 221, 223, 225, 227, 229, 230, 228, 227, 225, 230, 232, 234, 236, 238, 240, 242, 243],
    set2: [243, 242, 240, 238, 236, 234, 232, 230, 229, 227, 225, 223, 221, 220, 218, 222, 224, 226, 228, 230]
  };

  const [selectedDataset, setSelectedDataset] = useState('set1');
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (datasets[selectedDataset]) {
      const prices = datasets[selectedDataset];
      const { sma, upperBand, lowerBand } = calculateBollingerBands1(prices);
      setChartData({
        labels: prices.map((_, index) => `Day ${index + 1}`),
        datasets: [
          { label: 'Prices', data: prices, borderColor: 'blue', fill: false },
          { label: 'SMA', data: sma, borderColor: 'green', fill: false },
          { label: 'Upper Band', data: upperBand, borderColor: 'red', fill: false },
          { label: 'Lower Band', data: lowerBand, borderColor: 'red', fill: false }
        ]
      });
    }
  }, [selectedDataset]);

  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
  };

  const calculateBollingerBands = (prices) => {
    let sma = [];
    let upperBand = [];
    let lowerBand = [];
    let sum = 0;
    const period = 20;

    for (let i = 0; i < prices.length; i++) {
      sum += prices[i];
      if (i >= period - 1) {
        const mean = sum / period;
        const variance = prices.slice(i + 1 - period, i + 1).reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
        const stdDev = Math.sqrt(variance);

        sma.push(mean);
        upperBand.push(mean + 2 * stdDev);
        lowerBand.push(mean - 2 * stdDev);
        sum -= prices[i + 1 - period];
      } else {
        // Ensure arrays are initialized to the same length as prices with nulls for Chart.js compatibility
        sma.push(null);
        upperBand.push(null);
        lowerBand.push(null);
      }
    }
    return { sma, upperBand, lowerBand };
  };

  return (
    <div>
      <h2>Select Dataset:</h2>
      <select value={selectedDataset} onChange={handleDatasetChange}>
        <option value="set1">Dataset 1</option>
        <option value="set2">Dataset 2</option>
      </select>
      <div>
        <h3>Chart:</h3>
        {chartData.datasets?.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>No data available to display.</p>
        )}
      </div>
    </div>
  );
};

export default FinancialModeling;





  
  