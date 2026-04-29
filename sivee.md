# Sivee Project Context (Portfolio Draft)

## 1) Project Overview
Sivee is a Laravel 11 web application for job discovery and candidate profile management, with a separate admin panel for managing users, companies, and scraped job listings.

The platform has two main roles:
- **Candidate/User**: signs up, completes onboarding, manages profile/CV/skills, browses jobs, and tracks job interactions.
- **Admin**: logs into a separate admin guard and manages users, companies, and jobs through DataTables-powered CRUD screens.

Core app routes and role split are defined in:
- `routes/web.php`
- `config/auth.php`

## 1.1) Portfolio Context (Provided)
- **Role:** Full-stack developer
- **Implementation ownership:** End-to-end feature ownership (all listed app features)
- **Project duration:** Approximately 2-3 months
- **Team setup:** 3 people (client-facing/coordination, full-stack development, QA/testing)
- **Hosting model:** Shared hosting
- **Production URL:** `https://sivee.ai`

## 2) Business Flows Implemented
### Candidate-facing flows
- User authentication (signup, login, forgot/reset password, logout).
- Google OAuth login via Socialite.
- Email verification flow using signed verification URLs.
- Multi-step onboarding that captures personal details, job preferences, and CV upload.
- Profile management:
  - personal info + profile photo
  - job preferences (industry/title/location/employment type/rates)
  - summary and external links
  - languages, skills, work experience, education, certificates
  - cover letters
  - multiple CV management and default CV selection (`auto_submission` + `default_cv`)
- Job discovery:
  - searchable/filterable listing by query, location, and category
  - list/detail rendering mode
  - job detail page by slug
  - company page with jobs and popularity sort
- Job engagement tracking:
  - job views recorded in `job_views`
  - CTA/button clicks tracked in `user_click_tracks`

Primary controllers:
- `app/Http/Controllers/AuthController.php`
- `app/Http/Controllers/ProfileController.php`
- `app/Http/Controllers/HomeController.php`
- `app/Http/Controllers/JobController.php`
- `app/Http/Controllers/NotificationController.php`

### Admin-facing flows
- Admin login via separate `admin` guard.
- Admin dashboard showing:
  - monthly total clicks
  - per-company click stats segmented by button type (`1_click`, `company`)
- User management:
  - list, activate/deactivate, delete
- Company management:
  - list, edit metadata/logo, activate/deactivate, delete
  - activating/deactivating a company cascades job `active` state updates
- Job management:
  - list, activate/deactivate, delete
  - manual scrape trigger for a selected company (with limit)

Primary admin controllers:
- `app/Http/Controllers/Admin/HomeController.php`
- `app/Http/Controllers/Admin/UserController.php`
- `app/Http/Controllers/Admin/CompanyController.php`
- `app/Http/Controllers/Admin/JobController.php`

## 3) Job Scraping Architecture
Sivee imports jobs through domain-specific scraper endpoints configured in `scrape_domains`.

Implementation:
- `ScrapeDomain::scrapeJobs()` builds a request to `https://{API_URL}/api/extract-jobs` with `url`, `site_id`, and `limit`.
- Job payloads are normalized and inserted/upserted by `CompanyJob::InsertJobs()`.
- The scheduled command `app:scrape-jobs` runs daily and:
  1. iterates active scrape domains
  2. finds matching company by name
  3. marks existing active jobs inactive for that domain/company
  4. inserts latest jobs

Relevant files:
- `app/Models/ScrapeDomain.php`
- `app/Models/CompanyJob.php`
- `app/Console/Commands/ScrapeJobs.php`
- `routes/console.php`

## 4) Data Model Summary
Main entities:
- `users`, `admins`
- `companies`, `company_jobs`, `scrape_domains`
- `job_infos`, `user_c_v_s`, `cover_letters`
- `skills`, `languages`, pivot tables (`user_skills`, `user_languages`)
- `work_experiences`, `user_education`, `user_certificates`
- `job_views`, `user_click_tracks`
- Laravel defaults for auth/session/cache/queue/notifications

Notable relationships:
- User has one `jobInfo`, many CVs, many profile sub-records, many-to-many skills/languages.
- Company has many jobs.
- CompanyJob belongs to company, has many views/clicks.

Migrations are in `database/migrations` and include custom schema additions from 2024-06 through 2025-01.

## 5) Tech Stack
### Backend
- PHP `^8.2`
- Laravel `^11.9`
- MySQL (from `.env.example`)
- Queue + notifications + scheduled commands

### Key packages
- `laravel/socialite` (Google auth)
- `cviebrock/eloquent-sluggable` (company/job slugs)
- `yajra/laravel-datatables` (admin data grids)

### Frontend
- Blade templates
- jQuery + Bootstrap assets under `public/assets` and `public/admin/assets`
- Vite scaffolding exists (`vite.config.js`, `resources/js`, `resources/css`), while much UI is served from static assets in `public/`

## 6) Security/Access Patterns in Code
- Separate auth guards for users and admins (`config/auth.php`).
- Route-level middleware for onboarding and launch-gating:
  - `CheckBoardingDone`
  - `ComingSoonMiddleware`
- Email verification support via `MustVerifyEmail` on `User`.
- Passwords are hashed through model casts.

## 7) Notification and Email Flows
- Account created notification (mail + database).
- Verification email (mail with temporary signed URL).
- Reset password email (mail with broker token route).
- These are dispatched through queue jobs:
  - `SendAccountCreatedEmailJob`
  - `SendVerificationEmailJob`
  - `SendResetPasswordEmailJob`

## 8) Portfolio-Ready Talking Points (Code-Verified)
- Built a dual-guard Laravel platform with separate candidate and admin experiences.
- Implemented end-to-end candidate profile lifecycle, including structured CV and career metadata.
- Designed a scraping ingestion pipeline with daily scheduling and idempotent upsert behavior.
- Added engagement analytics (`views` + `click tracks`) and admin-level monthly aggregations.
- Integrated OAuth (Google), email verification, reset-password, and asynchronous notification delivery.

## 8.1) Public Product Positioning (Live Site Verified on 2026-04-29)
From the live site homepage (`https://sivee.ai`), Sivee positions itself around:
- AI-assisted job discovery
- Real-time job availability messaging
- 1-click account/application workflow messaging
- Offline/automated job submission messaging
- User flow emphasis: profile + CV upload -> preferences -> apply

These points are based on currently visible homepage copy and align with major implemented flows in the codebase.

## 9) Important Observations from Current Code
- The repository README is still the default Laravel README and does not describe Sivee-specific setup/workflows.
- The `coming-soon` middleware currently redirects most authenticated users (except `root@sivee.ai`) to signup; this appears to be a launch-gating rule and may be intentional for restricted rollout.
- There is minimal automated test coverage in the repository (`tests/Feature/ExampleTest.php`, `tests/Unit/ExampleTest.php`).

## 10) Details Needed From You (Not Inferable from Code)
Confirmed from your input:
- Role, timeline, team, deployment model, and implementation ownership are now included.

Still unavailable (and not inferable from code alone):
- Measurable outcomes/KPIs (traffic, retention, application conversion, scrape volume/day, latency improvements, etc.).

Note: I did **not** add fabricated impact metrics. If you later share any real numbers (even rough internal ranges), I can add a stronger impact section immediately.
