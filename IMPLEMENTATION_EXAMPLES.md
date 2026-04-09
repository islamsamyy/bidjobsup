# Arabic Language Implementation - Practical Examples

## How the System Works (Simplified)

```
1. User clicks LanguageSwitcher button
2. setLocale('ar') is called
3. Saves to localStorage
4. Context updates all components
5. Components using useLanguage() re-render with new language
6. Document direction changes (ltr/rtl)
```

---

## Example 1: Using Translations in a Simple Component

### **Before (Hard-coded English)**
```typescript
// components/features/TestComponent.tsx
export function TestComponent() {
  return (
    <div>
      <h1>Welcome to BidJobs</h1>
      <p>Find the best talent or post a job</p>
      <button>Sign In</button>
    </div>
  );
}
```

### **After (Multi-language)**
```typescript
// components/features/TestComponent.tsx
'use client';
import { useLanguage } from '@/app/providers/LanguageProvider';

export function TestComponent() {
  const { t, dir } = useLanguage();

  return (
    <div dir={dir}>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      <button>{t('buttons.signIn')}</button>
    </div>
  );
}
```

### **Required Translation Keys**
Add these to both `locales/en.json` and `locales/ar.json`:

```json
{
  "home": {
    "title": "Welcome to BidJobs",
    "subtitle": "Find the best talent or post a job"
  },
  "buttons": {
    "signIn": "Sign In"
  }
}
```

---

## Example 2: Dynamic Navigation with Translations

### **Current PublicHeader (Hard-coded)**
```typescript
const NAV = [
  {
    label: "Hire Talent",
    icon: "person_search",
    items: [
      { label: "Find Talent", href: "/talent", icon: "person_search" },
      { label: "Post Mandate", href: "/join", icon: "stars" },
    ],
  },
];
```

### **Updated PublicHeader (Multi-language)**

Replace the NAV definition with this function:

```typescript
'use client';
import { useLanguage } from '@/app/providers/LanguageProvider';

// Move NAV outside the component as a function that takes `t`
const getNavItems = (t: (key: string) => string) => [
  {
    label: t('header.hireSection.title'),
    icon: "person_search",
    items: [
      { 
        label: t('header.hireSection.findTalent'), 
        href: "/talent", 
        icon: "person_search",
        desc: t('header.hireSection.findTalentDesc')
      },
      { 
        label: t('header.hireSection.postJob'), 
        href: "/join", 
        icon: "stars",
        desc: t('header.hireSection.postJobDesc')
      },
    ],
  },
  {
    label: t('header.findWorkSection.title'),
    icon: "work",
    items: [
      {
        label: t('header.findWorkSection.browseJobs'),
        href: "/jobs/browse",
        icon: "grid_view",
        desc: t('header.findWorkSection.browseJobsDesc')
      },
    ],
  },
];

export default function PublicHeader({ initialUser, initialProfile }: any) {
  const { locale, setLocale, t, dir } = useLanguage();
  const pathname = usePathname();
  
  // Generate NAV with translations
  const NAV = getNavItems(t);

  return (
    <nav className="..." dir={dir}> {/* Add dir={dir} to handle RTL */}
      {/* Rest of the component stays the same, just use NAV */}
      {NAV.map((group) => (
        // ... existing JSX
      ))}
    </nav>
  );
}
```

### **Translation Keys Needed**

**In `locales/en.json`:**
```json
{
  "header": {
    "hireSection": {
      "title": "Hire Talent",
      "findTalent": "Find Talent",
      "findTalentDesc": "Browse our elite specialist directory",
      "postJob": "Post Job",
      "postJobDesc": "Post a new job mandate"
    },
    "findWorkSection": {
      "title": "Find Work",
      "browseJobs": "Browse Jobs",
      "browseJobsDesc": "Explore all open roles"
    }
  }
}
```

**In `locales/ar.json`:**
```json
{
  "header": {
    "hireSection": {
      "title": "توظيف الموهوبين",
      "findTalent": "البحث عن الموهوبين",
      "findTalentDesc": "تصفح دليل الخبراء المتخصصين",
      "postJob": "نشر وظيفة",
      "postJobDesc": "نشر عرض وظيفة جديد"
    },
    "findWorkSection": {
      "title": "البحث عن عمل",
      "browseJobs": "تصفح الوظائف",
      "browseJobsDesc": "استكشف جميع الأدوار المفتوحة"
    }
  }
}
```

---

## Example 3: Forms & Labels

### **Registration Form**
```typescript
'use client';
import { useLanguage } from '@/app/providers/LanguageProvider';

export function SignUpForm() {
  const { t, dir } = useLanguage();

  return (
    <form dir={dir}>
      <label>{t('form.labels.firstName')}</label>
      <input placeholder={t('form.placeholders.firstName')} />

      <label>{t('form.labels.email')}</label>
      <input type="email" placeholder={t('form.placeholders.email')} />

      <button type="submit">{t('form.buttons.signUp')}</button>
    </form>
  );
}
```

### **Translation Keys**
```json
{
  "form": {
    "labels": {
      "firstName": "First Name",
      "email": "Email Address"
    },
    "placeholders": {
      "firstName": "Enter your first name",
      "email": "you@example.com"
    },
    "buttons": {
      "signUp": "Create Account"
    }
  }
}
```

**Arabic:**
```json
{
  "form": {
    "labels": {
      "firstName": "الاسم الأول",
      "email": "عنوان البريد الإلكتروني"
    },
    "placeholders": {
      "firstName": "أدخل اسمك الأول",
      "email": "انت@مثال.com"
    },
    "buttons": {
      "signUp": "إنشاء حساب"
    }
  }
}
```

---

## Example 4: Conditional Rendering Based on Language

Sometimes you need different layouts for Arabic vs English:

```typescript
'use client';
import { useLanguage } from '@/app/providers/LanguageProvider';

export function LanguageSpecificLayout() {
  const { locale, dir } = useLanguage();

  return (
    <div dir={dir}>
      {locale === 'ar' && (
        <div className="rtl-specific-styles">
          {/* Special layout for Arabic */}
        </div>
      )}

      {locale === 'en' && (
        <div className="ltr-specific-styles">
          {/* Special layout for English */}
        </div>
      )}
    </div>
  );
}
```

---

## Example 5: Dates & Numbers (Locale-Aware)

```typescript
'use client';
import { useLanguage } from '@/app/providers/LanguageProvider';

export function DateDisplay({ date }: { date: Date }) {
  const { locale } = useLanguage();

  const formatted = date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US');

  return <p>{formatted}</p>;
}
```

---

## Example 6: Testing Language Switch

Create a simple test page to verify the setup:

```typescript
// app/test-language/page.tsx
'use client';
import { useLanguage } from '@/app/providers/LanguageProvider';

export default function LanguageTestPage() {
  const { t, locale, dir } = useLanguage();

  return (
    <div dir={dir} className="p-8">
      <h1>{t('common.language')}: {locale.toUpperCase()}</h1>
      <p>Direction: {dir}</p>
      
      <hr className="my-4" />

      <h2>Sample Translations:</h2>
      <ul>
        <li>home.title: {t('home.title')}</li>
        <li>home.subtitle: {t('home.subtitle')}</li>
        <li>buttons.signIn: {t('buttons.signIn')}</li>
        <li>navigation.about: {t('navigation.about')}</li>
      </ul>

      <hr className="my-4" />

      <p>Check the browser console for any missing translation warnings.</p>
    </div>
  );
}
```

**Test it:** Go to `http://localhost:3000/test-language`

---

## Common Patterns to Follow

### ✅ **DO:**
```typescript
// Import useLanguage at top
import { useLanguage } from '@/app/providers/LanguageProvider';

// Add 'use client' for client components
'use client';

// Use the hook
const { t, locale, dir } = useLanguage();

// Use translated text
<h1>{t('home.title')}</h1>

// Set dir attribute on root elements
<div dir={dir}>...</div>
```

### ❌ **DON'T:**
```typescript
// Don't hard-code English text
<h1>Welcome to BidJobs</h1>

// Don't forget to add 'use client'
// (will cause errors if used with server components)

// Don't forget to call useLanguage()
// (component won't update when language changes)

// Don't ignore the dir attribute
// (RTL layout will break)
```

---

## Troubleshooting Checklist

### Language button doesn't work:
- [ ] Check LanguageProvider wraps app in layout.tsx
- [ ] Check browser console for errors
- [ ] Check localStorage shows 'language' key

### Text doesn't change:
- [ ] Add 'use client' at top of component
- [ ] Call useLanguage() hook
- [ ] Make sure key exists in translation file
- [ ] Check component re-renders after language change

### RTL layout breaks:
- [ ] Add `dir={dir}` to root elements
- [ ] Use Tailwind `rtl:` prefix for directional styles
- [ ] Check CSS doesn't hardcode `left` or `right`

### Missing translations show:
- [ ] Add the key to both en.json and ar.json
- [ ] Check key path matches exactly (case-sensitive)
- [ ] Reload page after adding keys

---

## Quick Reference: Translation File Structure

```
locales/
├── en.json
│   ├── common
│   ├── navigation
│   ├── header
│   ├── buttons
│   ├── home
│   ├── forms
│   └── errors
└── ar.json
    ├── common
    ├── navigation
    ├── header
    ├── buttons
    ├── home
    ├── forms
    └── errors
```

**Rule:** Every key in `en.json` must also exist in `ar.json`

---

## Next: Add More Translations

List all the text in your app that needs translation, then add keys to both translation files:

1. Header navigation items
2. Button labels
3. Form labels & placeholders
4. Error messages
5. Success messages
6. Page titles & descriptions
7. Modal titles & content

Start with the most visible elements, then expand gradually.
