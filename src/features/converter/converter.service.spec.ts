import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ConverterService } from './converter.service';
import { Currencies, ConvertionRequest } from './model';

describe('ConverterService', () => {
    let service: ConverterService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ConverterService]
        });
        service = TestBed.inject(ConverterService);
    });

    afterEach(() => {
        service.ngOnDestroy(); // Ensure cleanup after each test
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have initial state for request$$', (done) => {
        const expectedInitialRequest: ConvertionRequest = {
            rate: 1.05,
            source: Currencies.EUR,
            sourceAmount: 0,
            target: Currencies.USD,
            targetAmount: 0,
        };

        service.request$$.subscribe(request => {
            expect(request).toEqual(expectedInitialRequest);
            done();
        });
    });

    it('should update targetAmount when convert is called with a positive amount', (done) => {
        const amountToConvert = 100;
        const expectedTargetAmount = 105; // 100 * 1.05

        service.convert(amountToConvert);

        service.request$$.subscribe(request => {
            expect(request.sourceAmount).toBe(amountToConvert);
            expect(request.targetAmount).toBe(expectedTargetAmount);
            done();
        });
    });

    it('should throw an error when convert is called with zero amount', () => {
        expect(() => service.convert(0)).toThrowError('Amount to convert should be greater than 0');
    });

    it('should throw an error when convert is called with a negative amount', () => {
        expect(() => service.convert(-100)).toThrowError('Amount to convert should be greater than 0');
    });

    it('should switch currencies and update the conversion values', (done) => {
        service.convert(100);

        service.switchCurrency(Currencies.USD);

        service.request$$.subscribe(request => {
            expect(request.source).toBe(Currencies.USD);
            expect(request.target).toBe(Currencies.EUR);
            expect(request.rate).toBeCloseTo(1 / 1.05, 2); // Inverted rate
            expect(request.sourceAmount).toBe(105); // Previous targetAmount becomes new sourceAmount
            expect(request.targetAmount).toBeCloseTo(100, 2); // New targetAmount after conversion
            done();
        });
    });


    it('should clean up the interval when service is destroyed', () => {
        const completeSpy = spyOn(service['destroy$'], 'complete').and.callThrough();

        service.ngOnDestroy();

        expect(completeSpy).toHaveBeenCalled();
        expect(service['destroy$'].isStopped).toBe(true);
    });

    it('should not update rate if custom rate is set', fakeAsync(() => {
        service['isCustomRate$'].next(true);

        tick(3000); // Simulate 3 seconds passing

        const currentRate = service['request$'].value.rate;

        service.request$$.subscribe(request => {
            expect(request.rate).toBe(currentRate); // Rate should not change if custom rate is set
        });
    }));

    it('should allow switching to custom rate', (done) => {
        service['isCustomRate$'].next(true);

        const customRate = 1.25;
        service['request$'].next({ ...service['request$'].value, rate: customRate });

        service.request$$.subscribe(request => {
            expect(request.rate).toBe(customRate); // Custom rate should be applied
            done();
        });
    });
});
