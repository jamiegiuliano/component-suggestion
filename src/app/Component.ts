export interface ComponentVariant {
  label: string;
  keywords: string[];
  html: string;
  overlap: number;
}

export interface ComponentCategory {
  [variantName: string]: ComponentVariant;
}

export interface ComponentData {
  [categoryName: string]: ComponentCategory;
}

export interface DialogRow {
    userInput: string,
    apiResponse: ComponentVariant[]
}

export class ComponentObject implements ComponentVariant {
    label: string;
    keywords: string[];
    html: string;
    overlap: number;

    constructor(label: string, keywords: string[], html: string, overlap: number) {
        this.label = label;
        this.keywords = keywords;
        this.html = html;
        this.overlap;
    }
}