import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NovaLibModule } from '@visa/nova-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NovaLibModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'component-suggestion';
}
