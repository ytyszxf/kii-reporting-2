export interface IKRTextStyle {
  color?: string; // #000000
  fontStyle?: 'normal' | 'italic' | 'oblique'; // default: normal
  fontWeight?: 'normal' | 'bold' | 'border' | 'lighter'; // default: normal
  fontFamilty?: string; // default: 'sans-serif'
  fontSize?: number; // default: 12
}