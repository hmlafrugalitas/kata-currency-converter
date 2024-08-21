export interface ConvertionRequest {
    source: Currencies;
    sourceAmount: number;
    target: Currencies;
    targetAmount: number;
    rate: number;
}



export enum Currencies {
    EUR = 'Eur',
    USD = 'Usd'
}