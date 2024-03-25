export interface NepsePortfolio {
    stockId: number;
    scripName: string;
    currentBalance: number;
    previousClosingPrice: number;
    valuesAsOfPreviousClosing: number;
    LTP: number;
    valueAsOfLTP: number;
    username: string,
    userId: string
}