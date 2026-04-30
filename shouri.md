# Shouri Project Context

## Project Overview

Shouri is a live social challenge platform built around community participation, creator engagement, competitive submissions, and reward-based interaction. The product connects users, creators, communities, and brands through challenge-based content where users can create challenges, submit video entries, vote through likes, follow creators, participate in discussions, and earn rewards through winning challenge submissions.

The platform is not only a backend prototype or internal tool. Shouri is publicly available across the major user channels:

- Web application: https://app.getshouri.com/
- iOS App Store: https://apps.apple.com/us/app/shouri/id6476094112?l=fr-FR
- Google Play Store: https://play.google.com/store/apps/details?id=com.shouri.sports.mobileapp&pli=1

This multi-platform availability is an important success signal because it shows that the product moved beyond development into real public distribution across web, iPhone, and Android.

## Product Positioning

Shouri is positioned as a social networking experience where challenge participation becomes the core engagement loop. Instead of only consuming content, users are encouraged to create, compete, vote, follow, comment, and build reputation inside a community-driven environment.

The product combines several strong engagement models:

- User-generated challenges
- Sponsored or brand-friendly challenge opportunities
- Video submissions
- Community voting
- Creator profiles
- Follow-based discovery
- Wallet balances and withdrawals
- Winner rewards
- Push notifications
- Ranking and recognition

This gives Shouri a stronger product story than a simple content feed. The app is designed around repeat participation: users return to check challenge results, view submissions, receive notifications, vote, improve rankings, and withdraw earned rewards.

## Public Success Indicators

Shouri already has visible public traction and production credibility:

- The Android app is listed on Google Play with 100K+ downloads.
- The iOS app is live on the Apple App Store under the Social Networking category.
- The product has a public web experience at app.getshouri.com with feed, profile, wallet, messages, notifications, upload, settings, and app download flows.
- The App Store listing shows ongoing product maintenance, including version updates and app improvements.
- The Play Store listing presents Shouri as a complete social experience with challenges, voting, subscriptions, profile types, cards, and payout functionality.
- The backend contains real production-grade modules for authentication, user management, challenge lifecycle handling, submissions, wallet history, withdrawals, admin review, moderation, and push notifications.

These points show that Shouri is a serious shipped product with real distribution, an active product surface, and a backend architecture supporting monetization and community growth.

## Core User Experience

Shouri's user experience is built around challenges. A user can join the platform, create a profile, follow other users, browse challenges, submit video content, vote on submissions, comment, and receive updates as activity happens.

The public web app also reinforces this flow with sections such as:

- Home feed
- Profile
- Wallet
- Messages
- Notifications
- Settings
- Upload
- Download app prompts
- Challenge feed filters such as For You, Followings, Specials, and Open

The product therefore supports both discovery and conversion. A visitor can view the public web experience and is encouraged to continue into the full mobile app for richer functionality.

## Main Features

### User Accounts and Authentication

The backend supports user registration, login, logout, password reset, profile updates, email OTP verification, phone-based checks, and social provider support for TikTok, Facebook, Instagram, and Google identifiers. User sessions are handled through Laravel Sanctum API tokens.

Important account features include:

- Username-based registration and login
- Email verification through OTP
- Password reset support
- Phone number validation with country dial code handling
- Social provider account support
- FCM token storage for push notifications
- Time zone awareness through request headers
- Account deletion
- Active and inactive account states

### Profiles and Social Graph

Users can follow and unfollow each other, view follower lists, search users, and see profile-level statistics. The user model exposes follower counts and total submission counts, giving each profile measurable social activity.

The app also supports blocking and unblocking users, which is important for user safety and content control in a social platform.

### Challenge Creation

Authenticated users can create challenges with:

- Title
- Description
- Tags
- Entry fee
- Deadline duration
- Thumbnail
- Trailer video
- Optional access code

Challenge media is uploaded to AWS S3, which is a scalable production-ready storage choice for image and video assets. Tags are normalized and stored so challenges can be searched and filtered.

The challenge duration rules require a minimum of 24 hours and a maximum of 72 hours, creating a controlled challenge lifecycle that keeps competitions active without becoming stale.

### Challenge Discovery and Filtering

The API supports listing challenges, searching by title, and filtering by tags. Each challenge response can include:

- Creator information
- Human-readable tag names
- Like state
- Follow state
- Share count
- Comment count
- Participant count
- View count
- Lock state for access-code challenges

This gives the frontend enough structured data to create rich challenge cards and feeds.

### Video Submissions

Users can submit video entries to active challenges. Each submission includes a video file and thumbnail, with media uploaded to S3. The backend validates challenge status, payment requirements, and supported payment gateways.

Supported payment gateway values include:

- PayPal
- Google Pay
- Apple Pay
- Wallet

The submission system also records transactions or wallet deductions when a challenge requires a fee.

### Voting, Likes, Views, Shares, and Comments

Shouri supports the core interaction mechanics expected from a social challenge platform:

- Challenge likes
- Submission likes
- Challenge comments
- Submission comments
- Comment likes
- Challenge views
- Submission views
- Challenge shares
- Submission shares

These engagement signals drive discovery, rankings, notifications, and winner selection.

### Winner Selection and Rewards

The challenge model includes logic for assigning winners based on submission likes. When a challenge ends, the backend evaluates submissions, identifies the winning submission, calculates reward distribution, updates the winner's wallet balance, records balance history, creates admin earning records, and stores the challenge winner record.

If there is a tie in submission likes, the challenge can be extended by one hour. This is a thoughtful product rule because it prevents unfair automatic winner selection when multiple submissions have equal top engagement.

Reward handling includes:

- Total reward calculation from participant fees
- Winner reward percentage
- Admin earning percentage
- Balance updates
- Wallet history records
- Winner notification
- Submission rank assignment

This reward loop is one of the strongest business-value parts of the project because it directly connects engagement with monetization.

### Wallet, Bank Details, and Withdrawals

Users have wallet balances and can store bank or PayPal withdrawal information. The backend includes withdrawal request handling, admin approval/rejection states, balance history, and user notifications when withdrawal requests are responded to.

Supported withdrawal request statuses are:

- Pending
- Accepted
- Rejected

This shows that Shouri includes a practical money-flow system, not just content interaction.

### Push Notifications

The backend includes a queued push notification job using Firebase Cloud Messaging. Notifications are created for major user events, including:

- New challenge created
- Challenge liked
- Challenge commented
- Challenge ended
- Challenge winner selected
- New follower
- New submission
- Submission liked
- Submission commented
- Rank updated
- Withdrawal request responded

Users also have notification settings, allowing them to control which categories they receive. Notifications are stored in the database and new notification counts are tracked per user.

### Ranking System

Shouri includes monthly rank calculation based on challenge likes and submission likes. The scheduled command calculates user rankings near the end of each month, stores rank history, updates current ranks, and sends rank update notifications when a user's rank changes.

This gives the platform a long-term retention mechanic. Users can compete not only inside individual challenges but also across the whole platform through monthly performance.

### Moderation and Safety

The project includes moderation features that are important for a public social app:

- Content reporting
- Report reasons
- Admin review of content reports
- Accept or reject report actions
- User blocking
- Hidden content from blocked users
- Admin user status management
- Account deletion support

These features show that the product was built with public community management in mind.

### Admin Dashboard

The Laravel web admin panel includes management sections for:

- Dashboard
- Users
- Challenges
- Submissions
- Challenge winners
- Withdrawal requests
- Settings
- Support messages
- Content reports
- Password management

The admin panel uses server-side Laravel views and DataTables support, giving operators a practical way to monitor and manage the platform.

## Backend Architecture

The backend is built with Laravel 10 and PHP 8.1. It uses a structured API and admin architecture with controllers, models, migrations, jobs, commands, seeders, helpers, and Blade views.

Key backend technologies and packages include:

- Laravel 10
- PHP 8.1
- Laravel Sanctum for API authentication
- AWS SDK and Flysystem S3 adapter for cloud file storage
- SendGrid for email delivery
- Firebase Cloud Messaging helper integration for push notifications
- Laravel queues for background notification work
- Laravel scheduler for automated lifecycle tasks
- Yajra DataTables for admin data management

The architecture separates mobile/API behavior from admin web behavior. API routes serve the mobile and web client experience, while web routes power the admin dashboard.

## Scheduled Automation

The platform includes scheduled backend jobs that keep the app operating without manual admin work:

- Challenges are checked and deactivated every three minutes.
- User rankings are calculated monthly near the end of the month.

This automation is important because the core product depends on timed competitions, winner calculation, and ranking updates.

## Database Scope

The database schema supports a wide range of product domains:

- Users
- Admins
- Countries, states, and cities
- Followers
- Tags
- Challenges
- Submissions
- Challenge comments
- Submission comments
- Likes
- Views
- Shares
- Transactions
- Balance histories
- Bank details
- Withdrawal requests
- Challenge winners
- Admin earnings
- Settings
- Support messages
- Notifications
- Notification settings
- Rank histories
- Content reports
- Report reasons
- Blocked users
- Email verifications

This schema shows that the backend is designed for a complete social-commerce challenge platform rather than a narrow MVP.

## Monetization and Business Value

Shouri has multiple product paths that can support business growth:

- Challenge entry fees
- Winner rewards
- Admin earning percentage from challenge pools
- Paid subscriptions mentioned in the public listings
- Sponsored challenge opportunities
- Agency or business profile positioning
- Wallet and payout infrastructure
- Brand-community engagement through challenge campaigns

The monetization model is especially strong because it aligns user motivation with platform activity. Users are encouraged to participate, create quality submissions, earn votes, win rewards, and return for future challenges.

## Why This Project Is a Strong Portfolio Case Study

Shouri demonstrates more than basic CRUD development. It includes public launch readiness, app store distribution, social networking mechanics, payments-related logic, reward calculation, media handling, admin tooling, scheduled automation, and notification infrastructure.

Notable strengths include:

- Publicly launched on web, iOS, and Android
- Google Play listing with 100K+ downloads
- Real user engagement mechanics through challenges, submissions, likes, comments, follows, shares, and views
- Production-style media handling with S3
- Token-based API authentication
- Push notification system with queued delivery
- Wallet, balance, withdrawal, and reward workflows
- Admin moderation and management dashboard
- Automated challenge lifecycle and monthly ranking system
- Safety features such as reporting, blocking, and account deletion

These points make Shouri easy to position as a successful, full-featured social platform with a clear product identity and visible market presence.

## Project Summary

Shouri is a complete challenge-based social networking platform where users can create competitions, submit videos, vote, follow creators, win rewards, and manage wallet payouts. The product is already available publicly through the web, Apple App Store, and Google Play Store, with the Android listing showing 100K+ downloads.

From a technical perspective, the project includes a Laravel API backend, admin dashboard, media storage, authentication, social interactions, notifications, ranking, moderation, wallet accounting, withdrawals, and scheduled background automation. From a business perspective, Shouri combines social engagement, creator participation, brand opportunities, and reward-based monetization into one platform.

This makes the project a credible success story: it is shipped, discoverable, multi-platform, feature-rich, and built around a clear engagement and revenue model.
