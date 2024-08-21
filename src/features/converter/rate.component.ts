import { Component, OnDestroy, signal } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ConverterService } from './converter.service';
import { ConvertionRequest } from './model';
import { AsyncPipe, CommonModule, DecimalPipe, NgIf } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-rate',
    standalone: true,
    imports: [AsyncPipe, DecimalPipe, NgIf, MatIconModule, MatButtonModule],
    template: `
    <ng-container *ngIf="request$ | async as request">
    <div class="rate">
        <div><label>Rate : </label><span class="rate_value">{{ request.rate | number:'1.0-2' }}</span>
        <button *ngIf="!isCustomRate" mat-icon-button (click)="toggleCustomrRate()">
        <mat-icon>edit</mat-icon>
      </button> </div>
    </div>
    </ng-container>
   `,
    styles: [`
    .rate{
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 0.5rem;
        &_value{
            font-size: 1.2rem;
            font-weight: 700;
        }
    }

    `]
})
export class RateComponent implements OnDestroy {
    request$: Observable<ConvertionRequest> | null = null;
    isCustomRate = false;
    private destroy$ = new Subject<void>();
    constructor(private service: ConverterService) {
        this.request$ = this.service.request$$;
        this.service.isCustomRate$$.pipe(map(status => this.isCustomRate = status), takeUntil(this.destroy$)).subscribe()
    }

    toggleCustomrRate() {
        console.log('activate custom rate')
    }

    ngOnDestroy(): void {
        this.destroy$.complete();
        this.destroy$.unsubscribe();
    }
}
