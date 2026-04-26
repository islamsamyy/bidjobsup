# Arabic Translation - Quick Start Checklist

## What You Have Already ✅

Your app already has all the foundation in place:

```
✅ i18n.config.ts          - Language config (en, ar)
✅ LanguageProvider        - React context for language state
✅ LanguageSwitcher        - Button to switch language (in header)
✅ locales/en.json         - English translations
✅ locales/ar.json         - Arabic translations
✅ localStorage persistence - Language preference saved
✅ RTL/LTR support        - Automatic dir attribute handling
```

The LanguageProvider is already **wrapped around your entire app** in `app/layout.tsx`.

---

## The Problem: Button Not Working? 

### Likely Cause:
Your **components aren't using the `useLanguage()` hook**, so they don't re-render when language changes.

### The Fix:
Add one line to each component that has text:

```typescript
'use client';
import { useLanguage } from '@/app/providers/LanguageProvider';

export function MyComponent() {
  const { t, locale, dir } = useLanguage();  // ← Add this one line
  
  return (
    <div dir={dir}>
      {t('translation.key')}
    </div>
  );
}
```

---

## 3-Step Setup Process

### **Step 1: Expand Translation Files** (10 min)

Add all your UI text to both files:

**`locales/en.json`** - Add all English text as keys
**`locales/ar.json`** - Add corresponding Arabic translations

Example structure:
```json
{
  "header": {
    "title": "Welcome",
    "subtitle": "Join us today"
  },
  "buttons": {
    "signIn": "Sign In",
    "signUp": "Sign Up"
  }
}
```

### **Step 2: Update Components** (30 min)

For each component with text:

```typescript
// 1. Add 'use client' at top
'use client';

// 2. Import useLanguage
import { useLanguage } from '@/app/providers/LanguageProvider';

// 3. Use the hook in your component
const { t, locale, dir } = useLanguage();

// 4. Replace hard-coded text with t('key')
<h1>{t('header.title')}</h1>

// 5. Add dir attribute to root element
<div dir={dir}>
  {/* content */}
</div>
```

### **Step 3: Test** (5 min)

1. Click the language button in the header
2. Switch to Arabic
3. Verify text changes to Arabic
4. Verify page direction changes to RTL
5. Refresh page - language should persist

---

## Translation Key Naming

Use this pattern for consistency:

```
namespace.section.item

Examples:
- header.title
- buttons.signIn
- form.labels.email
- messages.error.notFound
- navigation.home
```

---

## What the Hook Returns

```typescript
const { t, locale, dir } = useLanguage();

// t: Function to get translations
t('some.key')          // Returns translated string

// locale: Current language code
locale === 'en'        // true if English
locale === 'ar'        // true if Arabic

// dir: Text direction
dir === 'ltr'          // Left-to-right (English)
dir === 'rtl'          // Right-to-left (Arabic)
```

---

## Critical Files

| File | Purpose | Status |
|------|---------|--------|
| `i18n.config.ts` | Language configuration | ✅ Done |
| `app/providers/LanguageProvider.tsx` | Context & logic | ✅ Done |
| `components/features/LanguageSwitcher.tsx` | UI button | ✅ Done |
| `locales/en.json` | English translations | ⚠️ Needs expansion |
| `locales/ar.json` | Arabic translations | ⚠️ Needs expansion |
| Your components | Need to use `useLanguage()` | ⚠️ Needs update |

---

## Example: Update One Component

### Before:
```typescript
export function Header() {
  return (
    <nav>
      <h1>Welcome to BidJobs</h1>
      <button>Sign In</button>
    </nav>
  );
}
```

### After:
```typescript
'use client';
import { useLanguage } from '@/app/providers/LanguageProvider';

export function Header() {
  const { t, dir } = useLanguage();
  
  return (
    <nav dir={dir}>
      <h1>{t('header.title')}</h1>
      <button>{t('buttons.signIn')}</button>
    </nav>
  );
}
```

### Add to translations:
```json
// locales/en.json
{
  "header": { "title": "Welcome to BidJobs" },
  "buttons": { "signIn": "Sign In" }
}

// locales/ar.json
{
  "header": { "title": "مرحبا بك في BidJobs" },
  "buttons": { "signIn": "تسجيل الدخول" }
}
```

---

## RTL CSS Quick Tips

### Add to your global CSS:
```css
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

/* For elements that should stay LTR in RTL mode */
html[dir="rtl"] .inline-code {
  direction: ltr;
}
```

### Or use Tailwind RTL prefix:
```jsx
<div className="ml-4 rtl:mr-4 rtl:ml-0">
  Content
</div>
```

---

## Common Gotchas

### ❌ Component doesn't update when language changes
- **Cause:** Missing `'use client'` or not calling `useLanguage()`
- **Fix:** Add both to your component

### ❌ Translation keys show instead of text (e.g., "header.title")
- **Cause:** Key doesn't exist in translation files
- **Fix:** Add the key to both `en.json` and `ar.json`

### ❌ RTL layout breaks
- **Cause:** Missing `dir={dir}` or CSS hardcodes directions
- **Fix:** Add `dir={dir}` to root elements

### ❌ Language reverts on page refresh
- **Cause:** LanguageProvider not wrapping app
- **Fix:** Check `app/layout.tsx` has `<LanguageProvider>`

---

## Files to Read First

1. **ARABIC_TRANSLATION_GUIDE.md** - Full detailed guide
2. **IMPLEMENTATION_EXAMPLES.md** - Real code examples
3. **locales/en.json** - Current English translations
4. **locales/ar.json** - Current Arabic translations

---

## Priority Order

1. **High Priority:** Expand translation files with all UI text
2. **High Priority:** Update PublicHeader component to use `useLanguage()`
3. **Medium Priority:** Update other major components
4. **Medium Priority:** Test on all pages
5. **Low Priority:** Fine-tune Arabic-specific layouts

---

## Time Estimates

- Expand translation files: **15-30 minutes**
- Update 1 component: **5-10 minutes**
- Update all components: **1-2 hours**
- Full testing: **30 minutes**

**Total: 2-3 hours for full implementation**

---

## One-Line Summary

**The foundation is built. Just add translation keys to the JSON files and use the `useLanguage()` hook in your components.**

---

## Debug Command

Open browser console and run:
```javascript
// Check if language persists
localStorage.getItem('language')

// Check document direction
document.documentElement.dir

// Check document language
document.documentElement.lang
```

All three should update when you click the language button.

---

## Next Actions

1. Open `locales/en.json` and expand with more keys
2. Update `locales/ar.json` with Arabic translations
3. Pick one component and update it as an example
4. Test the full workflow
5. Expand to other components

**You've got this! The hard part is already done.** ✨
