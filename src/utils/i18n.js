import I18n from "i18n-js";
import * as RNLocalize from "react-native-localize";

import es from "../locales/es";
import en from '../locales/en';
import fr from "../locales/en";
import it from "../locales/en";
import ja from "../locales/en";
import ru from "../locales/en";
import pt from "../locales/en";
import de from "../locales/en";
import zh from "../locales/en";

const locales = RNLocalize.getLocales();

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag;
}

I18n.fallbacks = true;
I18n.translations = {
  es,
  en,
  fr,
  it,
  ja,
  ru,
  pt,
  de,
  zh
};

export default I18n;