import { Component, signal } from '@angular/core';
import { ConverterComponent } from './converter.component';

@Component({
    selector: 'app-shell-converter',
    standalone: true,
    imports: [ConverterComponent],
    template: `<div class="converter">
<app-converter></app-converter>
    </div>`,
    styles: [
        `
        .converter{
            display: flex;
            flex-direction: row;
        }
        `
    ]
})
export class ShellConverterComponent {

}
