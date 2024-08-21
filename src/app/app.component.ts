import { Component, signal } from '@angular/core';
import { ShellConverterComponent } from '../features/converter/shell-converter.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellConverterComponent],
  template: '<app-shell-converter></app-shell-converter>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
