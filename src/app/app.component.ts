import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogContainerComponent } from './dialog-container/dialog-container/dialog-container.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DialogContainerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'component-suggestion';
}
