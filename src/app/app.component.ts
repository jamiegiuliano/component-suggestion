import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NovaLibModule } from '@visa/nova-angular';
import { ComponentCategory, ComponentData, ComponentVariant } from './Component';

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

  // knownKeywords: { [key: string]: string[] } = {
  //   components: [ "button" ],
  //   keywords: ["primary", "secondary", "leading", "trailing", "disabled", "text", "icon" ]
  // }

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
    }
  };

  getComponent(userInputKeywords: string[]): void {
    var matchingComponentKeyword = userInputKeywords.find(keyword => Object.keys(this.componentData).includes(keyword)) ?? ""
    
    if(this.componentData[matchingComponentKeyword] !== undefined) {
      let matchingComponentGroup: ComponentCategory = this.componentData[matchingComponentKeyword]
      let returnComponents = this.filterComponents(userInputKeywords, matchingComponentGroup)

      console.log(returnComponents.map(component => component.label))
      console.log(returnComponents.map(component => component.html))
    }
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

  handleSubmit(userInput: HTMLTextAreaElement): void {
    var userInputKeywords: string[] = userInput.value.toLowerCase().split(" ")
    
    this.getComponent(userInputKeywords)
    // console.log(Object.values(this.componentData[userInputKeywords]).map(component => component.label ))
    // console.log(Object.values(this.componentData[userInputKeywords]).map(component => component.html ))
  };
}
