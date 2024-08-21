import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConvertionRequest, Currencies } from './model';
import { ConverterService } from './converter.service';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RateComponent } from './rate.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
@Component({
    selector: 'app-converter',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCardModule, MatButtonModule, ReactiveFormsModule, RateComponent, MatButtonToggleModule],
    template: `
   <mat-card>
  <mat-card-content>
    <ng-container *ngIf="request$ | async as request">
      <div class="converter">
        <div class="converter_section">
        <mat-button-toggle-group [formControl]="currencySelectorCtrl" style="width: fit-content;">
            <mat-button-toggle value="{{currencyEnum.EUR}}">EUR</mat-button-toggle>
            <mat-button-toggle value="{{currencyEnum.USD}}">USD</mat-button-toggle>
        </mat-button-toggle-group>
          <span class="converter_section_currency">
            {{ request.source }}
        </span>
          <mat-form-field>
            <input #sourceValue type="number" matInput [value]="request.sourceAmount">
          </mat-form-field>
        </div>

        <mat-icon>arrow_forward</mat-icon>
        <div class="converter_section">
          <span class="converter_section_currency">{{ request.target }}</span>
          <span class="converter_section_amount">{{ request.targetAmount | number:'1.0-2' }}</span>
        </div>
      </div>

      <button mat-raised-button (click)="convert(sourceValue.value)">Convert</button>
    <app-rate></app-rate>
    </ng-container>
  </mat-card-content>
</mat-card>

    `,
    styles: [
        `
        :host{
            width: 100%;
        }
        .converter{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            flex-grow: 1;
            &_section{
                width: 33%;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                &_currency{
                    font-size: 1.2rem;
                    font-style: bold;
                }
                &_amount{
                    font-size: 1.4rem;
                    font-style: bold;
                }
            }
        }
        `
    ]
})
export class ConverterComponent implements OnInit, OnDestroy {

    currencyEnum = Currencies;
    selectedCurrency: Currencies = Currencies.EUR;
    request$: Observable<ConvertionRequest> | null = null;
    currencySelectorCtrl = new FormControl('');

    private destroy$ = new Subject<void>();
    constructor(private service: ConverterService) {
        this.request$ = this.service.request$$;
        this.request$.pipe(map(request => {
            this.selectedCurrency = request.source;
            this.currencySelectorCtrl.setValue(request.source);

        }),
            takeUntil(this.destroy$)
        ).subscribe()
    }
    ngOnInit(): void {
        this.currencySelectorCtrl.valueChanges.pipe(map((currencyToUpdate) => {
            if (currencyToUpdate != this.selectedCurrency) {
                this.service.switchCurrency(currencyToUpdate as Currencies);
            }
            console.log('cur', currencyToUpdate);
        })).subscribe()
    }

    convert(amount: string): void {
        const numAmount = Number(amount);
        if (numAmount) {
            this.service.convert(numAmount);
        } else {
            throw new Error('Invalid amount for conversion');
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
