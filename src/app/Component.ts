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