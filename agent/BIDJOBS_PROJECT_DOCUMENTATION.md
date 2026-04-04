# BidJobs - Complete Project Documentation

**Project Owner:** Islam Samy  
**Build Date:** March 2026  
**Stack:** Next.js 15+, shadcn/ui, Supabase, TypeScript  
**Status:** Production-Ready Architecture

---

## 📋 Project Overview

BidJobs is a modern job marketplace platform that connects employers with freelancers and jobseekers. The platform enables job posting, bidding, profile management, and community engagement with a sophisticated payment and rating system and bidding system .

### Core Value Proposition
- **For Employers:** Post jobs, review bids, hire talent, manage payments
- **For Jobseekers:** Browse jobs, submit bids, showcase portfolios, build reputation
- **For Community:** Share knowledge, build professional networks, discuss industry topics

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
│        (Next.js 15+ App Router + shadcn/ui)                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Dashboard   │  │  Job Browse  │  │  Profile     │       │
│  │  Pages       │  │  & Search    │  │  Management  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│             API Layer (Next.js Route Handlers)               │
│        /api/auth, /api/jobs, /api/bids, /api/users          │
├─────────────────────────────────────────────────────────────┤
│                  Backend Services                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     Supabase (PostgreSQL + Real-time)                │   │
│  │     Authentication | Database | File Storage         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project File Structure

```
bidjobs/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── layout.tsx
│   │   └── components/
│   │       ├── DashboardNav.tsx
│   │       └── DashboardStats.tsx
│   │
│   ├── jobs/
│   │   ├── page.tsx (Browse Jobs - Main)
│   │   ├── [id]/
│   │   │   ├── page.tsx (Job Details)
│   │   │   ├── bids/page.tsx (View Bids)
│   │   │   └── layout.tsx
│   │   ├── create/page.tsx (Create Job)
│   │   └── search/page.tsx (Job Search + Filters)
│   │
│   ├── seekers/
│   │   ├── page.tsx (Browse Seekers)
│   │   ├── [id]/page.tsx (Seeker Profile)
│   │   └── my-profile/page.tsx (My Profile)
│   │
│   ├── messages/
│   │   ├── page.tsx (Messages List)
│   │   ├── [conversationId]/page.tsx (Conversation)
│   │   └── components/
│   │       ├── MessageThread.tsx
│   │       └── ChatInput.tsx
│   │
│   ├── community/
│   │   ├── page.tsx (Community Feed)
│   │   ├── [postId]/page.tsx (Post Details)
│   │   ├── create/page.tsx (Create Post)
│   │   └── components/
│   │       ├── PostCard.tsx
│   │       └── CommentSection.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── sign-up/route.ts
│   │   │   ├── sign-in/route.ts
│   │   │   ├── sign-out/route.ts
│   │   │   └── refresh-token/route.ts
│   │   │
│   │   ├── jobs/
│   │   │   ├── route.ts (GET all, POST create)
│   │   │   ├── [id]/route.ts (GET, PATCH, DELETE)
│   │   │   ├── search/route.ts (Search with filters)
│   │   │   └── [id]/publish/route.ts
│   │   │
│   │   ├── bids/
│   │   │   ├── route.ts (GET, POST)
│   │   │   ├── [id]/route.ts (GET, PATCH, DELETE)
│   │   │   └── [id]/accept/route.ts
│   │   │
│   │   ├── users/
│   │   │   ├── route.ts (GET profile)
│   │   │   ├── [id]/route.ts (GET user profile)
│   │   │   └── [id]/update/route.ts
│   │   │
│   │   ├── messages/
│   │   │   ├── route.ts (GET conversations)
│   │   │   ├── [conversationId]/route.ts
│   │   │   └── send/route.ts
│   │   │
│   │   ├── community/
│   │   │   ├── posts/route.ts
│   │   │   ├── posts/[id]/comments/route.ts
│   │   │   └── posts/[id]/like/route.ts
│   │   │
│   │   └── upload/
│   │       └── avatar/route.ts
│   │
│   ├── layout.tsx
│   ├── page.tsx (Landing Page)
│   └── not-found.tsx
│
├── components/
│   ├── ui/ (shadcn components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── tabs.tsx
│   │   ├── pagination.tsx
│   │   ├── star-rating.tsx
│   │   └── form.tsx
│   │
│   ├── shared/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── NotificationBell.tsx
│   │
│   └── features/
│       ├── JobCard.tsx
│       ├── JobFilter.tsx
│       ├── BidCard.tsx
│       ├── UserCard.tsx
│       ├── SeekerCard.tsx
│       ├── ProfileHeader.tsx
│       └── RatingStars.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── types.ts
│   │   └── hooks.ts
│   │
│   ├── api/
│   │   ├── jobs.ts
│   │   ├── bids.ts
│   │   ├── users.ts
│   │   ├── messages.ts
│   │   ├── community.ts
│   │   └── auth.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── jobs.ts
│   │   ├── users.ts
│   │   └── community.ts
│   │
│   ├── utils/
│   │   ├── cn.ts (className merger)
│   │   ├── currency.ts
│   │   ├── date-format.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   │
│   └── hooks/
│       ├── useAuth.ts
│       ├── useJobs.ts
│       ├── useBids.ts
│       └── useMessages.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   └── logo.svg
│
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── animations.css
│
├── .env.local
├── .env.example
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 🗄️ Database Schema (Supabase PostgreSQL)

### 1. **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  avatar_url TEXT,
  bio TEXT,
  user_type ENUM('employer', 'jobseeker', 'both'),
  phone VARCHAR,
  location VARCHAR,
  verified_email BOOLEAN DEFAULT FALSE,
  verified_phone BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. **User Profiles Table**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- For Jobseekers
  hourly_rate DECIMAL,
  skills TEXT[],
  experience_level ENUM('entry', 'intermediate', 'expert'),
  portfolio_url TEXT,
  certifications TEXT[],
  
  -- For Employers
  company_name VARCHAR,
  company_size ENUM('1-10', '11-50', '51-200', '200+'),
  industry VARCHAR,
  
  -- Common
  verified BOOLEAN DEFAULT FALSE,
  response_time_hours INTEGER,
  total_jobs_posted INTEGER DEFAULT 0,
  total_hires INTEGER DEFAULT 0,
  
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. **Jobs Table**
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR,
  subcategory VARCHAR,
  skills_required TEXT[],
  
  budget_type ENUM('fixed', 'hourly'),
  budget_min DECIMAL,
  budget_max DECIMAL,
  
  experience_level ENUM('entry', 'intermediate', 'expert'),
  duration ENUM('less_than_1_week', '1_week_to_1_month', '1_to_3_months', '3_to_6_months', 'more_than_6_months'),
  
  status ENUM('draft', 'open', 'in_progress', 'completed', 'closed'),
  visibility ENUM('public', 'private'),
  
  bids_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  published_at TIMESTAMP
);
```

### 4. **Bids Table**
```sql
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  seeker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  amount DECIMAL NOT NULL,
  proposal TEXT NOT NULL,
  delivery_days INTEGER,
  
  status ENUM('pending', 'accepted', 'rejected', 'withdrawn'),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. **Contracts Table**
```sql
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id),
  bid_id UUID REFERENCES bids(id),
  employer_id UUID REFERENCES users(id),
  freelancer_id UUID REFERENCES users(id),
  
  amount DECIMAL NOT NULL,
  status ENUM('active', 'pending_payment', 'completed', 'disputed', 'cancelled'),
  
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. **Reviews/Ratings Table**
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id),
  reviewer_id UUID REFERENCES users(id),
  reviewed_user_id UUID REFERENCES users(id),
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  categories JSONB, -- {communication, quality, timeliness, payment}
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. **Messages Table**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1_id UUID REFERENCES users(id),
  participant_2_id UUID REFERENCES users(id),
  
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(participant_1_id, participant_2_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8. **Community Posts Table**
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR,
  tags TEXT[],
  
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  
  status ENUM('published', 'draft', 'archived'),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 9. **Saved/Favorites Table**
```sql
CREATE TABLE saved_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);
```

---

## 🔐 Authentication Flow

### Implementation: Supabase Auth + Next.js Middleware

```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// middleware.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createServerComponentClient()
  const { data } = await supabase.auth.getSession()
  
  // Protected routes
  if (!data.session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/jobs/create', '/messages/:path*']
}
```

### Sign-Up Flow
1. User fills registration form (email, password, user type)
2. Validate input → Create Supabase Auth user
3. Create user profile in PostgreSQL
4. Send verification email
5. Redirect to dashboard on success

### Sign-In Flow
1. User enters credentials
2. Authenticate via Supabase Auth
3. Retrieve session token
4. Set secure HTTP-only cookie
5. Redirect to dashboard

---

## 🎯 Core Features & Pages

### 1. **Authentication Pages**

#### Sign In Page (`/sign-in`)
- Email/password login
- Google OAuth integration
- "Forgot Password" link
- Sign-up redirect
- Session persistence

#### Sign Up Page (`/sign-up`)
- Email registration
- Password strength validator
- User type selection (Employer/Jobseeker/Both)
- Terms & conditions acceptance
- Email verification

#### Forgot/Reset Password
- Email input for recovery
- Reset token validation
- New password form

---

### 2. **Job Management**

#### Browse Jobs Page (`/jobs`)
**Features:**
- Grid/list toggle view
- Search by title/keywords
- Filters:
  - Category & Subcategory
  - Budget range (fixed/hourly)
  - Experience level
  - Duration
  - Job status
- Pagination (12 per page)
- Sort options (newest, budget, trending)
- Save job to favorites
- Job card preview

**Job Card Component:**
```tsx
// JobCard.tsx
- Job title
- Employer avatar & name
- Budget display
- Skills badges
- Experience level badge
- Duration indicator
- Bid count
- Save button
- View details link
```

#### Job Details Page (`/jobs/[id]`)
**Sections:**
- Header with job title, budget, status
- Job description (rich text)
- Skills required (tags)
- Employer profile card
  - Company info
  - Rating & reviews count
  - Response time
- Activity timeline
- Bids section (for employers only)
- Action buttons (Place Bid / Manage Bids)

#### Create Job Page (`/jobs/create`)
**Form Fields:**
- Title (required)
- Description (rich text editor)
- Category selection
- Skills required (multi-select searchable)
- Budget type (fixed/hourly)
- Budget range (min/max)
- Experience level
- Duration estimate
- Job visibility (public/private)
- Save as draft / Publish
- Preview before posting

#### Search & Filter Page (`/jobs/search`)
- Advanced filtering interface
- Real-time search results
- Applied filters display
- Clear filters button
- Save search preferences

---

### 3. **Bidding System**

#### Place Bid Modal/Page (`/jobs/[id]/bid`)
**Form:**
- Bid amount (auto-calculated based on job type)
- Proposal text (rich text)
- Delivery timeline (days)
- Attachments upload
- Portfolio links
- Submit / Cancel buttons

#### Manage Bids Page (`/jobs/[id]/bids`)
**For Employers:**
- Table view of all bids
- Seeker profile preview on hover
- Sort by amount, date, rating
- Accept/Reject/Request revision actions
- Message seeker button
- Shortlist bid

**For Jobseekers:**
- My bids list
- Status badges (pending, accepted, rejected)
- Withdrawal option
- Edit bid option

---

### 4. **User Profiles**

#### My Profile Page (`/seekers/my-profile`)
**Sections:**
- Profile header with avatar, name, bio
- Profile completion percentage
- Contact information
  - Email
  - Phone
  - Location
- Professional details
  - Hourly rate
  - Skills (editable tags)
  - Experience level
  - Certifications
  - Portfolio links
  - Languages
- Activity & Statistics
  - Jobs completed
  - Total earnings
  - Success rate
  - Response time
- Reviews & Ratings
  - Rating stars
  - Individual reviews
  - Review breakdown by category
- Edit Profile button
- Portfolio management

#### Browse Seekers Page (`/seekers`)
**Features:**
- Seeker cards grid
- Filter by:
  - Skills
  - Hourly rate range
  - Experience level
  - Location
  - Rating
- Seeker card shows:
  - Avatar & name
  - Headline
  - Hourly rate
  - Top skills
  - Rating & review count
  - Jobs completed
  - View profile link

#### Seeker Profile View (`/seekers/[id]`)
- Read-only profile view (same sections as My Profile)
- Hire/Message buttons
- Add to favorites

#### Employer Profile View
**For Employers:**
- Company name & logo
- Company description
- Company size
- Industry
- Verified badge (if applicable)
- Jobs posted count
- Hires made
- Rating from freelancers
- Contact information

---

### 5. **Messaging System**

#### Messages Page (`/messages`)
**Left Sidebar:**
- Conversations list
- Search conversations
- Unread badge count
- Last message preview
- Timestamp
- Online status indicator

**Main Chat Area:**
- Message thread
- Typing indicator
- Read receipts
- Emoji reactions
- File attachment preview
- Message timestamps
- User avatar

#### Conversation View (`/messages/[conversationId]`)
- Full chat history with pagination
- Real-time message updates
- Auto-scroll to latest message
- User info header with:
  - Avatar
  - Name
  - Online status
  - Last seen
  - Profile link
- Message input area
- Attachment upload
- Emoji picker

**Features:**
- Real-time updates using Supabase Realtime
- Message search
- Conversation archive
- Block user option
- Report conversation

---

### 6. **Community Section**

#### Community Feed Page (`/community`)
**Features:**
- Post feed (newest/trending)
- Create post button
- Post cards showing:
  - Author avatar & name
  - Post title
  - Preview text
  - Tags
  - Views, Likes, Comments count
  - Category badge
- Filter by:
  - Category
  - Tags
  - Your posts
  - Following
- Pagination

#### Community Post Detail (`/community/[postId]`)
**Sections:**
- Post content (rich text)
- Author info with follow button
- Like button
- Share button
- Comment section with:
  - Existing comments thread
  - Reply functionality
  - Comment sorting
  - Like on comments
- Related posts sidebar

#### Create Post Page (`/community/create`)
**Form:**
- Title
- Content (rich text editor)
- Category selection
- Tags input
- Featured image
- Draft/Publish
- Preview

---

### 7. **Dashboard**

#### Main Dashboard (`/dashboard`)
**For Employers:**
- Welcome message
- Quick stats
  - Active jobs count
  - Total bids received
  - Pending messages
  - Total spent
- Recent activity
  - New bids
  - Job completion updates
  - Messages
- Action buttons
  - Post new job
  - Manage jobs
  - View bids
- Charts
  - Spending overview (monthly)
  - Hires by month

**For Jobseekers:**
- Welcome message
- Quick stats
  - Active bids count
  - Total earnings
  - Jobs completed
  - Rating
- Recent activity
  - Bid status updates
  - Messages
  - Contract updates
- Action buttons
  - Browse jobs
  - My bids
  - View contracts
- Charts
  - Earnings overview (monthly)
  - Applications vs Success rate

---

## 🔧 API Routes

### Authentication API
```
POST   /api/auth/sign-up
POST   /api/auth/sign-in
POST   /api/auth/sign-out
POST   /api/auth/refresh-token
GET    /api/auth/session
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Jobs API
```
GET    /api/jobs                 // List all jobs with pagination
POST   /api/jobs                 // Create job
GET    /api/jobs/[id]            // Get job details
PATCH  /api/jobs/[id]            // Update job
DELETE /api/jobs/[id]            // Delete job
POST   /api/jobs/[id]/publish    // Publish job
POST   /api/jobs/search          // Advanced search with filters
GET    /api/jobs/trending        // Trending jobs
GET    /api/jobs/my-posts        // Employer's jobs
```

### Bids API
```
GET    /api/bids                 // List bids (filtered by user)
POST   /api/bids                 // Place a bid
GET    /api/bids/[id]            // Get bid details
PATCH  /api/bids/[id]            // Update bid
DELETE /api/bids/[id]            // Withdraw bid
POST   /api/bids/[id]/accept     // Accept bid (employer)
POST   /api/bids/[id]/reject     // Reject bid (employer)
```

### Users API
```
GET    /api/users                // Get current user profile
GET    /api/users/[id]           // Get user profile by ID
PATCH  /api/users/[id]           // Update user profile
POST   /api/users/[id]/avatar    // Upload avatar
GET    /api/users/[id]/reviews   // Get user reviews
POST   /api/users/[id]/follow    // Follow user
```

### Messages API
```
GET    /api/messages             // Get conversations
GET    /api/messages/[id]        // Get conversation messages
POST   /api/messages/send        // Send message
GET    /api/messages/search      // Search messages
POST   /api/messages/[id]/read   // Mark as read
```

### Community API
```
GET    /api/community/posts              // Get posts
POST   /api/community/posts              // Create post
GET    /api/community/posts/[id]         // Get post details
PATCH  /api/community/posts/[id]         // Update post
DELETE /api/community/posts/[id]         // Delete post
POST   /api/community/posts/[id]/like    // Like post
POST   /api/community/posts/[id]/comments // Add comment
GET    /api/community/posts/[id]/comments // Get comments
```

### File Upload API
```
POST   /api/upload/avatar        // Upload avatar image
POST   /api/upload/portfolio     // Upload portfolio images
POST   /api/upload/attachment    // Upload message attachment
```

---

## 🎨 UI Component Library (shadcn)

### Core Components to Implement

```
✅ Button          - Primary, Secondary, Outlined, Ghost
✅ Input           - Text, Email, Password, Number
✅ Card            - With header, footer, content sections
✅ Dialog/Modal    - For confirmations, forms
✅ Dropdown Menu   - User menu, action menus
✅ Avatar          - User profiles, comments
✅ Badge           - Status, category, skill tags
✅ Tabs            - Profile sections, dashboard tabs
✅ Pagination      - Job listing, search results
✅ Toast/Alert     - Notifications, errors
✅ Skeleton        - Loading states
✅ Progress        - Profile completion
✅ Tooltip         - Helpful hints
✅ Separator       - Visual dividers
✅ Checkbox        - Multi-select filters
✅ Radio           - Single select options
✅ Select          - Dropdown options
```

### Custom Components Built on shadcn

```typescript
// StarRating.tsx - 1-5 star rating
// RichTextEditor.tsx - Job description, proposals
// ImageUploader.tsx - Avatar, portfolio images
// SkillInput.tsx - Multi-select skill tags
// CurrencyInput.tsx - Budget amount input
// DateRange.tsx - Job duration picker
// CategoryPicker.tsx - Hierarchical category select
```

---

## 🔐 Security Considerations

### Authentication & Authorization
- ✅ Row Level Security (RLS) on all tables
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ CSRF protection with Next.js middleware
- ✅ Rate limiting on API endpoints
- ✅ Input validation & sanitization

### Data Protection
- ✅ Sensitive data encrypted (payment info)
- ✅ PII not exposed in API responses
- ✅ User emails masked in some contexts
- ✅ Password hashing with bcrypt
- ✅ Session timeout after 24 hours

### File Uploads
- ✅ File type validation (images only)
- ✅ File size limits (max 5MB per file)
- ✅ Virus scanning on upload
- ✅ CDN for image delivery

---

## 📊 Data Models & Types

### TypeScript Types

```typescript
// lib/types/index.ts

// User Types
interface User {
  id: string
  email: string
  username: string
  full_name: string
  avatar_url: string
  bio: string
  user_type: 'employer' | 'jobseeker' | 'both'
  verified_email: boolean
  created_at: string
}

// Job Types
interface Job {
  id: string
  employer_id: string
  title: string
  description: string
  category: string
  skills_required: string[]
  budget_type: 'fixed' | 'hourly'
  budget_min: number
  budget_max: number
  status: 'draft' | 'open' | 'in_progress' | 'completed'
  bids_count: number
  created_at: string
  published_at: string
}

// Bid Types
interface Bid {
  id: string
  job_id: string
  seeker_id: string
  amount: number
  proposal: string
  delivery_days: number
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  created_at: string
}

// Message Types
interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

// Review Types
interface Review {
  id: string
  contract_id: string
  reviewer_id: string
  reviewed_user_id: string
  rating: number
  comment: string
  created_at: string
}
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Project setup (Next.js, shadcn, Supabase)
- [ ] Database schema creation
- [ ] Authentication system
- [ ] User profile pages
- [ ] Basic styling & theming

### Phase 2: Core Features (Weeks 3-5)
- [ ] Job listing & details
- [ ] Job creation form
- [ ] Bidding system
- [ ] Search & filters
- [ ] Dashboard pages

### Phase 3: Community & Messaging (Weeks 6-7)
- [ ] Messaging system with real-time
- [ ] Community posts & comments
- [ ] Real-time notifications
- [ ] User notifications

### Phase 4: Polish & Launch (Weeks 8-9)
- [ ] Testing (unit, integration, e2e)
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Launch preparation
- [ ] Analytics setup

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.7.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-css": "^3.3.0",
    "tailwindcss-animate": "^1.0.6",
    "zod": "^3.22.0",
    "react-hook-form": "^7.47.0",
    "axios": "^1.5.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.292.0",
    "next-themes": "^0.2.1"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 🔗 Integration Points

### Payment Gateway (Future)
- Stripe integration for payments
- Escrow system for job completion
- Automatic fund release

### Email Notifications
- SendGrid for transactional emails
- Email templates for:
  - Job posted confirmation
  - Bid received notification
  - Job completion notice
  - Review request

### Analytics
- PostHog for product analytics
- Mixpanel for user behavior
- Google Analytics for traffic

### External APIs
- Google OAuth for social login
- AWS S3 for file storage
- SendGrid for emails

---

## 🎯 Success Metrics

- User retention rate
- Job completion rate
- Average bid response time
- User rating distribution
- Platform growth rate
- Payment success rate
- Customer support response time

---

## 📚 Additional Resources

### Supabase Guides
- [Supabase PostgreSQL Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

### Next.js Resources
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [API Routes Guide](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### shadcn/ui
- [Component Library](https://ui.shadcn.com)
- [Installation Guide](https://ui.shadcn.com/docs/installation/next)

---

## ✅ Checklist for Development

```
Setup & Configuration
□ Initialize Next.js 15 project
□ Install & configure shadcn/ui
□ Setup Supabase project
□ Configure environment variables
□ Setup TypeScript strict mode
□ Configure ESLint & Prettier

Database
□ Create all database tables
□ Setup Row Level Security (RLS) policies
□ Create indexes for performance
□ Setup database triggers for updated_at
□ Create backup strategy

Authentication
□ Implement sign-up flow
□ Implement sign-in flow
□ Setup session management
□ Implement forgot password
□ Setup email verification

Core Features
□ Job CRUD operations
□ Bidding system
□ User profiles
□ Messaging system
□ Community feature

Frontend
□ Build all page layouts
□ Implement navigation
□ Create responsive design
□ Setup dark mode (if needed)
□ Implement loading states

Testing & Optimization
□ Unit tests for utilities
□ Integration tests for API
□ Performance testing
□ SEO optimization
□ Accessibility checks

Deployment
□ Setup Vercel deployment
□ Configure domain & SSL
□ Setup analytics
□ Create admin dashboard
□ Setup monitoring
```

---

**Last Updated:** March 31, 2026  
**Version:** 1.0.0  
**Status:** Ready for Development
