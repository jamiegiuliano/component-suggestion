import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NovaLibModule } from '@visa/nova-angular';
import { ComponentCategory, ComponentData, ComponentVariant, DialogRow } from './Component';
import { NgFor } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { KeyValuePipe, CommonModule } from '@angular/common';
import { VisaCopyTiny } from "@visa/nova-icons-angular"; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NovaLibModule,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    KeyValuePipe,
    VisaCopyTiny,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'component-suggestion';

  suggestedComponents: any[] = [];
  userInputsCollection: any[] = [];

  dialogCollection: any[] = [];


  myForm: FormGroup;

  constructor() {
  this.myForm = new FormGroup({
      userInput: new FormControl('')
    });
  }

  // Dictionary of component Data
  componentData: ComponentData = {
    button: {
      "primary-text-button": {
        label: "Primary Text Button",
        keywords: [ "primary", "text" ],
        html: "<button v-button>Primary action</button>",
        overlap: 0
      },
      "primary-text-button-with-leading-icon": {
        label: "Primary Text Button with Leading Icon",
        keywords: [ "primary", "text", "leading", "icon" ],
        html: "<button v-button v-icon-two-color><svg v-icon-visa-file-upload-tiny></svg>Primary action</button>",
        overlap: 0
      },
      "primary-text-button-with-trailing-icon": {
        label: "Primary Text Button with Trailing Icon",
        keywords: [ "primary", "text", "trailing", "icon" ],
        html: "<button v-button v-icon-two-color>Primary action<svg v-icon-visa-file-upload-tiny></svg></button>",
        overlap: 0
      }
    },
    input: {
      "default-input": {
        label: "Default input",
        keywords: [ "standard", "plain", "simple", "default" ],
        html: `<div vFlex vGap="4" vFlexCol>
  <label v-label for="default-input-single-line">Label (required)</label>
  <div v-input-container>
    <input v-input required id="default-input-single-line" />
  </div>
</div>`,
        overlap: 0
      },
      "input-with-inline-message": {
        label: "Input with Inline Message",
        keywords: [ "inline message" ],
        html: `<div vFlex vGap="4" vFlexCol>
  <label v-label for="inline-message-input">Label (required)</label>
  <div v-input-container>
    <input v-input required id="inline-message-input" aria-describedby="inline-message" />
  </div>
  <span v-input-message id="inline-message">This is optional text that describes the label in more detail.</span>
</div>`,
       overlap: 0
      }
    }
  };

  getComponent(userInputKeywords: string[]): ComponentVariant[] {
    var keywords = userInputKeywords.map(keyword => {
      if (Object.keys(this.componentData).includes(keyword)) {
        return keyword
      }
    })
    console.log(keywords)
    var matchingComponentKeyword = userInputKeywords.find(keyword => Object.keys(this.componentData).includes(keyword)) ?? ""

    if (this.componentData[matchingComponentKeyword] === undefined) { return [] }
    let matchingComponentGroup: ComponentCategory = this.componentData[matchingComponentKeyword]
    return this.filterComponents(userInputKeywords, matchingComponentGroup)
  };

  // Update this to collect how many keywords matched.
  // If none have a keyword count match (0), return all 
  // If all matching have a keyword count match of 1, return all
  // If any components have a keyword count match over 1, return all greater than 1
  filterComponents(userInputKeywords: string[], matchingComponentGroup: ComponentCategory): ComponentVariant[] {
    var componentVariants = Object.values(matchingComponentGroup)
    var componentOverlaps = componentVariants.map(component => {
      const overlap = userInputKeywords.length + component.keywords.length - new Set(userInputKeywords.concat(component.keywords)).size;

      component.overlap = overlap
      return overlap
    })

    var overlapTotal = componentOverlaps.reduce((accumulator, currentValue) => (accumulator + currentValue))
    var allOverlapsTheSame = componentOverlaps.every(overlap => overlap === componentOverlaps[0])

    if (overlapTotal == 0 || allOverlapsTheSame) {
      return componentVariants
    } else {
      var highestOverlapValue = Math.max(...componentVariants.map(o => o.overlap))

      return componentVariants.filter(component => component.overlap == highestOverlapValue)
    }
  }

  resetForm(): void {
    this.myForm.value.userInput = ''
    this.myForm.reset()
  }

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
  }
}
