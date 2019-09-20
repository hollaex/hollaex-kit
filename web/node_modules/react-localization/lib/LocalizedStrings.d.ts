declare module 'react-localization' {
    type Formatted = number | string | JSX.Element;
    type FormatObject<U extends Formatted> = { [key: string]: U };
    
    export interface GlobalStrings<T> {
      [language: string]: T;
    }
    
    export interface LocalizedStringsMethods {
        setLanguage(language: string): void;
        getLanguage(): string;
        getInterfaceLanguage(): string;
        formatString<T extends Formatted>(str: string, ...values: Array<T | FormatObject<T>>): Array<string | T>;
        getAvailableLanguages(): string[];
        getString(key: string, language: string): string;
        setContent(props: any): void;
    }

    export type LocalizedStrings<T> = LocalizedStringsMethods & T;
  
    interface LocalizedStringsFactory {
        new <T>(props: GlobalStrings<T>): LocalizedStrings<T>;
    }
  
    var LocalizedStrings: LocalizedStringsFactory;
    export default LocalizedStrings;
  }
