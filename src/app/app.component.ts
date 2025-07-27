import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NovaLibModule } from '@visa/nova-angular';
import { KeyValuePipe, CommonModule } from '@angular/common';
import { VisaCopyTiny } from "@visa/nova-icons-angular";
import { DialogContainerComponent } from './dialog-container/dialog-container/dialog-container.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NovaLibModule,
    KeyValuePipe,
    VisaCopyTiny,
    CommonModule,
    DialogContainerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'component-suggestion';
}
