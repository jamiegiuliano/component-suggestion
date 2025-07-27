import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ComponentCategory, ComponentData, ComponentObject, DialogRow } from '../../Component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-dialog-container',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './dialog-container.component.html',
  styleUrl: './dialog-container.component.css'
})
export class DialogContainerComponent {
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
        keywords: [ "inline", "message" ],
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

  getComponent(userInputKeywords: string[]): ComponentObject[] {
    var matchingComponentKeywords = userInputKeywords.filter(keyword => Object.keys(this.componentData).includes(keyword))
    if (matchingComponentKeywords.length === 0) { return [] }

    let filteredKeywords = matchingComponentKeywords.filter(keyword => this.componentData[keyword] !== undefined)
    let matchingComponentGroups: ComponentCategory[] = filteredKeywords.map(keyword => {
      return this.componentData[keyword]
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
