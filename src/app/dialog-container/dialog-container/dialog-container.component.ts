import { Component, OnInit } from '@angular/core';
import { KeyValuePipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ComponentCategory, ComponentData, ComponentObject, DialogRow } from '../../Component';
import { NovaLibModule } from '@visa/nova-angular';
import { VisaCopyTiny } from "@visa/nova-icons-angular";
import { NgFor } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-container',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    KeyValuePipe,
    CommonModule,
    NovaLibModule,
    VisaCopyTiny,
    HttpClientModule
  ],
  templateUrl: './dialog-container.component.html',
  styleUrl: './dialog-container.component.css'
})
export class DialogContainerComponent implements OnInit {
  componentData: ComponentData = {}
  dialogCollection: any[] = [];

  myForm: FormGroup;

  constructor(private http: HttpClient) {
  this.myForm = new FormGroup({
      userInput: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.getAllComponents().subscribe({
      next: (value) => {
        this.componentData = value;
      },
      error: (err) => {
        console.error('An error occurred:', err);
      },
      complete: () => {
        console.log('Observable completed.');
      }
    });
  };

  getAllComponents(): Observable<ComponentData> {
    return this.http.get<ComponentData>('assets/data/components.json');
  }

  getComponent(userInputKeywords: string[]): ComponentObject[] {
    var matchingComponentKeywords = userInputKeywords.filter(keyword => Object.keys(this.componentData).includes(keyword))
    if (matchingComponentKeywords.length === 0) { return [] }

    let filteredKeywords = matchingComponentKeywords.filter(categoryName => this.componentData[categoryName] !== undefined)
    let matchingComponentGroups: ComponentCategory[] = filteredKeywords.map(variantName => {
      return this.componentData[variantName]
    })

    return this.filterComponents(userInputKeywords, matchingComponentGroups)
  };

    // Update this to collect how many keywords matched.
    // If none have a keyword count match (0), return all 
    // If all matching have a keyword count match of 1, return all
    // If any components have a keyword count match over 1, return all greater than 1
    filterComponents(userInputKeywords: string[], matchingComponentGroups: ComponentCategory[]): ComponentObject[] {
      var componentVariantGroups = matchingComponentGroups.map(group => Object.values(group))
  
      return componentVariantGroups.flatMap(componentVariantArray => {
        var componentVariantObjectArray = componentVariantArray.map(compVar => compVar as ComponentObject)
        let componentOverlaps = componentVariantObjectArray.map(component => {
          const overlap = userInputKeywords.length + component.keywords.length - new Set(userInputKeywords.concat(component.keywords)).size;
  
          component.overlap = overlap
          return overlap
        })
  
        var overlapTotal = componentOverlaps.reduce((accumulator, currentValue) => (accumulator + currentValue))
        var allOverlapsTheSame = componentOverlaps.every(overlap => overlap === componentOverlaps[0])
  
        if (overlapTotal == 0 || allOverlapsTheSame) {
          return componentVariantObjectArray
        } else {
          var highestOverlapValue = Math.max(...componentVariantArray.map(o => o.overlap))
  
          return componentVariantObjectArray.filter(component => component.overlap == highestOverlapValue)
        }
      });
    }

  resetForm(): void {
    this.myForm.value.userInput = ''
    this.myForm.reset()
  };

  handleSubmit(): void {
    var latestUserInput = this.myForm.value.userInput
    var userInputKeywords: string[] = latestUserInput.toLowerCase().split(" ")

    const dialogRow: DialogRow = {
        userInput: latestUserInput,
        apiResponse: this.getComponent(userInputKeywords)
    }

    this.dialogCollection.push(dialogRow)
    this.resetForm()
  };

  copyText(html: string): void {
    navigator.clipboard.writeText(html)
      .then(() => {
        console.log('Text copied successfully!');
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  };
}
