import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, map, Observable, Subject, takeUntil } from 'rxjs';
import { ConvertionRequest, Currencies } from './model';

@Injectable({
    providedIn: 'root'
})
export class ConverterService implements OnDestroy {

    private request$ = new BehaviorSubject<ConvertionRequest>({
        rate: 1.05,
        source: Currencies.EUR,
        sourceAmount: 0,
        target: Currencies.USD,
        targetAmount: 0
    });

    private isCustomRate$ = new BehaviorSubject<boolean>(false);

    private destroy$ = new Subject<void>();

    public get request$$(): Observable<ConvertionRequest> {
        return this.request$.asObservable();
    }
    public get isCustomRate$$(): Observable<boolean> { return this.isCustomRate$.asObservable(); }

    constructor() {
        this.startAutoUpdatingRate();
    }

    convert(amount: number) {
        if (amount <= 0) {
            throw new Error('Amount to convert should be greater than 0');
        }
        this.updateRequest({ ...this.request$.value, sourceAmount: amount });
    }

    switchCurrency(currencyToUpdate: Currencies) {
        const currentRequest = this.request$.value;

        // Switch the currencies
        const updatedRequest: ConvertionRequest = {
            ...currentRequest,
            target: currentRequest.source,
            source: currencyToUpdate,
            rate: 1 / currentRequest.rate, // Assume inverse rate for simplicity
            sourceAmount: currentRequest.targetAmount,
            targetAmount: currentRequest.sourceAmount
        };

        this.updateRequest(updatedRequest);
    }


    private startAutoUpdatingRate() {
        interval(3000)
            .pipe(
                map(() => this.calculateNewRate()),
                takeUntil(this.destroy$)
            )
            .subscribe(newRate => {
                this.updateRequest({ ...this.request$.value, rate: newRate });
            });
    }

    private calculateNewRate(): number {
        const randomChange = (Math.random() * 0.1) - 0.05; // Random value between -0.05 and +0.05
        const currentRate = this.request$.value.rate;
        return parseFloat((currentRate + randomChange).toFixed(2));
    }

    private updateRequest(updatedRequest: ConvertionRequest) {
        this.request$.next({
            ...updatedRequest,
            targetAmount: updatedRequest.rate * updatedRequest.sourceAmount
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
