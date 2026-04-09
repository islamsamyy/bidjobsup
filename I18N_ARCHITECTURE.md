# i18n Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        app/layout.tsx                           │
│                                                                 │
│  <html>                                                         │
│    <LanguageProvider>    ← Wraps entire app                    │
│      {children}                                                │
│    </LanguageProvider>                                         │
│  </html>                                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│         app/providers/LanguageProvider.tsx                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  LanguageContext                                         │  │
│  │  ├─ locale: 'en' | 'ar'                                 │  │
│  │  ├─ setLocale: (locale) => void                         │  │
│  │  ├─ t: (key: string) => string                          │  │
│  │  └─ dir: 'ltr' | 'rtl'                                  │  │
│  │                                                          │  │
│  │  State Management:                                      │  │
│  │  └─ localStorage.setItem('language', locale)           │  │
│  │  └─ document.documentElement.lang = locale             │  │
│  │  └─ document.documentElement.dir = locale === 'ar'     │  │
│  │                  ? 'rtl' : 'ltr'                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  useLanguage() Hook ← Export this                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
     ┌──────────────────────┐    ┌──────────────────────┐
     │   Translation        │    │   UI Components      │
     │   Files             │    │                      │
     │                      │    │  Any component with  │
     │  locales/           │    │  'useLanguage()'     │
     │  ├─ en.json         │    │                      │
     │  └─ ar.json         │    │  ▼                   │
     │                      │    │                      │
     │  ├─ common          │    │  PublicHeader        │
     │  ├─ navigation      │    │  TestComponent       │
     │  ├─ buttons         │    │  SignUpForm          │
     │  ├─ header          │    │  HomePage            │
     │  └─ home            │    │  etc...              │
     │                      │    │                      │
     └──────────────────────┘    └──────────────────────┘
```

---

## Data Flow: Language Switch

```
1. USER INTERACTION
   │
   └──► LanguageSwitcher button clicked
        └──► onClick={() => { setLocale('ar'); setIsOpen(false); }}

2. STATE UPDATE
   │
   └──► setLocale('ar') called
        └──► Updates LanguageContext state
        └──► Saves to localStorage: 'language' = 'ar'
        └──► Updates DOM:
             ├─ document.documentElement.lang = 'ar'
             └─ document.documentElement.dir = 'rtl'

3. CONTEXT PROPAGATION
   │
   └──► LanguageContext value changes
        └──► All components using useLanguage() hook
             are notified via Context

4. COMPONENT RE-RENDER
   │
   └──► Every component with useLanguage()
        re-renders with new locale
        └──► t('key') returns Arabic translation
        └──► dir='rtl' applied to JSX

5. VISUAL UPDATE
   │
   └──► Page text changes to Arabic ✅
        Page layout flips to RTL ✅
        Direction persists on refresh ✅
```

---

## File Dependency Chain

```
i18n.config.ts
├─ Defines: locales, Locale type, localeConfig
│  └─ Used by: LanguageProvider, Components
│
LanguageProvider.tsx
├─ Imports:
│  ├─ i18n.config.ts (locales, defaultLocale)
│  ├─ locales/en.json (English translations)
│  └─ locales/ar.json (Arabic translations)
├─ Exports: LanguageProvider, useLanguage hook
│  └─ Used by: app/layout.tsx, ALL client components
│
LanguageSwitcher.tsx
├─ Imports:
│  └─ useLanguage hook from LanguageProvider
├─ Renders:
│  └─ Button to call setLocale('en' or 'ar')
│  └─ Located in: PublicHeader component
│
locales/en.json
├─ Keys: common, navigation, header, buttons, home, etc.
│  └─ Used by: LanguageProvider for translations
│
locales/ar.json
├─ Keys: common, navigation, header, buttons, home, etc.
│  └─ Used by: LanguageProvider for translations
│
Any Component (e.g., PublicHeader.tsx)
├─ Imports: useLanguage hook
├─ Calls: const { t, locale, dir } = useLanguage()
├─ Uses: t('key'), locale, dir in JSX
│  └─ t('key') looks up translation in en.json or ar.json
│     based on current locale
```

---

## Translation Lookup Flow

```
Component calls: t('header.title')
    │
    ▼
LanguageProvider.t() function
    │
    ├─ Split key by dots: ['header', 'title']
    │
    ├─ Get current translations:
    │  └─ If locale === 'en': use en.json
    │  └─ If locale === 'ar': use ar.json
    │
    ├─ Navigate the object:
    │  ├─ Get allTranslations['ar']
    │  ├─ Get (...).header
    │  └─ Get (...).title
    │
    ▼
Return: "العنوان" (Arabic) or "Header" (English)
```

---

## State & Side Effects Timeline

```
INITIAL LOAD:
│
├─► LanguageProvider mounts
├─► Check localStorage for 'language' key
├─► If found and valid: setLocale(saved)
├─► If not found: use defaultLocale ('en')
├─► Update document.documentElement.lang & dir
└─► Ready to render

LANGUAGE SWITCH:
│
├─► User clicks LanguageSwitcher button
├─► setLocale('ar') is called
├─► setLocaleState('ar')
├─► localStorage.setItem('language', 'ar')
├─► useEffect runs:
│   ├─ document.documentElement.lang = 'ar'
│   └─ document.documentElement.dir = 'rtl'
├─► Context value changes
├─► All subscribed components re-render
├─► New locale passed to all useLanguage() calls
├─► JSX updates with t('key') returning Arabic
├─► View updates immediately ✅

PAGE REFRESH:
│
├─► LanguageProvider mounts again
├─► Check localStorage.getItem('language')
├─► Found: 'ar'
├─► setLocale('ar') called
├─► All state restored
├─► App renders with Arabic ✅
```

---

## RTL Implementation

```
Document Level:
│
├─► document.documentElement.dir = 'rtl'
├─► document.documentElement.lang = 'ar'
│
▼

CSS Handling (Automatic):
│
├─► Tailwind CSS respects dir attribute
├─► Use rtl: prefix for RTL-specific styles:
│   └─ className="ml-4 rtl:mr-4 rtl:ml-0"
│
├─► Global CSS can target:
│   └─ html[dir="rtl"] { ... }
│
▼

Component Level:
│
├─► Pass dir prop to root elements:
│   └─ <div dir={dir}>...</div>
│
├─► This cascades to children (except overridden)
│
└─► Some elements may need explicit direction:
    └─ <code dir="ltr">...</code> (always LTR)
```

---

## Hook Usage Pattern

```
Every client component that displays text should follow:

'use client';
│
├─► Import: import { useLanguage } from '@/app/providers/LanguageProvider';
│
├─► Call: const { t, locale, dir } = useLanguage();
│
├─► Use in JSX:
│   ├─ <div dir={dir}>  ← Apply direction
│   ├─ <h1>{t('key')}</h1>  ← Translated text
│   └─ {locale === 'ar' && <ArabicSpecific />}  ← Conditional
│
└─► Component automatically re-renders on language change
```

---

## Comparison: With vs Without Translations

### Without useLanguage() - No Updates:
```
LanguageSwitcher clicked
    ↓
setLocale('ar') called
    ↓
Context updated ✅
    ↓
Component NOT subscribed to Context ✗
    ↓
Component does NOT re-render ✗
    ↓
Text stays in English ✗
```

### With useLanguage() - Works:
```
LanguageSwitcher clicked
    ↓
setLocale('ar') called
    ↓
Context updated ✅
    ↓
Component uses useLanguage() hook ✅
    ↓
Component IS subscribed to Context ✅
    ↓
Component re-renders ✅
    ↓
t('key') returns Arabic translation ✅
    ↓
Text changes to Arabic ✅
```

---

## localStorage Persistence

```
SAVE:
  setLocale('ar')
    └─► localStorage.setItem('language', 'ar')

READ:
  LanguageProvider mount
    └─► localStorage.getItem('language')
    └─► If 'ar': use Arabic
    └─► If null: use defaultLocale ('en')

VERIFICATION:
  Open DevTools → Application → LocalStorage
  Look for key: 'language'
  Value should be: 'en' or 'ar'
```

---

## Error Handling

```
Missing Translation Key:
│
├─► t('nonexistent.key') called
├─► Looks for: allTranslations[locale].nonexistent.key
├─► Returns: 'nonexistent.key' (the key itself)
├─► This shows up in UI so you notice ✅
│
└─► Check console and add the missing key to translations

Locale Not Found:
│
├─► setLocale('fr') called (French)
├─► Not in locales array ['en', 'ar']
├─► Validation in LanguageProvider catches this
├─► Stays with current locale (safe)
│
└─► Only 'en' and 'ar' are valid
```

---

## Performance Considerations

```
✅ Translations loaded at build time
   └─ Not fetched dynamically

✅ Context only updates when language changes
   └─ Not every render

✅ localStorage is synchronous
   └─ Fast to read/write

✅ No API calls needed
   └─ All translations bundled with app

⚠️ Only components using useLanguage() re-render
   └─ Don't add it to every component

⚠️ Large translation files can increase bundle size
   └─ Keep JSON keys concise and organize logically
```

---

## Complete Checklist: How It All Works

- [ ] `i18n.config.ts` defines 'en' and 'ar' as valid locales
- [ ] `LanguageProvider` wraps entire app in `app/layout.tsx`
- [ ] `LanguageProvider` loads en.json and ar.json at runtime
- [ ] `LanguageProvider` checks localStorage for saved language
- [ ] `LanguageProvider` exports `useLanguage()` hook
- [ ] `LanguageSwitcher` imports `useLanguage()` and has buttons
- [ ] Clicking button calls `setLocale('ar' or 'en')`
- [ ] `setLocale` updates context + localStorage + document attributes
- [ ] Any component using `useLanguage()` re-renders on language change
- [ ] Component's `t('key')` returns translated string
- [ ] Component's `dir={dir}` applies RTL layout
- [ ] On page refresh, saved language is restored
- [ ] Zero lag, instant updates ✅

This is production-ready i18n! 🚀
