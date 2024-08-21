import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConverterComponent } from './converter.component';
import { ConverterService } from './converter.service';
import { of, Subject } from 'rxjs';
import { Currencies, ConvertionRequest } from './model';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RateComponent } from './rate.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    selector: 'app-rate',
    standalone: true,
    template: `
   
   `,

})
export class RateMockComponent {

}
describe('ConverterComponent (Standalone)', () => {
    let component: ConverterComponent;
    let fixture: ComponentFixture<ConverterComponent>;
    let converterServiceSpy: jasmine.SpyObj<ConverterService>;
    let requestSubject: Subject<ConvertionRequest>;

    beforeEach(async () => {
        requestSubject = new Subject<ConvertionRequest>();
        converterServiceSpy = jasmine.createSpyObj('ConverterService', ['convert', 'switchCurrency'], {
            request$$: requestSubject.asObservable()
        });

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                MatButtonToggleModule,
                MatFormFieldModule,
                MatInputModule,
                MatCardModule,
                MatButtonModule,
                MatIconModule,
                NoopAnimationsModule
            ],
            providers: [
                { provide: ConverterService, useValue: converterServiceSpy }
            ]
        }).overrideComponent(ConverterComponent, {
            remove: { imports: [RateComponent] },
            add: { imports: [RateMockComponent] }
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConverterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct source and target currencies', () => {
        const mockRequest: ConvertionRequest = {
            source: Currencies.EUR,
            target: Currencies.USD,
            sourceAmount: 100,
            targetAmount: 120,
            rate: 1.2
        };

        requestSubject.next(mockRequest);
        fixture.detectChanges();

        const sourceCurrency = fixture.debugElement.query(By.css('.converter_section_currency')).nativeElement;
        const targetCurrency = fixture.debugElement.queryAll(By.css('.converter_section_currency'))[1].nativeElement;
        const targetAmount = fixture.debugElement.query(By.css('.converter_section_amount')).nativeElement;

        expect(sourceCurrency.textContent).toContain('Eur');
        expect(targetCurrency.textContent).toContain('Usd');
        expect(targetAmount.textContent).toContain('120');
    });

    it('should switch currency when the currency toggle is changed', () => {
        const mockRequest: ConvertionRequest = {
            source: Currencies.EUR,
            target: Currencies.USD,
            sourceAmount: 100,
            targetAmount: 120,
            rate: 1.2
        };

        requestSubject.next(mockRequest);
        fixture.detectChanges();

        component.currencySelectorCtrl.setValue(Currencies.USD);
        fixture.detectChanges();

        expect(converterServiceSpy.switchCurrency).toHaveBeenCalledWith(Currencies.USD);
    });

    it('should clean up subscriptions on destroy', () => {
        const destroySpy = spyOn(component['destroy$'], 'next').and.callThrough();
        const completeSpy = spyOn(component['destroy$'], 'complete').and.callThrough();

        component.ngOnDestroy();

        expect(destroySpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
    });
});