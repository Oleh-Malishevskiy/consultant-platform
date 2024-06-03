// src/components/FinanceApi.js

export const calculateBollingerBands1 = (prices, period = 20) => {
    let sma = Array(period - 1).fill(null); // Start with nulls for the initial period where the SMA can't be calculated
    let upperBand = Array(period - 1).fill(null);
    let lowerBand = Array(period - 1).fill(null);
    let sum = prices.slice(0, period).reduce((a, b) => a + b, 0);

    for (let i = period; i < prices.length; i++) {
        const mean = sum / period;
        const stdDev = Math.sqrt(prices.slice(i - period, i).reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period);

        sma.push(mean);
        upperBand.push(mean + 2 * stdDev);
        lowerBand.push(mean - 2 * stdDev);

        sum = sum - prices[i - period] + prices[i];
    }

    return { prices, sma, upperBand, lowerBand };
};
  
  

