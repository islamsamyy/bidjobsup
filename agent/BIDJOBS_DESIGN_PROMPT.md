# BidJobs - Complete Design System Prompt for Antigravity

**Project:** BidJobs - Modern Job Marketplace Platform  
**Timeline:** Immediate  
**Deliverable:** Complete Design System + All Page Designs  
**Tool:** Figma (preferred) or design system format  
**Style Guide:** Modern, Clean, Professional  

---

## 🎨 Design Philosophy

BidJobs should feel:
- **Modern & Professional** - Trustworthy, modern UI (similar to Upwork, Fiverr, but fresher)
- **Minimal & Clean** - No clutter, whitespace-first approach
- **Intuitive & Accessible** - Easy navigation for all user types
- **Fast-Paced & Energetic** - Vibrant accents, but primarily neutral base
- **Global & Inclusive** - Dark mode support, RTL-friendly, multiple languages

---

## 🎭 Brand & Color System

### Primary Palette

**Primary Color:** `#6366F1` (Indigo)
- Used for CTAs, active states, primary actions
- Conveys trust, professionalism, technology

**Secondary Color:** `#10B981` (Emerald Green)
- Used for success states, positive actions
- Indicates job completion, acceptance, earnings

**Accent Color:** `#F59E0B` (Amber)
- Used for featured jobs, important alerts
- Featured job badges, top-rated badges

**Neutral Palette:**
- **Background:** `#FFFFFF` (Light mode) / `#0F172A` (Dark mode)
- **Surface:** `#F9FAFB` (Light) / `#1E293B` (Dark)
- **Border:** `#E5E7EB` (Light) / `#334155` (Dark)
- **Text Primary:** `#1F2937` (Light) / `#F1F5F9` (Dark)
- **Text Secondary:** `#6B7280` (Light) / `#94A3B8` (Dark)
- **Text Muted:** `#9CA3AF` (Light) / `#64748B` (Dark)

**Status Colors:**
- Success: `#10B981`
- Error: `#EF4444`
- Warning: `#F59E0B`
- Info: `#3B82F6`

### Gradient Usage
- Primary gradient: Indigo → Purple (for hero sections)
- Success gradient: Green → Emerald (for completion states)
- Neutral gradient: Gray shades (for subtle backgrounds)

---

## 📐 Typography System

### Font Family
- **Primary:** Inter (sans-serif)
- **Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Monospace:** JetBrains Mono (for code, prices, IDs)

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| H1 | 48px | 700 | 1.2 | -0.02em |
| H2 | 36px | 700 | 1.25 | -0.01em |
| H3 | 28px | 600 | 1.3 | 0 |
| H4 | 24px | 600 | 1.35 | 0 |
| Body Large | 18px | 400 | 1.6 | 0 |
| Body | 16px | 400 | 1.6 | 0 |
| Body Small | 14px | 400 | 1.5 | 0 |
| Caption | 12px | 500 | 1.4 | 0.02em |
| Overline | 12px | 600 | 1.2 | 0.08em |

---

## 🔲 Component Design System

### Button Variants

**Primary Button**
- Background: `#6366F1`
- Text: White
- Padding: 12px 24px
- Border Radius: 8px
- Hover: `#4F46E5` (darker indigo)
- Active: `#4338CA`
- Disabled: `#D1D5DB` (gray), 50% opacity

**Secondary Button**
- Background: `#F3F4F6`
- Text: `#1F2937`
- Border: 1px `#E5E7EB`
- Padding: 12px 24px
- Border Radius: 8px
- Hover: `#E5E7EB` background

**Outline Button**
- Background: Transparent
- Border: 2px `#6366F1`
- Text: `#6366F1`
- Padding: 10px 22px (to account for border)
- Hover: `#F3F4F6` background

**Ghost Button**
- Background: Transparent
- Text: `#6366F1`
- Padding: 12px 24px
- Hover: `#F3F4F6` background

**Danger Button**
- Background: `#EF4444`
- Text: White
- Hover: `#DC2626`

**Size Variants:**
- Large: 16px text, 14px 32px padding
- Medium: 16px text, 12px 24px padding (default)
- Small: 14px text, 8px 16px padding

### Input Components

**Text Input**
- Height: 44px
- Padding: 12px 16px
- Border: 1px `#E5E7EB`
- Border Radius: 8px
- Font: 16px, 400 weight
- Focus: 2px `#6366F1` border, shadow: 0 0 0 3px `#6366F1` + 10% opacity
- Disabled: Background `#F9FAFB`, text `#9CA3AF`
- Error state: Red border, error message below

**Select Dropdown**
- Same styling as text input
- Dropdown arrow indicator on right
- Hover: slight border color change

**Textarea**
- Min height: 120px
- Same border/padding as input
- Resize: vertical only
- Focus state: same as input

**Multi-select Input (for skills, categories)**
- Display as tags/pills
- Tag design: Background `#F3F4F6`, text `#1F2937`, 8px padding, 16px border radius
- Hover: Background `#E5E7EB`
- Remove icon (×) on right with hover highlight

### Card Component

**Base Card**
- Background: White (light) / `#1E293B` (dark)
- Border: 1px `#E5E7EB` (light) / `#334155` (dark)
- Border Radius: 12px
- Padding: 24px
- Box Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover Shadow (interactive): 0 4px 12px rgba(0,0,0,0.15)

**Card Variants:**
- **Elevated Card:** Larger shadow, 8px padding all
- **Outlined Card:** Only border, no shadow
- **Contained Card:** Filled background `#F9FAFB`

### Badge Component

**Default Badge**
- Background: `#EEF2FF` (indigo light)
- Text: `#4F46E5`
- Padding: 4px 12px
- Border Radius: 12px
- Font: 12px, 600 weight

**Badge Variants:**
- Success: Green background, green text
- Warning: Amber background, amber text
- Error: Red background, red text
- Gray: Gray background, gray text
- Outline: Transparent background, colored border + text

### Avatar Component

**Sizes:**
- XS: 24px
- SM: 32px
- MD: 40px (default)
- LG: 56px
- XL: 80px

**Design:**
- Border Radius: 50% (circle)
- Border: 2px white (light mode) / 2px dark background (dark mode)
- Fallback: User initials on `#6366F1` background, white text
- Image: Cover object-fit

### Rating Stars

**Design:**
- Star Size: 20px (adjustable)
- Color: `#F59E0B` (filled), `#E5E7EB` (empty)
- Spacing: 4px between stars
- Interactive: Hover highlights upcoming stars
- Display: "4.8 (142 reviews)" format

---

## 📱 Layout & Spacing System

### Spacing Scale (px)
```
0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96
```

### Grid System
- 12-column grid (responsive)
- Desktop: 1200px max-width
- Tablet: 768px
- Mobile: 375px minimum

### Gaps & Gutters
- Desktop: 24px column gap
- Tablet: 20px
- Mobile: 16px

### Container Padding
- Desktop: 40px left/right
- Tablet: 24px
- Mobile: 16px

### Card Grid Layouts
- Desktop: 3 columns (job cards, seeker cards)
- Tablet: 2 columns
- Mobile: 1 column (stacked)

---

## 🧭 Navigation Components

### Top Navigation Bar
**Height:** 64px (desktop), 56px (mobile)

**Content Layout:**
- Left: BidJobs logo (32px) + 8px spacing
- Center: Navigation links (desktop only)
- Right: Search bar (desktop), user avatar dropdown, notifications bell

**Navigation Links (Desktop):**
- Browse Jobs
- Find Talent
- Community
- (Conditional: My Dashboard if logged in)

**Styling:**
- Background: White (light) / `#0F172A` (dark)
- Border bottom: 1px separator
- Logo text: 24px, 700 weight, indigo color

### Sidebar Navigation (Dashboard)
**Width:** 240px (desktop), collapsible to 60px
**Items:**
- Dashboard (home icon)
- Browse Jobs (search icon)
- My Jobs (briefcase icon)
- Messages (mail icon)
- Saved Items (bookmark icon)
- Community (users icon)
- My Profile (user icon)
- Settings (gear icon)
- Help (question icon)

**Item Styling:**
- Height: 44px
- Padding: 0 16px
- Icon: 20px, left-aligned
- Text: 14px, 500 weight
- Active: `#6366F1` background, indigo text
- Hover: `#F3F4F6` background
- Divider lines between sections

### Breadcrumb Navigation
**Style:** Text-based, "/" separator
**Example:** Dashboard / Jobs / Job Details / Bids
**Color:** Text secondary color

---

## 📄 Page Designs

### 1. AUTHENTICATION PAGES

#### Sign In Page (`/sign-in`)

**Layout:**
- Split screen or centered modal approach
- Left side (optional): Illustration or gradient background with key features
- Right side: Form content

**Hero Section (if split screen):**
- Background: Gradient from indigo to purple
- Headline: "Welcome Back to BidJobs"
- Subheading: "Find your next opportunity or hire top talent"

**Form Section:**
- Centered white card, max-width: 420px
- Heading: "Sign In"
- Subheading: "Access your account to continue"
- Form fields:
  - Email input (email type)
  - Password input (password type, show/hide toggle)
  - Remember me checkbox
  - Sign In button (full width, primary)
- Links:
  - "Forgot password?" (gray text, hover underline)
  - "Don't have an account? Sign up" (indigo text)
- Divider: "Or continue with"
- OAuth buttons:
  - Google button (white background, gray border)
  - Microsoft button (white background, gray border)

**Responsive:**
- Mobile: Full screen, no split
- Tablet: Centered form, no illustration

---

#### Sign Up Page (`/sign-up`)

**Layout:** Similar to sign-in, centered form

**Form Sections:**

**Section 1: Account Details**
- Email input (with validation)
- Password input (with strength indicator)
- Confirm password input
- Password strength bar (red → orange → green)

**Section 2: Profile Type**
- Radio buttons / Icon buttons:
  - "I'm Looking for Work" (freelancer icon)
  - "I'm Hiring" (briefcase icon)
  - "Both" (both icons)
- Selection shows different subsequent fields

**Section 3: Basic Info**
- Full Name input
- Location dropdown
- Phone input (optional)

**Section 4: Terms**
- Checkbox: "I agree to Terms of Service and Privacy Policy"
- Sign Up button (full width, primary, disabled until terms checked)

**Progress Indicator (optional):**
- 4 dots showing steps 1-4
- Current step highlighted in indigo

**After submission:**
- Success message: "Check your email to verify your account"
- Resend email link

---

### 2. JOB BROWSING PAGES

#### Browse Jobs Page (`/jobs`)

**Layout:**

**Header Section:**
- Hero banner (optional): "Find Your Next Job" or "Hire Top Talent"
- Subheading: Quick stats (e.g., "5,230 jobs posted this week")
- Search bar center: Full-width search with category quick filters

**Main Content Area:**

**Left Sidebar (Desktop only, collapsible on tablet):**
- Width: 280px
- Title: "Filters"
- Filter sections (each collapsible):

  1. **Category Filter**
     - Checkboxes with counts
     - "See all" expander
     - Common categories: Web Development, Design, Writing, Marketing, etc.

  2. **Budget Filter**
     - Range slider (min/max)
     - Input fields for exact amounts
     - Currency selector (USD default, others available)

  3. **Experience Level**
     - Radio buttons: Entry, Intermediate, Expert
     - Descriptions under each

  4. **Duration**
     - Checkboxes: <1 week, 1-4 weeks, 1-3 months, 3+ months
     - Toggle: Show short-term / long-term only

  5. **Job Status**
     - Checkboxes: Open, Featured, Closing Soon
     - Color-coded badges

  6. **Rating Filter**
     - Star rating selector (3+, 4+, 4.5+, 5)

  7. **Apply Filters Button** (sticky on mobile)
     - Primary button, full width
     - Show active filter count badge

- **Clear Filters** link (secondary style)

**Right Content Area:**

**Top Bar:**
- View toggle: Grid icon (3 cols) / List icon (1 col)
- Sort dropdown: "Newest", "Trending", "Highest Budget", "Most Bids"
- Results counter: "Showing 1-12 of 234 jobs"

**Job Cards Grid (3 columns, desktop; 2 tablet; 1 mobile):**

**Job Card Design:**
- Dimensions: ~360px × 280px
- Card component with hover shadow
- Content:
  - Top section (flex, space-between):
    - Job category badge (small, gray background)
    - Save icon (bookmark, hollow, gray, hover → filled indigo)
  
  - Headline area:
    - Job title: 18px, 600 weight, text primary
    - Employer name: 14px, text secondary
  
  - Description:
    - First 80 chars of description (truncated)
    - 14px, text secondary
  
  - Meta section (flex, space-between):
    - Budget: "₹50,000 - ₹100,000" (emerald green, 600 weight)
    - Status badge: "Fixed Price" or "Hourly"
  
  - Skills section:
    - 2-3 top skills shown as small gray badges
    - "+2 more" if more than 3
  
  - Footer section (flex, space-between):
    - Left: Experience level badge (small)
    - Right: Bids count "12 bids" (text secondary)
  
  - Hover state:
    - Shadow increases (elevated card)
    - Background tint (light indigo)
    - "View Details" CTA appears or is always visible

**Pagination:**
- Below job grid
- Style: Numbered buttons, previous/next arrows
- Current page: Indigo background
- Hover: Gray background

---

#### Job Details Page (`/jobs/[id]`)

**Layout:** Single column, max-width 900px, centered

**Header Section:**
- Breadcrumb navigation (optional)
- Top bar with:
  - Job title: 36px, 700 weight
  - Status badge (Open, In Progress, etc.)
  - Save button (large bookmark icon)
  - Share button (icon)

**Hero Section:**
- Job category + subcategory breadcrumb
- Budget display: Large, 28px, 600 weight, green color
- Job type badge (Fixed Price / Hourly)
- Experience level badge
- Duration estimate
- Bids count: "12 bids received"

**Two-Column Layout (Desktop):**

**Left Column (2/3 width):**

1. **Description Section**
   - Heading: "About this job"
   - Rich text content
   - May include images, bullet points
   - Well-formatted whitespace

2. **Skills Required Section**
   - Heading: "Required Skills"
   - Skill badges (larger, interactive hover)
   - Can click to filter similar jobs

3. **Activity Section**
   - Heading: "Job Activity"
   - Timeline:
     - "Posted 2 days ago"
     - "5 bids received"
     - Status updates
   - Icon + timestamp format

4. **About the Employer Section**
   - Card component
   - Employer avatar (large, 56px)
   - Employer name (16px, 600 weight)
   - Company name (optional)
   - Rating: ⭐ 4.8 (142 reviews)
   - "Member since March 2024"
   - "Response rate: 95%"
   - "Within 1 hour" (response time)
   - "View Profile" button (secondary)

**Right Column (1/3 width, Sticky on desktop):**

1. **Action Card** (sticky, white background, border)
   - Job details summary:
     - Budget: "₹75,000"
     - Duration: "1-3 months"
     - Level: "Intermediate"
     - Bids: "12"
   
   - CTA buttons:
     - **Primary: "Place a Bid"** (full width, indigo)
     - Secondary: "Message Employer" (full width, outline)
     - Tertiary: "Report Job" (ghost, red text)

2. **Similar Jobs Section** (below sticky card on scroll)
   - Heading: "Similar Jobs"
   - 3-4 mini job cards (smaller version)
   - "See all" link

---

#### Create Job Page (`/jobs/create`)

**Layout:** Two-column, left form, right preview

**Left Column: Form**

**Form Sections (each with light background, 16px padding, border-radius 8px):**

1. **Job Title & Description**
   - Input: "Job Title" (placeholder: "e.g., Build responsive website...")
   - Textarea: "Job Description" with rich text editor
     - Editor toolbar: Bold, Italic, Underline, Link, Code, Bullet list, Number list
     - Character count: "0/5000"
     - Helper text: "Be specific about what you need"

2. **Category & Skills**
   - Dropdown: "Category" (Web Development, Design, etc.)
   - Dropdown: "Subcategory" (conditional based on category)
   - Multi-select: "Skills Required" 
     - Searchable dropdown
     - Selected skills show as tags
     - "Add custom skill" option
   - Helper text: "This helps attract the right talent"

3. **Budget Information**
   - Radio buttons: "Fixed Price" / "Hourly Rate"
   - Conditional inputs:
     - If Fixed: Min/Max budget inputs
     - If Hourly: Hourly rate range
   - Currency selector (dropdown, default USD)
   - Helper text: "Budget visibility increases bids"

4. **Job Details**
   - Dropdown: "Experience Level" (Entry, Intermediate, Expert)
   - Dropdown: "Duration" (options listed)
   - Number input: "Estimated Hours" (optional)
   - Checkbox: "Featured Job" (with price info)

5. **Visibility & Sharing**
   - Radio: "Public" / "Private"
   - Checkbox: "Private job (invite only)"
   - Helper text: "Private jobs are only visible to invited candidates"

6. **Save & Publish**
   - Button: "Save as Draft" (secondary, full width)
   - Button: "Publish Job" (primary, full width)
   - Checkbox: "I understand the Terms of Service"

**Right Column: Live Preview**
- Sticky card showing how job will appear
- Updates in real-time as form is filled
- "Preview" heading
- Shows job card preview from Browse Jobs page
- Shows full job details preview
- Non-interactive

**Mobile Behavior:**
- Single column (form only)
- Preview shown below form or in modal

---

### 3. BIDDING SYSTEM

#### Place Bid Modal / Page

**Modal Overlay or Full Page:**

**Content Card:**

**Header:**
- "Place Your Bid" (24px, 600 weight)
- "Job: [Job Title]" (14px, text secondary)

**Form Sections:**

1. **Bid Amount**
   - Label: "Your Bid Amount"
   - Input: Currency amount (with $ symbol)
   - Helper: "Employer budget: ₹50,000 - ₹100,000"
   - Auto-calculation for hourly jobs

2. **Proposal/Cover Letter**
   - Label: "Your Proposal"
   - Textarea (rich text editor)
   - Placeholder: "Explain why you're the best fit for this job..."
   - Character count: "0/2000"
   - Helper: "Personalized proposals get 30% more acceptances"

3. **Delivery Timeline**
   - Label: "Estimated Delivery" (days)
   - Number input with spinners
   - Helper: "Realistic timelines increase acceptance rate"

4. **Attachments** (optional)
   - Label: "Portfolio or Attachments"
   - Drag-drop zone or file picker
   - Allowed: PDF, images, max 5MB each, max 3 files
   - Show uploaded files as chips/cards

5. **Portfolio Links** (optional)
   - Label: "Portfolio Links"
   - Add button to add multiple links
   - Input fields for URL
   - Preview of link (thumbnail, title)

**Actions:**
- Button: "Submit Bid" (primary, full width, disabled until required fields filled)
- Button: "Cancel" (ghost, full width)
- Helper text: "Your bid is private. Only the employer can see it."

**Success State:**
- Modal closes or shows success message
- Toast notification: "Bid submitted successfully! Track your bid in My Bids."
- Redirect option to "View all my bids" or stay on page

---

#### My Bids / Manage Bids Page

**Layout:** Tabbed or filtered list

**Tabs:**
- All Bids
- Pending
- Accepted
- Rejected
- Withdrawn

**Bids List (Table on desktop, Cards on mobile):**

**Table Columns:**
| Job Title | Amount | Status | Date Submitted | Action |
|-----------|--------|--------|----------------|--------|
| "Build React App" | "₹75,000" | 🟢 Pending | "Mar 28" | Withdraw |
| "Logo Design" | "₹15,000" | 🟢 Accepted | "Mar 25" | View |

**Card View (Mobile):**
- Job title (16px, 600 weight)
- Bid amount (14px, green)
- Status badge (color-coded)
- Date submitted
- Action buttons (dropdown or visible)

**Status Badges:**
- Pending: Blue/gray
- Accepted: Green
- Rejected: Red
- Withdrawn: Gray (strikethrough)

**Row Actions:**
- Accepted: "View Contract", "Message Employer"
- Pending: "Withdraw", "Edit Bid" (if allowed), "View Job"
- Rejected: "View Feedback" (if provided), "Reapply"

**Filters:**
- Filter by date range
- Filter by budget range
- Sort: Newest, Oldest, Highest Bid, Lowest Bid

**Empty State:**
- Icon: Briefcase or checkmark
- Heading: "No bids yet"
- Description: "Start browsing jobs and place your first bid"
- CTA: "Browse Jobs" button (primary)

---

### 4. USER PROFILES

#### My Profile Page (Jobseeker)

**Layout:** Single column with sections

**Header Section:**
- Avatar (80px, large)
- Full name (28px, 700 weight)
- Headline / Job title (18px, 600 weight, text secondary)
- Edit Profile button (primary, top right)

**Quick Stats Bar:**
- Grid of 4 stats, each in a small card:
  - Icon + Number + Label
  - "12" "Jobs Completed"
  - "₹2,50,000" "Total Earned"
  - "98%" "Success Rate"
  - "⭐ 4.9" "Rating"

**Profile Completion Progress:**
- Progress bar: "Profile 85% Complete"
- Checklist: What's missing

**Tabs:**
- Overview
- Reviews
- Portfolio
- Activity

**Tab 1: Overview**

1. **Bio Section**
   - Bio text (editable)
   - Max 160 characters
   - Placeholder: "Short professional summary"

2. **Contact Information Card**
   - Email: (masked, @)
   - Phone: (with verification badge)
   - Location: (with edit icon)
   - Website: (with link icon)
   - Social profiles: (LinkedIn, GitHub, etc.)

3. **Professional Information Card**
   - Hourly Rate: "₹500/hr" (editable)
   - Experience Level: "Expert" (radio buttons)
   - Years of Experience: (number input)
   - Languages: (multi-select tags)
   - Certifications: (list with add button)

4. **Skills Section**
   - "Add skills" input (searchable suggestions)
   - Display skills as larger badges
   - Endorsements count on each skill: "4 endorsements"
   - Drag-to-reorder (top 5 skills highlighted)
   - Can add up to 15 skills

5. **Education**
   - School name
   - Degree
   - Field of study
   - Year
   - Add Education button

6. **Work Experience**
   - Company name
   - Job title
   - Duration
   - Description
   - Add Experience button

**Tab 2: Reviews**
- Star rating summary: "⭐ 4.9 out of 5 (12 reviews)"
- Rating breakdown chart:
  - 5 stars: ████ 10
  - 4 stars: ██ 2
  - etc.

- Filter tabs: All, 5 Star, 4 Star, etc.

- Review cards (newest first):
  - Reviewer avatar (small, 32px)
  - Reviewer name (link to profile)
  - Rating (stars)
  - "Reviewed 5 days ago"
  - Review text (can be long, truncated with "read more")
  - Category ratings (if provided): Communication: ⭐⭐⭐⭐⭐

**Tab 3: Portfolio**
- Grid of portfolio items
- Each item:
  - Image thumbnail (square, 160px)
  - Title overlay
  - Hover: Shows description, "View" link
  - Edit/Delete icons (on hover)

- Add Portfolio Item button: Upload image + details (title, description, link)

**Tab 4: Activity**
- Timeline of user activity
- Events:
  - "Job completed: Build React App"
  - "Review received: 5 stars"
  - "Bid accepted on XYZ job"
- Filter: Last 30 days, Last 90 days, All time

---

#### Browse Talent / Seekers Page

**Layout:** Grid of seeker cards

**Header:**
- Heading: "Find Top Talent"
- Filters sidebar (similar to jobs page):
  - Skills (multi-select)
  - Hourly Rate range slider
  - Experience level
  - Location
  - Rating
  - Availability

**Seeker Card Design:**
- Dimensions: ~280px × 360px
- Content:
  - Avatar (56px, top center)
  - Name (18px, 600 weight)
  - Headline (14px, text secondary)
  - Hourly Rate (16px, 600 weight, green)
  - Rating: "⭐ 4.8 (42 reviews)" (14px)
  - Top 3 skills as small badges
  - Bio preview (2 lines, truncated)
  - "Jobs Completed: 15" (small text)
  
  - Action buttons:
    - Primary: "View Profile" (blue)
    - Secondary: "Send Message" (outline)
    - Tertiary: "Hire Now" (ghost, indigo text)

- Hover state: Slight lift/shadow, actions more prominent

**Empty State:**
- Icon: Users
- Heading: "No talent found"
- Description: "Try adjusting your filters"
- "Clear Filters" button

---

#### Profile View (Reading Another User)

**Same layout as My Profile but:**
- Edit Profile button replaced with:
  - "Message" button (primary, indigo)
  - "Hire Now" button (primary, green)
  - "Save Profile" button (outline, bookmark icon)

- No edit icons on any fields
- View only

---

### 5. MESSAGING SYSTEM

#### Messages Page (`/messages`)

**Layout:** Two-column split (desktop), single column (mobile with toggle)

**Left Column: Conversations List (280px on desktop)**

**Header:**
- Heading: "Messages"
- Search input: "Search conversations..."
- New message button (icon or text)

**Conversations List:**
- Each conversation item:
  - Avatar (small, 40px)
  - Name (16px, 600 weight)
  - Last message preview (14px, text secondary, 1 line, truncated)
  - Timestamp (12px, gray)
  - Unread count badge (if unread, red background, white text, rounded)
  - Hover: Light background highlight

- Active conversation: Indigo left border + background highlight

**Sorting:** Most recent first

**Empty State:**
- Icon: Mail
- "No conversations yet"
- "Start messaging to connect with employers or freelancers"

**Right Column: Chat Area (flex: 1)**

**Chat Header (sticky):**
- User avatar (32px)
- User name (16px, 600 weight)
- Online status indicator (green dot for online)
- "Last seen 2 hours ago" (text secondary, if offline)
- More options menu (three dots) with:
  - View Profile
  - Block User
  - Report Conversation
  - Archive Conversation
  - Delete Conversation

**Message Thread:**
- Messages displayed chronologically
- Message bubble design:
  - Own messages: Right-aligned, indigo background, white text
  - Other's messages: Left-aligned, gray background, dark text
  - Padding: 12px 16px
  - Border radius: 8px (square bottom on same user's consecutive messages)
  - Timestamp: 12px, gray, below message
  - Avatar on first message from user (left side)

- System messages (different styling):
  - Centered, gray text, 12px
  - "User joined the conversation"
  - "User archived this conversation"

- Date separators:
  - "March 28" centered, small caps, text-muted

- Typing indicator:
  - "User is typing..." with animated dots

**Message Input Area (sticky at bottom):**
- Flex container:
  - Attachment button (icon, paperclip)
  - Textarea: Auto-grow, max 300px height
  - Send button (icon, arrow, indigo)
  - Emoji picker button (icon, smiley)

- Placeholder: "Type your message..."
- Disabled if user is blocked

**Message Features:**
- Hover message actions (pin, delete, react with emoji)
- File attachment preview: Thumbnail + filename
- Link preview: Shows URL preview with title/image
- Quote/Reply functionality: Reply to specific message

---

### 6. COMMUNITY SECTION

#### Community Feed Page (`/community`)

**Layout:** Similar to social media (Twitter, LinkedIn style)

**Header:**
- Heading: "Community"
- Subheading: "Connect, discuss, and learn from the BidJobs community"
- Create Post button (primary, full width or right-aligned)

**Left Sidebar (Desktop, 240px):**
- Trending topics
- Suggested people to follow
- About section

**Main Feed (400-600px width, desktop):**

**Post Card Design:**
- Card component
- Header (flex, space-between):
  - Left: Avatar (32px) + Name (14px, 600 weight) + Timestamp (12px)
  - Right: More menu (three dots)

- Content:
  - Title (if separate): 18px, 600 weight
  - Post text: 16px, 400 weight, up to 500 characters preview
  - Post image (if attached): Full width, max-height 300px
  - Tags: Small gray badges, lowercase

- Footer (flex, space-between):
  - Left: "12 comments" (secondary text, clickable)
  - Center: "❤️ 45 likes" (secondary text, clickable)
  - Right: "Share" button (icon)

- Hover: Light background, like button more prominent

- Interaction buttons (below content, on hover or always visible):
  - Like button: Heart icon (empty or filled), count
  - Comment button: Chat icon, count
  - Share button: Share icon

**Post Filter/Tabs:**
- All Posts
- Following
- Your Posts
- Trending
- Unanswered

**Right Sidebar (Desktop, optional):**
- Trending tags or topics
- "What's new in BidJobs?" section

**Mobile:** Single column, full width posts

---

#### Create Post Page (`/community/create`)

**Layout:** Centered form, max-width 600px

**Form:**

1. **Post Title** (optional)
   - Input: "Post Title"
   - Placeholder: "Share your thoughts, question, or knowledge"
   - Character count: "0/100"

2. **Post Content**
   - Rich text editor (similar to job description)
   - Toolbar: Bold, Italic, Link, Code, Lists
   - Placeholder: "Share your thoughts, question, or knowledge..."
   - Character count: "0/5000"

3. **Category**
   - Dropdown: "Category"
   - Options: Discussion, Question, Announcement, Resource, Poll, etc.

4. **Tags**
   - Multi-select input: "Add tags"
   - Searchable suggestions
   - Max 5 tags
   - Display as removable chips

5. **Featured Image** (optional)
   - Drag-drop or file picker
   - Image preview
   - "Remove image" button

6. **Visibility**
   - Radio: "Public" / "Members Only"

7. **Publish Options**
   - Button: "Save as Draft"
   - Button: "Publish Post" (primary, full width)

8. **Preview** (below form or on right)
   - Shows how post will appear in feed

---

#### Post Detail Page (`/community/[postId]`)

**Layout:** Centered content, 600-700px max-width

**Post Content:**
- Title: 32px, 700 weight
- Author info:
  - Avatar (40px)
  - Name (16px, 600 weight)
  - "Posted 2 hours ago"
  - Follow button (secondary)

- Post body: Rich text, images, links

- Engagement section:
  - "❤️ 45 likes" | "💬 12 comments" | "👁️ 340 views"
  - Like button (large, primary color on hover)
  - Share button
  - More menu (report, etc.)

**Comments Section (below post):**

- Write comment box:
  - Avatar (user's, 32px)
  - Textarea: "Add a comment..."
  - Button: "Post" (primary, small)

- Comments list (newest first):
  - Comment card:
    - Avatar (32px)
    - Commenter name (14px, 600 weight)
    - "Posted 1 hour ago"
    - Comment text (16px)
    - Like count (12px, secondary)
    - Reply button
    - More menu (edit, delete if own)

  - Nested replies (indented, smaller avatars)

- Load more comments button

---

### 7. DASHBOARD

#### Employer Dashboard (`/dashboard`)

**Layout:** Grid-based, responsive

**Header Section:**
- Greeting: "Good morning, [Name]! 👋"
- Quick action buttons:
  - "Post New Job" (primary, indigo)
  - "Browse Talent" (secondary)

**Stats Cards (4 columns, responsive):**
- Each card: Small card component with icon
  - Icon (32px, indigo)
  - Number (24px, 700 weight)
  - Label (14px, text secondary)
  
  Cards:
  1. Active Jobs: "3"
  2. Total Bids: "47"
  3. Pending Messages: "8"
  4. Total Spent: "₹5,00,000"

**Main Content Area (2-column, tablet 1-column):**

**Left Column (2/3 width):**

1. **Recent Activity**
   - Card component
   - Heading: "Recent Activity"
   - List of activities:
     - Avatar + "New bid from John Doe on React App Job" + timestamp
     - Icon + "Job completed: Logo Design" + timestamp
     - Icon + "New message from Jane Smith" + timestamp
   - "View all" link

2. **Top Performing Jobs**
   - Card component
   - Table-like view:
     - Job title | Bids | Budget | Status
   - Sort: Most bids, most recent, etc.
   - View all link

**Right Column (1/3 width):**

1. **Quick Links**
   - Card component
   - Buttons/links:
     - "Manage Active Jobs"
     - "View All Bids"
     - "My Messages"
     - "Billing & Payments"
     - "Account Settings"

2. **Spending Overview**
   - Card component
   - Simple bar chart (last 6 months)
   - X-axis: Months
   - Y-axis: Amount spent
   - Color: Indigo bars

3. **Help & Resources**
   - Card component
   - Links to:
     - "How to Post a Job"
     - "Best Practices"
     - "Contact Support"

---

#### Jobseeker Dashboard (`/dashboard`)

**Similar layout to employer but different content:**

**Stats Cards:**
1. Active Bids: "8"
2. Total Earned: "₹2,50,000"
3. Success Rate: "98%"
4. Rating: "4.9 ⭐"

**Recent Activity:**
- "Bid accepted on React App Job" + timestamp
- "New message from ABC Company" + timestamp
- "Review posted: 5 stars" + timestamp

**Earnings Overview:**
- Bar chart showing monthly earnings

**Recommended Jobs:**
- Card showing 3-4 recommended jobs based on skills

---

## 🎬 Animations & Interactions

### Micro-interactions

**Button Hover:**
- 200ms transition
- Scale: 1.02
- Shadow increase

**Button Click:**
- Brief scale-down (0.98)
- Loading state with spinner

**Card Hover:**
- Shadow increase (box-shadow transition 300ms)
- Optional: Slight upward movement (transform: translateY(-2px))

**Input Focus:**
- Border color change to indigo (200ms)
- Shadow outline

**Skeleton Loading:**
- Pulse animation (opacity 0.5 → 1 → 0.5, 2s loop)

**Toast/Alert:**
- Slide-in from top/bottom (300ms)
- Auto-dismiss after 4 seconds with slide-out

**Modal Entrance:**
- Fade background (200ms)
- Scale modal from 0.9 to 1.0 (300ms)

**Badge Appearance:**
- Subtle scale-in (0.8 → 1.0, 200ms)

**Notification Badge:**
- Pulse animation when new count appears

### Transitions

- Default: 200ms ease-in-out
- Long-form interactions: 300ms
- Quick interactions (hover): 150ms

---

## 📐 Responsive Design Breakpoints

```
Mobile: 320px - 640px
Tablet: 640px - 1024px
Desktop: 1024px+
Large Desktop: 1440px+
```

### Mobile-Specific Changes:

**Navigation:**
- Hamburger menu instead of full nav
- Bottom tab bar (Browse, Messages, Dashboard, Profile, Menu)

**Cards:**
- Full width with 16px padding
- Single column layouts

**Modals:**
- Full screen or bottom sheet style

**Inputs:**
- Larger touch targets (44px minimum height)

**Sidebar:**
- Collapsed to icons only
- Drawer/overlay on tap

---

## 🌓 Dark Mode Implementation

**Dark Mode Colors (override light mode):**
- Background: `#0F172A`
- Surface: `#1E293B`
- Card: `#334155` with lighter border
- Text Primary: `#F1F5F9`
- Text Secondary: `#94A3B8`
- Border: `#475569`

**Component Adaptations:**
- Reduce shadow opacity/intensity
- Slightly lighter accent colors for contrast
- White icons remain the same (auto-contrast)

**Implementation:**
- CSS custom properties / Tailwind dark: class
- Persist user preference in localStorage
- Respect system preference by default

---

## 🎯 Design Deliverables

**Figma File Structure:**

```
BidJobs Design System
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Components
│   │   ├── Buttons
│   │   ├── Inputs
│   │   ├── Cards
│   │   ├── Badges
│   │   ├── Avatars
│   │   └── Navigation
│   └── Spacing & Layout
│
├── 📱 Pages
│   ├── Auth
│   │   ├── Sign In
│   │   ├── Sign Up
│   │   └── Forgot Password
│   │
│   ├── Jobs
│   │   ├── Browse Jobs
│   │   ├── Job Details
│   │   ├── Create Job
│   │   └── Search Results
│   │
│   ├── Bidding
│   │   ├── Place Bid
│   │   └── Manage Bids
│   │
│   ├── Profiles
│   │   ├── My Profile
│   │   ├── Profile View
│   │   ├── Browse Talent
│   │   └── Edit Profile
│   │
│   ├── Messaging
│   │   ├── Messages List
│   │   └── Chat Conversation
│   │
│   ├── Community
│   │   ├── Feed
│   │   ├── Post Detail
│   │   └── Create Post
│   │
│   └── Dashboard
│       ├── Employer Dashboard
│       └── Jobseeker Dashboard
│
├── 🔄 Interactions
│   ├── Hover States
│   ├── Focus States
│   ├── Loading States
│   ├── Error States
│   └── Empty States
│
├── 📱 Responsive Variants
│   ├── Mobile Layouts
│   ├── Tablet Layouts
│   └── Desktop Layouts
│
└── 🌓 Dark Mode
    ├── Dark Mode Pages
    └── Dark Mode Components
```

---

## 🎨 Additional Design Notes

### Imagery & Photography

**Profile Avatars:**
- Use initials on gradient background if no image
- Support for image uploads (circular, 1:1 aspect)
- Placeholder avatar for deleted accounts

**Job Category Icons:**
- Use Lucide React icons (consistent with brand)
- 24px size, indigo color for primary, gray for secondary

**Hero Illustrations:**
- Modern, minimalist style
- Should not dominate (subtle in background)
- Relevant to user journey

**Empty States:**
- Custom illustrations (60-80px)
- Friendly tone in messaging
- Clear CTA buttons

### Icons

**Use:** Lucide React or Feather icons
**Sizes:** 20px (default), 24px (larger), 16px (smaller)
**Colors:** Match text colors (primary, secondary, muted)

### Form Validation

**Real-time Validation:**
- Email format check
- Password strength indicator
- Unique username check (debounced API call)

**Error Display:**
- Red border on input
- Error message below input (red text, 14px)
- Icon: ⚠️ or ❌

**Success State:**
- Green border or checkmark icon
- "Email verified" confirmation

### Loading States

**Skeleton Loading:**
- Gray placeholder boxes matching content shape
- Pulse animation
- Used for:
  - Job cards loading
  - Profile information
  - Messages list

**Loading Spinner:**
- Indigo circular spinner (24-32px)
- Used for full-page loads, data fetching

**Inline Loading:**
- Small spinner in button with text disabled
- Or "Loading..." text

---

## ✅ Design Handoff Checklist

- [ ] All pages designed in Figma
- [ ] Component library created (reusable)
- [ ] Variants for all states (hover, focus, disabled, loading)
- [ ] Mobile/tablet/desktop breakpoints
- [ ] Dark mode variants
- [ ] Typography scale documented
- [ ] Color tokens exported
- [ ] Icons library linked
- [ ] Spacing system documented
- [ ] Animation specifications noted
- [ ] Responsive grid system defined
- [ ] Interaction flows documented
- [ ] Empty states designed
- [ ] Error states designed
- [ ] Success states designed
- [ ] Loading states designed

---

## 🎬 Next Steps for Development

1. **Review this prompt** with design team
2. **Create Figma project** with shared library
3. **Design high-fidelity mockups** for all pages
4. **Export components** for developer handoff
5. **Document design tokens** (colors, spacing, typography)
6. **Create interaction specs** (animations, transitions)
7. **Build component library** in code (shadcn/ui)
8. **QA design against spec** before development

---

**Design Approved By:** [Your Name]  
**Design Version:** 1.0  
**Last Updated:** March 31, 2026  

---

## 📞 Support

For questions or design revisions, contact the design team or refer to this document's most recent version in Figma.

**End of Design Prompt**
