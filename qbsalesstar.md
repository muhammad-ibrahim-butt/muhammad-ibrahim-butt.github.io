# QBSalesStar - Project Detail

## Overview

QBSalesStar is a Windows desktop application built to simplify sales, invoicing, inventory, and QuickBooks Desktop workflows for a wholesale distribution business. The application acts as a focused operational layer on top of QuickBooks Desktop, giving the client a cleaner and more specialized interface for day-to-day sales operations while still keeping QuickBooks as the accounting source of truth.

The project was created because the client was using QuickBooks Desktop directly for business operations, but QuickBooks had too many modules, screens, and workflows for the staff's daily needs. Its interface was complex, customization was limited, and some invoice-related calculations were still being handled manually. A key example was category-wise total quantity sold in an invoice, which required extra manual work outside the normal QuickBooks flow.

QBSalesStar solves this by providing a custom desktop application tailored around the client's actual business process: creating sales orders, generating invoices, managing items and pricing, tracking inventory, handling purchase orders, creating pick lists, processing returns, publishing data to a web system, and synchronizing important QuickBooks changes automatically.

## Business Problem

The client needed a practical replacement for operating directly inside the full QuickBooks Desktop UI. QuickBooks Desktop is powerful, but for this business it introduced several operational issues:

- Too many accounting-focused modules were visible to users who only needed sales and inventory workflows.
- Invoice creation involved extra manual calculations.
- Staff had to move through complex QuickBooks screens for routine tasks.
- Customization inside QuickBooks Desktop was limited.
- Product, customer, invoice, price, and inventory data needed to be shared with an external web system.
- Supporting documents such as invoice PDFs and product images needed a reliable upload workflow.
- QuickBooks data changes needed to be reflected outside QuickBooks without requiring users to manually export or re-enter data.

The goal of QBSalesStar was to keep QuickBooks Desktop in the business as the trusted accounting system, but wrap it with a custom operational application that is easier, faster, and better aligned with the client's workflow.

## What the Application Does

QBSalesStar provides a business-specific desktop interface for managing the complete sales and inventory lifecycle. Users can create sales orders, convert orders into invoices, create direct invoices, manage credit and debit memos, add and update inventory items, manage vendors, receive products against purchase orders, generate pick lists, view reports, and synchronize data with QuickBooks Desktop and a remote web API.

The application connects to QuickBooks Desktop through the QuickBooks Desktop SDK and QBFC15 COM libraries. It can query and update QuickBooks records such as customers, items, invoices, vendors, purchase orders, price levels, credit memos, sales reps, ship methods, employees, and customer messages.

The system also includes background integration components:

- `QBEventListener`, a tray application and COM local server that listens to QuickBooks Desktop change events.
- `QBFolderWatcher`, a Windows Service that watches folders for invoice and product files and uploads them to the web API.
- `QBClientConfig`, a setup wizard used to configure each client workstation.
- An installer pipeline that packages the desktop app, helper services, setup scripts, prerequisites, and configuration workflow into a single setup bundle.

## Main User Workflows

### Sales Order Management

The application allows staff to create and manage sales orders through a focused WinForms interface. Users can search customers, search inventory items, add item quantities, adjust order lines, and prepare orders for fulfillment. The sales order workflow is designed around the business's actual ordering process instead of the generic QuickBooks screens.

Prominent capabilities include:

- Customer lookup and selection.
- Item search and item selection.
- Quantity entry through standard and keypad-style quantity forms.
- Existing order viewing and editing.
- Sales order creation.
- Order status tracking.
- Order notes.
- Customer order form generation.
- Progress reporting for order-form creation.
- Conversion of sales orders into invoices.

### Invoice Processing

Invoice creation is one of the central workflows in QBSalesStar. The application supports both invoices created from sales orders and direct invoices created without a prior order.

The invoice workflow was especially important because the client previously had to perform invoice-related calculations manually in QuickBooks. QBSalesStar centralizes those calculations and presents the invoice process through a cleaner UI.

Invoice-related features include:

- Create invoices from sales orders.
- Create direct invoices.
- Update existing invoices.
- View invoice lists and invoice history.
- Publish invoices to a remote web API.
- Retry failed invoice publishing attempts.
- Track invoices that have already been published.
- Upload or associate invoice PDF files through watched folders.
- Generate invoice reports.
- Read invoice history from QuickBooks for customer-specific reporting.

The application also contains local outbox and retry storage for failed invoice publishing, which helps prevent data loss when network or API issues occur.

### Credit Memo and Debit Memo Handling

QBSalesStar supports credit memo and debit memo workflows for returns, adjustments, and customer account corrections.

Credit memo features include:

- Create credit memos through a dedicated form.
- View credit memo details.
- Generate credit memo reports.
- Retry failed credit memo publishing attempts.
- Store failed credit memo records for later retry.
- Process returns and return-related reports.

Debit memo support is also included through a dedicated form.

### Inventory and Item Management

The application provides item management features for wholesale inventory operations. It can create new items in QuickBooks, update local and remote item data, manage pricing, and synchronize item quantities.

Inventory capabilities include:

- Add new inventory items.
- Save created items back into QuickBooks and the local MySQL cache.
- Update item sales prices and purchase costs.
- Update per-item price levels.
- Load active price levels from QuickBooks.
- Manage item locations.
- View item reports by price, location, category, and brand.
- Upload product images.
- Publish product data to the remote API.
- Synchronize product changes based on the last sync timestamp.
- Refresh item cache for faster lookup.
- Track quantity on hand and quantity on sales order.

The system uses local caching so users can search and work with product data more efficiently without repeatedly querying QuickBooks for every operation.

### Purchase Order and Receiving Workflow

QBSalesStar includes purchase order and receiving functionality for inventory replenishment.

Purchase order and receiving features include:

- Load open purchase orders by vendor.
- View purchase order line items with catalog data.
- Receive products against purchase orders.
- Record item receipts.
- Track received items.
- Support return-to-vendor and return-processing workflows.

This gives the client a single operational tool for both sales-side and purchasing-side inventory activities.

### Pick Lists and Fulfillment

The application supports pick-list generation for warehouse or fulfillment staff. Pick lists help staff prepare products for orders without needing to work directly inside QuickBooks.

Pick-list features include:

- Generate pick lists.
- Print pick lists.
- View pick-list reports.
- Use WebView-based pick-list rendering.
- Support item-wise and customer-wise open/back-order reports.

### Back Orders

Back-order tracking is included for orders that cannot be completely fulfilled immediately.

Back-order capabilities include:

- Back-order screens.
- Customer-wise back-order reports.
- Item-wise back-order reports.
- Open order reports.
- Back-order RDLC reports for printing and review.

### Customer and Vendor Management

The application handles customer and vendor data needed for sales and purchasing operations.

Customer features include:

- Customer lookup.
- Customer category management.
- Customer messages.
- Customer balance publishing.
- Customer open balance reporting.
- Customer-specific rates.
- Customer order form generation.

Vendor features include:

- Vendor creation.
- Vendor lookup.
- Vendor synchronization with QuickBooks and the remote system.
- Vendor persistence in the local database.

### Pricing, Promotions, and Tax

QBSalesStar includes multiple pricing and tax tools that were likely difficult to manage through the generic QuickBooks UI alone.

Pricing and tax capabilities include:

- Create and update price levels.
- Update per-item price-level pricing.
- Update standard item prices.
- Manage temporary rates.
- Manage customer-specific rates.
- Manage promotional data.
- Update promotions.
- Configure tax values.
- Generate bill tax and bill return tax reports.
- Manage banned-state pricing and state-specific restrictions.

### Reporting

The project includes many reports built with Microsoft ReportViewer and RDLC files. These reports help staff review sales, invoice, tax, inventory, back-order, and credit memo information without needing to construct reports manually in QuickBooks.

Reporting areas include:

- Invoice reports.
- Credit memo reports.
- Item reports.
- Item reports with price.
- Item reports with location.
- Customer-wise open order reports.
- Customer-wise back-order reports.
- Item-wise open order reports.
- Item-wise back-order reports.
- Bill tax reports.
- Bill return tax reports.
- Pick-list reports.
- Back-order reports.

## QuickBooks Desktop Integration

QuickBooks integration is the core technical foundation of QBSalesStar. The main desktop app uses QBFC15 and QuickBooks COM interop to connect to the configured QuickBooks company file, open sessions, query records, and submit modifications.

The application can work with QuickBooks entities such as:

- Customers.
- Inventory items.
- Vendors.
- Invoices.
- Credit memos.
- Purchase orders.
- Price levels.
- Employees.
- Sales reps.
- Ship methods.
- Customer messages.

The `QBCalls` integration layer handles the session lifecycle, including opening the QuickBooks connection, beginning a session, sending requests, processing responses, and closing the session. It also contains business-specific QuickBooks operations for updating item prices, updating price levels, querying customers, reading invoice history, synchronizing quantities, and working with other QuickBooks records.

## Real-Time QuickBooks Change Synchronization

The solution includes a dedicated `QBEventListener` component for live QuickBooks change events. This component registers as a COM local server and subscribes to QuickBooks Desktop data events.

When a supported QuickBooks record changes, the listener:

1. Receives the QuickBooks event through a COM callback.
2. Parses the event XML.
3. Filters the event by company file when configured.
4. Dispatches the event to the correct entity handler.
5. Re-queries QuickBooks for the latest version of the changed record.
6. Persists the change to MySQL.
7. Posts the change to the remote API when applicable.
8. Writes normalized JSON to an outbox directory.
9. Logs errors and writes failed payloads to a dead-letter location.

Supported live-change entities include:

- Customer.
- Vendor.
- Inventory item.
- Price level.
- Employee.
- Other name.
- Sales rep.
- Ship method.
- Customer message.

This allows external systems and local caches to stay aligned with QuickBooks without depending on manual exports.

## Web API Synchronization

QBSalesStar communicates with a remote PHP/MySQL web API. The desktop app and helper services publish business data such as products, vendors, invoices, customer balances, price levels, and other operational records.

Web synchronization includes:

- Product publishing.
- Invoice publishing.
- Credit memo publishing.
- Customer balance publishing.
- Vendor publishing.
- Price-level synchronization.
- Failed publish retry handling.
- Published invoice tracking by edit sequence.
- API request logging and failure handling.

The application uses local storage and retry services to handle cases where the API is temporarily unavailable.

## File Upload Automation

The `QBFolderWatcher` service automates uploading supporting files to the remote system. It watches configured folders for invoice files and product files.

Typical examples:

- Invoice file: `142165.pdf`
- Product image: `102000721531.png`

The service detects created, changed, or renamed files, waits for files to finish copying, validates file names and extensions, chooses the best file when multiple files exist for the same identifier, and uploads the file to the correct API endpoint.

File watcher features include:

- Runs as a Windows Service.
- Can also run interactively with a system tray icon.
- Watches separate invoice and product folders.
- Supports PDF and common image formats.
- Uses numeric file names as record identifiers.
- Uploads files using multipart form data.
- Retries failed uploads.
- Scans existing files on startup.
- Writes rolling logs.
- Writes a health heartbeat file.
- Supports service restart on crash.

This removes a manual step from the document-management process and gives the client a simple file-drop workflow.

## Local Data Storage and Caching

QBSalesStar uses local and remote storage together:

- SQLite is used for local application cache and offline-friendly lookups.
- MySQL is used for shared business data and synchronization.
- Local settings files store workstation-specific configuration.
- Outbox tables and retry tables track failed invoice and credit memo publishes.
- In-memory caches speed up customer, vendor, and item lookup in the UI.

Local caching improves performance because the app can quickly populate search lists and grids without making every screen depend on a live QuickBooks query.

## Installer and Deployment

The project includes a complete client-machine deployment process. The application is packaged into a setup bundle that installs the main WinForms app, helper services, setup wizard, scripts, and prerequisites.

The installer includes:

- Main `QBSalesStar.exe` desktop application.
- `QBEventListener` tray/COM event listener.
- `QBFolderWatcher` Windows Service.
- `QBClientConfig` setup wizard.
- PowerShell configuration and uninstall scripts.
- Desktop and Start Menu shortcuts.
- WiX Burn bundle for a unified installer.
- Visual Studio Setup Project MSI integration.

The setup wizard collects:

- QuickBooks company file path.
- MySQL connection string.
- Web API base URL.
- Invoice watch folder path.
- Product watch folder path.
- Optional shared configuration path.

It then writes configuration files, encrypts sensitive connection values, registers the QuickBooks event listener, subscribes to QuickBooks events, and installs the folder watcher service.

## Technical Stack

The project uses the following technologies:

- C#.
- .NET Framework 4.8 for the main Windows Forms desktop application.
- .NET 8 for helper applications and services.
- Windows Forms.
- QuickBooks Desktop SDK / QBFC15 COM integration.
- QBXML request and response processing.
- SQLite with System.Data.SQLite.
- MySQL with MySql.Data.
- Newtonsoft.Json.
- Microsoft ReportViewer for RDLC reports.
- Microsoft WebView2.
- ClosedXML and OpenXML for spreadsheet-related workflows.
- iTextSharp for PDF-related functionality.
- Serilog for service logging.
- WiX v5 Burn bundle for installer packaging.
- PowerShell for client configuration automation.

## Architecture Summary

The solution is organized into several major parts:

- `QBSalesStar`: The main WinForms desktop application used by staff.
- `SqlitePlug`: A SQLite helper/data-access project.
- `QBEventListener`: A COM callback and tray application for QuickBooks change events.
- `QBFolderWatcher`: A Windows Service for file-drop upload automation.
- `QBClientConfig`: A setup wizard for workstation configuration.
- `QBSalesStar_Installer`: Installer, bundle, scripts, and deployment tooling.

The main app handles interactive business workflows. The helper components run in the background to synchronize QuickBooks changes and upload supporting files. The installer ties everything together so the application can be deployed reliably on client workstations.

## Prominent Features

- Custom simplified UI over QuickBooks Desktop for sales and inventory staff.
- QuickBooks Desktop read/write integration.
- Sales order creation and invoice conversion.
- Direct invoice creation.
- Automated invoice-related calculations and operational data preparation.
- Credit memo and debit memo handling.
- Purchase order receiving.
- Pick-list generation and printing.
- Back-order tracking.
- Item, vendor, customer, employee, sales rep, ship method, and price-level workflows.
- Item price and price-level updates.
- Promotional and temporary rate management.
- Tax configuration and tax reports.
- Customer balance publishing.
- Product and invoice publishing to a remote API.
- File-drop automation for invoice PDFs and product images.
- Live QuickBooks change-event listener.
- Retry and outbox handling for failed API operations.
- Local SQLite cache for faster lookups.
- MySQL synchronization layer.
- RDLC-based reporting.
- Client setup wizard and production installer.

## Portfolio Description

QBSalesStar is a custom Windows desktop application developed for a wholesale distribution client that relied on QuickBooks Desktop but needed a simpler, faster, and more business-specific operational system. QuickBooks Desktop was being used as the accounting backend, but its UI was too broad and complex for the client's sales workflow, and some invoice calculations were still being handled manually.

I built QBSalesStar as a focused sales and inventory management layer that integrates directly with QuickBooks Desktop. The application supports sales orders, invoices, direct invoices, credit memos, debit memos, purchase orders, item receiving, item and vendor management, price-level updates, customer balances, pick lists, back orders, product publishing, invoice publishing, and detailed reporting.

The system also includes background services for automation. A QuickBooks event listener subscribes to live QuickBooks data changes and synchronizes supported entities to MySQL and a remote web API. A folder watcher service monitors invoice and product folders, automatically uploading invoice PDFs and product images based on numeric identifiers. The deployment package includes a setup wizard, encrypted configuration handling, service installation, QuickBooks event subscription, and a unified installer for client workstations.

The result is a business-specific desktop application that keeps QuickBooks Desktop as the accounting source of truth while giving staff a streamlined interface for the workflows they use every day.

## Business Impact

QBSalesStar reduced the client's dependence on the full QuickBooks Desktop interface for daily operations. Instead of navigating a large accounting system for every task, staff can use a focused application designed around sales, inventory, invoicing, and fulfillment.

The application improves the workflow by:

- Reducing manual invoice calculations.
- Simplifying invoice and sales order creation.
- Making item lookup and quantity entry faster.
- Centralizing reports needed by the business.
- Automating product and invoice synchronization.
- Keeping QuickBooks data aligned with external systems.
- Reducing duplicate data entry.
- Providing retry mechanisms for failed sync operations.
- Making deployment and workstation setup repeatable.

## My Role

The project involved full-stack desktop and integration development across the following areas:

- Windows Forms application development.
- QuickBooks Desktop SDK integration.
- QBXML request/response handling.
- Sales, invoicing, inventory, reporting, and pricing workflows.
- SQLite and MySQL data access.
- Web API synchronization.
- Background Windows Service development.
- COM event listener development for QuickBooks Desktop.
- File-system watcher automation.
- Retry/outbox reliability design.
- Installer and client deployment automation.
- Documentation for deployment and maintenance.

