# WEPROCESS Laravel Backend - Detailed Project Context

## Project Overview

WEPROCESS (https://weprocess.co.uk/) is a Laravel-based backend platform for managing legal process serving operations. The system supports the full lifecycle of a service instruction, from client onboarding and serve creation through driver assignment, field attempts, evidence capture, Statement of Service generation, invoicing, notifications, chat, and external system synchronization.

The project is built as a production API backend for three main user groups:

- **Clients**, who create and track service instructions, manage billing, view dashboards, approve sub-serve requests, and communicate with support or drivers.
- **Drivers / process servers**, who receive available serves, claim or start assignments, record service attempts, upload evidence, update location data, and track earnings.
- **Administrators**, who manage users, clients, serves, invoices, discounts, driver documents, service plans, police communication, Salesforce-originated work, and operational reporting.

The backend is not a simple CRUD application. It contains workflow-heavy business logic around legal service states, financial rules, document processing, AI extraction, real-time messaging, queue processing, scheduled maintenance, and integrations with third-party services.

## Technology Stack

- **Framework:** Laravel 10
- **Language:** PHP 8.1+
- **Authentication:** Laravel Sanctum with separate guards for users, clients, and admins
- **Database:** Relational database managed through Laravel migrations and Eloquent models
- **Queues:** Laravel database queues for document extraction, email dispatch, notifications, and background processing
- **Realtime / Broadcasting:** Laravel broadcasting with Pusher-compatible infrastructure
- **Payments:** Stripe integration for checkout and payment session retrieval
- **AI / Document Processing:** Azure Document Intelligence and Azure OpenAI
- **Notifications:** Laravel notifications, Firebase Cloud Messaging, email jobs, and realtime chat events
- **PDF Generation:** FPDI / FPDF for Statement of Service PDF creation
- **External Integrations:** Salesforce webhooks, Firebase Cloud Messaging, Stripe, Azure AI services, Google API client
- **Testing:** PHPUnit feature and unit tests for controllers, authentication, profile services, invoices, chat, banks, notifications, and serve flows

## My Work and Responsibilities

My work on this project focused on building and maintaining the backend systems that power the WEPROCESS operational platform. The codebase shows responsibility across API design, domain modeling, service-layer architecture, integration work, background processing, validation, reporting, and production operations.

Key areas of work include:

- Designing Laravel API endpoints for clients, admins, and drivers with clear authentication boundaries.
- Building service-layer business logic for serve creation, assignment, cancellation, completion, archiving, driver claiming, sub-serves, activity logs, and admin updates.
- Implementing invoice generation, invoice item calculation, legal aid billing rules, VAT handling, discounts, fixed-fee invoices, invoice reminders, refunds, and invoice exports.
- Integrating Salesforce webhooks to create serves from external CRM data and append documents to existing serves.
- Building an AI-assisted document extraction pipeline using Azure Document Intelligence and Azure OpenAI to fill missing serve fields from uploaded legal documents.
- Implementing Statement of Service generation using PDF templates, attempt data, signatures, recipient details, and service outcome logic.
- Building real-time chat between admins, clients, and drivers, including message read states, editing, unsending, media uploads, export to CSV/TXT, and session updates.
- Creating notification flows for serve status changes, new messages, sub-serve actions, invoice payments, driver account approval, client updates, and serve completion.
- Adding scheduled jobs and console commands for queue processing, invoice reminders, stale extraction checks, location purging, storage maintenance, postal code imports, invoice exports, and operational backfills.
- Structuring the codebase with repositories, interfaces, DTOs, services, request validation classes, policies, resources, enums, custom exceptions, jobs, events, notifications, and console commands.

## Core Product Domains

### 1. Authentication and Role Separation

The platform supports three major authenticated identities: admins, clients, and users/drivers. Each role has its own operational permissions and API surface.

The API routes are organized around:

- Public registration and login endpoints.
- User-specific protected routes for process servers.
- Client-specific protected routes for client dashboards, serve creation, payments, and billing.
- Admin-specific protected routes for operational control and reporting.
- Shared authenticated routes for viewing serves, invoices, chat sessions, messages, notifications, and user/client details.

The project uses dedicated middleware such as `auth:user`, `auth:client`, `auth:admin`, `auth.any`, guard-specific middleware, token validation, and Salesforce webhook validation. This separation makes the backend suitable for a multi-portal product where each type of user sees and performs different actions.

### 2. Serve / Instruction Management

The serve workflow is the central domain of the application. A serve represents a legal service instruction with applicant details, respondent details, court data, service plan, documents, payment method, priority, deadline, assigned driver, attempts, invoices, chat, and status transitions.

Important capabilities include:

- Creating serves from the client portal.
- Creating serves from Salesforce webhooks.
- Uploading and appending legal documents.
- Applying service plans and pricing.
- Applying discount codes.
- Calculating VAT and total amounts.
- Assigning and unassigning drivers.
- Allowing drivers to claim available serves.
- Starting a serve.
- Logging delivery attempts with location, evidence, signature, confirmation methods, and recipient interaction data.
- Supporting successful service, failed service, non-service, substituted service, and letterbox-style flows.
- Handling sub-serve requests, approvals, updates, and completion.
- Archiving, unarchiving, deleting, and bulk deleting serves.
- Force-completing serves from the admin portal.
- Releasing ON_HOLD instructions back to NEW after required fields are completed.
- Recording activity logs for operational traceability.

The serve domain is implemented with a service-oriented approach. `ServeService` coordinates repositories, file uploads, invoices, notifications, chat sessions, availability, Statement of Service generation, postal code validation, and discounts. This keeps controllers thinner and centralizes the main business rules.

### 3. Driver / Process Server Workflow

The backend supports a driver-facing workflow where process servers can:

- Register and submit applications.
- Update profile and availability information.
- Receive serve notifications.
- Claim or start available serves.
- Record attempt data from the field.
- Upload evidence, drop evidence, and signatures.
- Send location pings.
- Track user-specific serve statistics.
- View pending invoices and earnings.
- Receive admin instructions and account approval/rejection notifications.

Driver location tracking is supported through user location records, location index APIs, and a scheduled purge command that removes older location records in batches. Driver documents and DBS files can also be managed by administrators.

### 4. Client Portal Backend

The client side of the platform includes:

- Client registration and login.
- Password reset and OTP validation flows.
- Dashboard summaries.
- Serve status reporting.
- Requested serve reporting.
- Serve creation.
- Stripe checkout session creation and retrieval.
- Discount validation.
- Invoice viewing.
- Client profile updates.
- Sub-serve request approval.
- Chat with admins or drivers.

The backend also supports client records created automatically from Salesforce account data, including welcome email delivery with generated credentials.

### 5. Admin Operations

Admins have the broadest operational control. The admin API includes:

- Dashboard summary data.
- Completed serves by driver.
- Serve status analytics.
- Invoice status analytics.
- New serve rate reporting.
- Client-level and driver-level summaries.
- User access control and hired status updates.
- Client access and billing updates.
- Serve assignment, unassignment, archiving, unarchiving, force completion, service type changes, and document management.
- Discount CRUD.
- Invoice generation, export, updates, deletion, refund handling, and summary reporting.
- Driver document and DBS file management.
- Police contact management and Court SOS email workflows.
- OTP generation and validation for admin-sensitive operations.

This gives the application the shape of an operational back office rather than only an API for a frontend app.

## AI and Document Extraction Pipeline

One of the more advanced parts of the project is the AI-assisted extraction pipeline for Salesforce-created serves.

When a serve is created from Salesforce, the incoming payload may be missing respondent or applicant details. The backend can detect missing fields and decide whether extraction is required. If required, it creates the serve in a draft or pending extraction state and dispatches background jobs.

The extraction pipeline works broadly as follows:

1. Salesforce sends serve data and document URLs through a secured webhook.
2. The backend downloads the documents and stores them with the serve.
3. If documents include formats that need conversion, a document conversion job runs before extraction.
4. Azure Document Intelligence reads the legal documents and extracts raw text.
5. Azure OpenAI receives the combined extracted text and target field list.
6. The system maps extracted structured fields back onto the serve.
7. Confidence and extraction status are stored.
8. If all required release fields are present, the serve can move to `NEW`.
9. If required fields are still missing, the serve moves to `ON_HOLD` and admins/clients are notified.

The implementation also handles partial failures. If some documents fail Azure processing but others succeed, the pipeline can continue and log failed document details. This is important for operational reliability because a single bad document should not always block an entire instruction if useful data can still be extracted from the remaining files.

## Salesforce Integration

The Salesforce webhook integration allows external CRM data to create or update WEPROCESS serves.

Implemented capabilities include:

- Secure webhook routes protected by Salesforce signature validation.
- Find-or-create client behavior based on Salesforce account ID and email.
- Automatic client creation from Salesforce account data.
- Downloading external Salesforce document URLs.
- Preserving document labels when storing files.
- Creating a `CreateServeDTO` from Salesforce payload data.
- Storing Salesforce opportunity and WEPROCESS request identifiers on serves.
- Triggering AI extraction when required fields are missing.
- Adding more documents to an existing serve through a webhook.
- Synchronizing legal aid subserve invoice line items when documents change.

This integration connects the operational backend to the sales/client intake process and reduces manual re-entry of legal service instructions.

## Statement of Service and PDF Generation

The backend generates Statement of Service documents from real attempt data. This feature uses FPDI/FPDF and a PDF template stored in application storage.

The generated documents include:

- Court case number.
- Applicant and respondent references.
- Court name.
- Recipient name and address.
- List of served documents.
- Driver/process server name.
- Date.
- Signature image.
- Statement title and statement body.
- Statement of truth content.

The Statement of Service logic adapts to different service outcomes:

- Personal service.
- Attempted service.
- Failed service.
- Non-service.
- Substituted service.
- Letterbox document posting.
- Immediate non-service cases.

The service also handles signature image conversion for PDF compatibility and queues completion emails after successful document generation.

## Invoicing and Billing

The invoice system supports both client-facing and driver-facing financial flows.

Key capabilities include:

- Invoice creation for clients and users/drivers.
- Unique invoice number generation with database locking and retry handling.
- Invoice status transitions such as generated, pending, paid, refunded, and not required.
- Paid and refunded timestamp handling.
- Notifications when invoices are paid.
- Invoice deletion with serve status rollback.
- Invoice summaries and exports.
- Invoice reminders through scheduled commands.
- Line item generation based on service type, payment method, fixed-fee rules, legal aid rules, mileage, travel time, waiting time, document count, and attempts.
- VAT and discount recalculation.
- Legal aid fixed-fee auto-generation.
- Per-document fee handling for legal aid subserve workflows.

This part of the system contains business-specific billing logic rather than generic invoice records only.

## Realtime Chat and Communication

The project includes a full chat subsystem for communication between admins, clients, and users/drivers.

Features include:

- Admin-client chat sessions.
- Admin-user chat sessions.
- Client-user chat sessions.
- Text and media messages.
- Read receipts.
- Unread counts.
- Latest message summaries.
- Realtime broadcast events for sent messages, read messages, edited messages, unsent messages, and session updates.
- Message editing with time limits.
- Message unsending with media cleanup.
- Serve-specific message filtering.
- Chat export to CSV or TXT over a selected date range.

This provides operational communication directly inside the platform, reducing dependence on external messaging channels.

## Notifications, Emails, and Background Jobs

The backend uses Laravel notifications, queued jobs, broadcast events, FCM, and email classes to keep users informed about workflow events.

Notification examples include:

- Serve created.
- Serve assigned or unassigned.
- Serve claimed or unclaimed.
- Serve started.
- Serve completed.
- Serve archived or unarchived.
- Serve cancellation request and action.
- Serve review.
- Serve on hold.
- Sub-serve request, approval, and completion.
- New chat message.
- Invoice paid.
- User account approval, rejection, and verification.
- Additional user instructions.

Queued jobs include:

- Document conversion.
- Document extraction.
- Serve creation notification dispatch.
- OTP emails.
- Attempt notification emails.
- Invoice created emails.
- Invoice reminder emails.
- Serve completion emails.
- Court SOS to police emails.

The scheduled tasks run queue processing, invoice reminders, old location purging, and stuck extraction monitoring.

## Postal Codes, Geolocation, and Areas

The backend includes support for UK postal code validation and search.

Functionality includes:

- Postal code import commands.
- Searchable postal code records.
- City/district listing.
- Postal code validation.
- Postal code lookup by district.
- Address geocoding and validation.
- Distance calculation for mileage-based invoice line items.
- Driver location indexing and cleanup.

This supports serve assignment, client entry validation, reporting, and accurate mileage calculations.

## Police and Court SOS Workflows

The project includes police-related functionality for sending Court SOS communication.

The backend includes:

- Police and police email models.
- Police seed data.
- Admin APIs for listing and viewing police records.
- Admin endpoint for sending police-related records.
- Mail classes and jobs for Court SOS to police communication.

This reflects the legal and compliance-oriented nature of the application, where completed service documents may need to be routed to external agencies.

## Architecture and Code Organization

The project uses a layered Laravel architecture:

- **Controllers** handle HTTP entry points and response formatting.
- **Request classes** centralize validation rules.
- **Services** contain business logic and workflow orchestration.
- **Repositories and interfaces** abstract database access for major entities.
- **DTOs** carry structured data between layers.
- **Enums** model fixed domain states such as serve statuses, invoice statuses, attempt statuses, client types, payment methods, priorities, and sub-serve types.
- **Resources** format API responses.
- **Jobs** move slow or unreliable operations into background processing.
- **Notifications and events** handle realtime and asynchronous user communication.
- **Policies and middleware** enforce access rules and request validation.
- **Custom exceptions** provide domain-specific error handling.
- **Console commands** support operational maintenance and backfills.

This structure helps keep the code maintainable as the product grows in workflow complexity.

## Data Model Highlights

Major models in the system include:

- `User` for drivers/process servers.
- `Client` for customers and legal firms.
- `Admin` for internal operators.
- `Serve` for legal service instructions.
- `UserServe` for driver assignment and serve-driver state.
- `Attempt` for field service attempts.
- `SubServeRequest` and `SubServeAttempt` for substituted service flows.
- `Invoice`, `InvoiceItem`, and `InvoiceItemDetail` for billing.
- `ChatSession` and `ChatMessage` for realtime communication.
- `Notification` records through Laravel notification infrastructure.
- `ServicePlan` for pricing, VAT, attempts, rates, and delivery rules.
- `Discount` for promotional or business discounts.
- `PostalCode`, `Police`, `PoliceEmail`, `Bank`, `BankDetail`, `DriverDocument`, `ServeReview`, `ServeCancelRequest`, and `UserLocation`.

The migrations show continuous evolution of the product, including changes to serve statuses, Salesforce fields, extraction fields, invoice items, postal code indexing, location cleanup, driver documents, legal aid billing, and more.

## API Design

The API is organized by role and business capability.

Examples of exposed capabilities:

- `/register`, `/login`, `/forgot/password`, `/otp/verify`, and `/change/password` for user authentication.
- `/clients/register`, `/clients/login`, `/clients/dashboard/summary`, and `/clients/dashboard/serves-status` for client workflows.
- `/admins/login`, `/admins/dashboard/summary`, and admin-specific reporting routes.
- `/serves` for listing, creating, showing, reviewing, updating, assigning, claiming, starting, archiving, and completing serves.
- `/chat/sessions`, `/chat/{id}/messages`, `/chat/send-message`, and chat export routes.
- `/notifications` for notification listing and read status.
- `/invoices` and `/admin/invoices` for invoice viewing, generation, update, export, and deletion.
- `/stripe/checkout` and `/stripe/session/retrieve` for payment processing.
- `/postcodes` routes for validation and search.
- `/webhooks/salesforce/serve/create` and `/webhooks/salesforce/add-more-documents` for Salesforce integration.

The routes are grouped with middleware that clearly maps each endpoint to the identities allowed to use it.

## Reliability and Production Operations

The project includes several production-oriented features:

- Queue processing through scheduled commands and queue listeners.
- Supervisor-friendly queue worker instructions.
- `php artisan schedule:run` deployment guidance.
- Invoice reminders scheduled on weekdays.
- Location purging for old driver tracking data.
- Stuck AI extraction detection every ten minutes.
- Storage cleanup commands.
- Commands for importing postal codes, exporting invoices, geocoding drivers, backfilling invoice items, migrating failed serves, and completing serves.
- Logging around document downloads, AI extraction, Salesforce webhook processing, invoice generation, notification dispatch, and PDF generation.
- Error handling through custom domain exceptions and consistent API responses.

These details show that the backend was built with real operational support in mind, not just local development.

## Testing Coverage

The repository includes both feature and unit tests.

Test areas include:

- Authentication controllers.
- Client authentication.
- User authentication services.
- Client authentication services.
- Client profile service.
- User profile service.
- Bank controller.
- Chat controller.
- Client controller.
- Invoice controller.
- Notification controller.
- Serve controller.
- User controller.

The tests help validate the API behavior and service-level business logic around the most important application flows.

## Why This Project Matters

This project demonstrates my ability to work on a complex backend system with real business rules, multiple user roles, external integrations, asynchronous processing, and production maintenance needs.

The strongest technical aspects of the work are:

- Building a domain-driven Laravel backend around complex legal process-serving workflows.
- Managing stateful business flows where status transitions matter.
- Designing APIs for multiple portals and role types.
- Integrating AI document extraction into an operational workflow.
- Connecting Salesforce intake data to internal service execution.
- Generating legal PDF documents from structured field data and field evidence.
- Handling invoices with business-specific pricing, VAT, discounts, and legal aid rules.
- Supporting realtime chat and notifications across admins, clients, and drivers.
- Using queues and scheduled commands to keep slow or recurring work out of request-response flows.
- Keeping code organized through services, repositories, DTOs, enums, requests, resources, jobs, notifications, and custom exceptions.

For a portfolio, this project represents a backend system that required more than framework knowledge. It required understanding workflow design, data integrity, operational reliability, third-party integrations, document automation, financial logic, and maintainable architecture in a growing production codebase.
