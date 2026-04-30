# Sema Tax Report - US Sales Tax Automation

## Project Overview

Sema Tax Report is a Windows desktop application built to automate US sales tax reporting for a business that manages invoices, purchases, inventory items, customers, vendors, and company data through QuickBooks Desktop. The project focuses on automating state-specific sales tax calculation across the United States by combining QuickBooks transaction data with a local MySQL tax-rule database.

The application eliminates a manual process where invoice lines, item quantities, product categories, taxable units, customer details, and state tax values had to be reviewed and calculated by hand. Instead, the system imports transactions from QuickBooks, enriches every line item with item master data, applies the correct tax rule for the selected US state, highlights missing tax data, calculates tax totals, and exports ready-to-use reports.

The main automation objective was to calculate US sales tax according to each state's rule by maintaining state-wise unit tax records for every item and applying those rules to invoice and purchase lines based on the destination or vendor state.

## Portfolio Summary

This project demonstrates end-to-end automation of a real accounting and compliance workflow:

- Automated QuickBooks Desktop invoice and bill imports.
- Automated US state-wise sales tax calculation.
- Built a local MySQL data model for tax rules, companies, states, customers, vendors, invoices, bills, and inventory items.
- Added item-level tax configuration by UPC and state.
- Added dirty-record detection to identify missing unit volume, pack quantity, stick count, or tax data.
- Generated Excel reports for tax filing and customer-level review.
- Added the ability to create tax invoices back into QuickBooks.
- Built a WinForms interface for finance/accounting users to import, filter, correct, calculate, and export tax data without manually editing spreadsheets.

## Business Problem

The business needed to calculate sales tax for tobacco, vapor, cigar, hookah, wrap, and similar product categories sold across different US states. Each state can have different tax handling, and the tax depends on item-specific information such as:

- Item UPC or item code.
- Catalog category.
- Catalog brand.
- Product description.
- Unit ml/mg.
- Quantity in pack.
- Stick count.
- Quantity sold.
- Destination state.
- State-specific unit tax.

Manual tax reporting was time-consuming and error-prone because the data existed across multiple systems:

- QuickBooks held invoices, bills, customers, vendors, line items, and transaction dates.
- Item master data was needed to know volume, pack size, and stick count.
- State tax rules were needed per UPC and state.
- Excel reports were required for filing and review.

The application centralizes this process and turns it into a repeatable workflow.

## Core Automation Goal

The core goal was to automate US sales tax calculation according to each state's rules. The system does this through the `item_master_tax` table, where every tax rule is stored against:

- `upc_code`
- `state_code`
- `unit_tax`
- `stick_tax`

When a user selects a state, the application loads that state's tax rules into memory and applies the correct `unit_tax` to each matching item code. The tax is calculated as:

```text
Tax = Unit Tax x Quantity
```

The system also calculates supporting taxable values:

```text
Extended Taxable Amount = Unit ml/mg x Quantity
Total No. Of Sticks Sold = Stick Count x Quantity
```

These calculated fields are used in invoice views, bill views, totals, Excel exports, and QuickBooks tax invoice creation.

## Technology Stack

- Language: C#
- Framework: .NET Framework 4.7.2
- UI: Windows Forms
- Accounting integration: QuickBooks Desktop through QBFC15 COM library
- Database: MySQL / MariaDB
- Excel integration: Microsoft Office Interop Excel and EPPlus
- CSV processing: CsvHelper
- JSON processing: Newtonsoft.Json
- Database connector: MySql.Data
- Project type: Windows desktop executable
- Solution: `SemaTaxReport.sln`
- Main project: `SemaTaxReport.csproj`

## Application Entry Point

The application starts from `Program.cs`, which initializes WinForms and opens `MainMenu`.

`MainMenu` is an MDI parent form. It loads the active QuickBooks company, stores it in global state, enables the menu, and opens child forms for the main workflows:

- Invoices tax automation.
- Purchases/bills tax automation.
- Items list and state tax maintenance.
- Add item.
- Settings.

## Main UI Modules

### Main Menu

File: `MainMenu.cs`

Responsibilities:

- Loads the active QuickBooks company.
- Uses saved company data when the QuickBooks company file has not changed.
- Fetches company details from QuickBooks when the selected company file changes.
- Stores active company context in `GlobalState.CurrentCompany`.
- Opens application modules as MDI child forms.

Available modules:

- `FormInvoices`
- `BillsTax`
- `ItemsList`
- `AddItem`
- `Settings`

### Invoice Tax Automation

File: `FormInvoices.cs`

This is the main sales tax automation screen.

Responsibilities:

- Imports invoices from QuickBooks for a selected date range.
- Defaults the date range to the previous month.
- Displays invoice line items in a DataGridView.
- Filters invoices by state.
- Filters invoices by catalog category.
- Supports views such as dirty records, item-level view, and customer-level view.
- Loads state-wise tax rules when a state is selected.
- Applies item tax values to every invoice line.
- Calculates taxable amount, stick totals, and tax totals.
- Groups records and adds total rows.
- Highlights records with invalid or missing calculation data.
- Allows correction of item master fields and unit tax.
- Updates MySQL item and tax tables.
- Exports tax reports to Excel.
- Exports calculated tax invoices back into QuickBooks.

Important calculated columns:

- `Unit ml/mg`
- `Quantity In Pack`
- `Stick Count`
- `Extended Taxable Amount`
- `Total No. Of Sticks Sold`
- `Unit Tax`
- `Tax`

Dirty-record detection flags rows where one or more required calculation fields are missing or zero:

- Missing or zero unit ml/mg.
- Missing or zero quantity in pack.
- Missing or zero stick count.
- Missing tax value for the selected state.

### Purchase / Bills Tax Automation

File: `BillsTax.cs`

This module imports and calculates tax data for QuickBooks bills and purchase records.

Responsibilities:

- Imports bills from QuickBooks for a selected date range.
- Defaults the date range to the previous month.
- Loads purchase line items into a DataGridView.
- Filters purchase records by state and category.
- Loads state tax rules.
- Applies unit tax to bill line items.
- Calculates extended taxable amount and tax.
- Adds grouped vendor totals and grand tax totals.
- Highlights dirty records.
- Allows correction of item master and state tax values.
- Updates the `item` and `item_master_tax` tables.

The purchase workflow mirrors the invoice workflow, making the same tax-rule engine usable for both sales and purchases.

### Item Master Management

File: `ItemsList.cs`

This screen maintains item master and state tax data.

Responsibilities:

- Loads all US states from the `state` table.
- Defaults state selection to Wisconsin.
- Loads categories linked to the current company.
- Filters items by state, category, and search text.
- Displays each item with UPC, brand, description, unit volume, quantity in pack, stick count, state code, and unit tax.
- Supports dirty-record filtering.
- Allows editing of calculation-critical fields.
- Updates item master data in the `item` table.
- Updates or creates state tax records in `item_master_tax`.

This module is important because the accuracy of automated tax calculation depends on complete item master data and state-wise tax values.

### Add Item

File: `AddItem.cs`

This screen creates a new item and its state tax configuration.

Responsibilities:

- Loads state list from the database.
- Loads brand values from existing item records.
- Loads categories from the database.
- Validates UPC, unit volume, quantity in pack, stick count, and unit tax.
- Inserts a new item into the `item` table.
- Links the item to a category through `item_category`.
- Adds the item's state tax rule into `item_master_tax`.

### Settings

Files:

- `Settings.cs`
- `Classes/AppConfigManager.cs`

The Settings screen manages application configuration.

Configurable values:

- Application name.
- Environment.
- QuickBooks company file path.
- MySQL server.
- Database name.
- Database user.
- Database password.

Configuration is stored in `appsettings.json` in the application base directory. The database password is encrypted using AES before it is saved.

The settings module also includes:

- QuickBooks company file picker for `.qbw` files.
- MySQL connection test.
- Company-file-changed flag so the app knows when to reload company data from QuickBooks.

## QuickBooks Integration

Files:

- `QuickBook.cs`
- `Services/QuickBookService.cs`

The project integrates with QuickBooks Desktop using QBFC15.

QuickBooks connection behavior:

- Opens a QBFC session using the configured application name and company file.
- Creates request message sets for QuickBooks queries.
- Sends requests using `DoRequests`.
- Closes QuickBooks sessions and connections after operations.

Supported QuickBooks operations:

- Get active company details.
- Import vendors.
- Import customers.
- Import inventory items.
- Import non-inventory items.
- Import price levels.
- Import invoices for a date range.
- Import bills for a date range.
- Fetch individual customer details.
- Create tax invoices back in QuickBooks.

### Company Import

The app retrieves company name and address from QuickBooks and stores the active company in MySQL. This company context is used for category mappings, default category rules, reports, and generated tax invoices.

### Customer Import and FEIN Handling

Customer data is imported from QuickBooks and stored locally. During invoice import, the app attempts to populate customer FEIN from local customer data. If it is missing, the app queries QuickBooks for the customer's resale number and stores it as `customerFein`.

This is important for Excel tax report generation because missing FEIN values are reported back to the user.

### Invoice Import

Invoice import process:

1. User selects a date range.
2. The app checks for cached invoice data for that date range.
3. If cache exists, it loads the DataTable from JSON.
4. If cache does not exist, it queries QuickBooks invoices with line items.
5. It imports invoice headers into the `invoice` table.
6. It imports invoice line items into the `invoice_detail` table.
7. It extracts QuickBooks custom fields:
   - `Catalog Category`
   - `Catalog Brand`
8. It creates missing categories for the active company.
9. It enriches the result with item master fields.
10. It displays the final data in the invoice grid.

### Bill Import

Bill import process:

1. User selects a date range.
2. The app checks for cached bill data.
3. If cache exists, it loads the DataTable from JSON.
4. If cache does not exist, it queries QuickBooks bills with line items.
5. It imports bill headers into `bills`.
6. It imports line items into `bill_details`.
7. It extracts shipping lines and calculates shipping cost per item in `bills_shipping`.
8. It extracts QuickBooks custom fields:
   - `Catalog Category`
   - `Catalog Brand`
9. It enriches purchase rows with item master fields.
10. It displays the final data in the bill grid.

### QuickBooks Tax Invoice Creation

The invoice module can create tax invoices back into QuickBooks after calculations are complete.

Before creating QuickBooks invoices, the app validates that no dirty records exist. It then groups total rows by customer list ID and creates QuickBooks invoice lines using the calculated tax amount.

Created QuickBooks tax invoice IDs are stored in `qb_tax_invoices`, preventing duplicate invoice creation for the same invoice number.

## Database Design

Database file:

- `Database/sema_tax_report.sql`

Database name:

- `sema_tax_report`

The database stores QuickBooks data, local item metadata, category mappings, state rules, and generated QuickBooks tax invoice references.

### Core Tables

#### `state`

Stores all 50 US states.

Important fields:

- `Id`
- `StateCode`
- `StateName`

This table is used for state selectors and state-level tax rules.

#### `company`

Stores QuickBooks company details.

Important fields:

- `Id`
- `Name`
- `Address1`
- `City`
- `State`
- `PostalCode`
- `Country`
- `is_active`

#### `customer`

Stores QuickBooks customer records, including billing address, shipping address, tax code fields, price level, balance, resale number, and FEIN-related fields.

Used for:

- Invoice customer mapping.
- FEIN retrieval.
- QuickBooks customer list ID references.

#### `vendor`

Stores QuickBooks vendor records.

Used for:

- Bill and purchase import.
- Vendor-level grouping.
- Vendor address and state information.

#### `invoice`

Stores imported invoice headers.

Important fields:

- `invoiceNumber`
- `invoiceDate`
- `invoiceCompanyName`
- `customerListId`
- `invoiceAddress`
- `invoiceCity`
- `invoiceState`
- `invoiceSalesTaxCode`
- `invoiceTotal`
- `invoiceTimeCreated`
- `invoiceTimeModified`

#### `invoice_detail`

Stores imported invoice line items.

Important fields:

- `invoiceNumber`
- `itemCode`
- `itemQuantity`
- `itemDescription`
- `itemRate`
- `itemAmount`
- `itemCategory`
- `itemBrand`

#### `bills`

Stores imported QuickBooks bill headers.

Important fields:

- `id`
- `vendor`
- `ref_number`
- `city`
- `state`
- `total`
- `is_paid`
- `memo`
- `date`

#### `bill_details`

Stores imported bill line items.

Important fields:

- `bill_id`
- `item_code`
- `item_category`
- `item_brand`
- `item_cost`
- `item_quantity`
- `item_description`

#### `bills_shipping`

Stores shipping allocation for bills.

Important fields:

- `bill_id`
- `total_sticks`
- `shipping_cost`
- `shipping_cost_per_item`

This allows purchase cost to include allocated shipping cost per item.

#### `item`

Stores item master data.

Important fields:

- `upc_code`
- `catalog_brand`
- `description`
- `unit_volume`
- `quantity_in_pack`
- `stick_count`
- `list_id`
- `edit_sequence`
- `full_name`
- `case_upc`
- `msrp`
- `created_at`
- `updated_at`

This table provides the physical product information required for tax calculation.

#### `item_master_tax`

Stores the automated state tax rules.

Important fields:

- `id`
- `upc_code`
- `state_code`
- `unit_tax`
- `stick_tax`

This is the core rule table for state-by-state tax automation.

#### `categories`

Stores product categories by company.

Important fields:

- `id`
- `company_id`
- `name`

Categories are imported from QuickBooks custom fields and linked to the active company.

#### `item_category`

Links items to categories.

Important fields:

- `id`
- `upc_code`
- `category_id`

#### `default_category`

Stores default category selections by company and state.

Important fields:

- `company_id`
- `category_id`
- `state_code`

This helps automate filtering by automatically selecting relevant categories when a state is selected.

#### `qb_tax_invoices`

Stores generated QuickBooks tax invoice references.

Important fields:

- `company_id`
- `invoice_number`
- `qb_list_id`
- `created_at`

This table prevents duplicate QuickBooks tax invoice creation and links calculated tax results back to QuickBooks.

#### `item_inventory`, `item_non_inventory`, and `price_level`

These tables store QuickBooks item and pricing data imported from QuickBooks. They preserve detailed QuickBooks fields for inventory items, non-inventory items, and price levels.

## Tax Calculation Workflow

The automated tax calculation workflow works as follows:

1. Import invoices or bills from QuickBooks.
2. Store transaction headers and line items in MySQL.
3. Load line items into a DataTable.
4. Join item codes with local item master data.
5. Add unit volume, quantity in pack, and stick count to each row.
6. User selects a US state.
7. App loads the state's tax rules from `item_master_tax`.
8. For each line item, match `Item Code` with `upc_code`.
9. Apply the state's `unit_tax`.
10. Calculate tax using quantity.
11. Calculate extended taxable amount.
12. Calculate total sticks sold.
13. Add group totals and grand tax totals.
14. Highlight rows that cannot be calculated safely.
15. Allow user correction directly in the grid.
16. Save corrected item data and state tax data.
17. Export final reports or create QuickBooks tax invoices.

## State Rule Automation

The system supports US state-level automation through state codes. The `state` table includes all 50 states, and `item_master_tax` stores tax values per item and state.

For example, the same item can have different tax values for different states:

```text
UPC A + WI = Wisconsin unit tax
UPC A + CA = California unit tax
UPC A + TX = Texas unit tax
```

This design allows the system to calculate tax based on the selected state without changing application code. Adding or updating a state's tax rule is a data operation, not a code change.

## Data Enrichment

QuickBooks line items alone do not contain every field needed for tax reporting. The app enriches each imported line with local item master data:

- Unit ml/mg from `item.unit_volume`.
- Quantity in pack from `item.quantity_in_pack`.
- Stick count from `item.stick_count`.
- Unit tax from `item_master_tax.unit_tax`.
- Category and brand from QuickBooks custom fields and local category data.

This enrichment step is what turns raw accounting transactions into tax-ready data.

## Dirty Record Handling

Dirty records are records that cannot be trusted for final tax calculation because required values are missing.

The app flags dirty records when:

- Unit ml/mg is missing or zero.
- Quantity in pack is missing or zero.
- Stick count is missing or zero.
- Unit tax is missing for the selected state.

Dirty records are highlighted in the grid with a visible background color. Users can filter to dirty records, correct the values, and save updates back to MySQL.

This feature is critical because it prevents incorrect tax reporting and makes data cleanup part of the automated workflow.

## Reporting

The application supports Excel exports for tax reporting and review.

### TT101 Export

File: `Model/Invoice.cs`

Method:

- `ExportToTT101`

The TT101 export uses a template file named `TT101.xlsx`. It writes invoice data into the expected report format and saves the result under the Reports directory.

The export includes:

- Schedule code.
- Document date.
- Invoice number.
- Customer type.
- Sold-to / ship-to details.
- Customer FEIN.
- Address, city, state, and country.
- Federal product category.
- State product category.
- Price.
- Tax jurisdiction.
- Catalog brand.
- Manufacturer fields.
- Unit description.
- Weight / volume.
- Quantity.
- Stick count.
- Extended taxable amount.
- Product description.

The export also identifies customers with missing FEIN values and displays a warning.

### Customer-Level Export

Method:

- `ExportByCustomer`

This export creates an Excel workbook with invoice-level and customer-level tax totals. It is useful for review, reconciliation, and customer-specific summaries.

## Caching

The application caches imported invoice and bill data as JSON files using date-range-specific cache keys.

Invoice cache format:

```text
cache/invoices_yyyy-MM-dd_yyyy-MM-dd.json
```

Bill cache format:

```text
cache/bills_yyyy-MM-dd_yyyy-MM-dd.json
```

Caching reduces repeated QuickBooks queries for the same reporting period and improves performance during review.

## Bulk Import Strategy

For QuickBooks invoice and bill imports, the application uses CSV temp files and `MySqlBulkLoader`.

Benefits:

- Faster imports compared with row-by-row inserts.
- Handles large transaction sets more efficiently.
- Keeps QuickBooks data import practical for monthly reporting.

Bulk-loaded tables include:

- `invoice`
- `invoice_detail`
- `bills`
- `bill_details`
- `bills_shipping`

## Global Application State

File:

- `Classes/GlobalState.cs`

The app stores shared runtime state such as:

- Current active company.
- MySQL `secure_file_priv` path.

The active company is used by category filtering, default category rules, reports, and QuickBooks tax invoice descriptions.

## Configuration Management

File:

- `Classes/AppConfigManager.cs`

The app uses a singleton configuration manager. It reads and writes `appsettings.json`.

Default configuration includes:

- App name: `Sema Tax Report`
- Environment: `Development`
- Default QuickBooks company file path.
- Server: `localhost`
- Database: `sema_tax_report`
- Database user: `root`
- Database password: encrypted when saved.

The configuration manager supports:

- Loading default config if no config file exists.
- Saving config changes.
- Encrypting database password.
- Decrypting database password for runtime use.
- Dynamic get/set by property name.

## Data Access Layer

Files:

- `Classes/DB.cs`
- `Classes/MySqlDatabase.cs`

`MySqlDatabase` creates MySQL connections using the configured connection string and enables local infile loading through:

```text
AllowLoadLocalInfile=true
```

`DB` provides reusable helpers for:

- Executing non-query SQL.
- Inserting rows from dictionaries.
- Updating rows from dictionaries.
- Reading query results into dictionaries.
- Running parameterized read queries.

## Models and Responsibilities

### `Invoice`

Handles invoice import, invoice table population, grid alignment, TT101 export, and customer-level export.

### `InvoiceDetail`

Represents invoice line item details and supports invoice detail table operations.

### `Bill`

Handles bill import, bill table population, shipping allocation, and grid alignment.

### `BillDetail`

Represents bill line item details and supports bill detail table operations.

### `BillShipping`

Represents bill shipping allocation data.

### `Item`

Handles item existence checks, item creation, item update, and loading item master data for calculations.

### `ItemMasterTax`

Handles state-wise tax rule lookup, creation, and update.

### `Category`

Creates product categories linked to the active company.

### `DefaultCategory`

Stores and updates default product categories by state and company.

### `Company`

Stores QuickBooks company data in the local database.

### `Customer`

Imports and updates QuickBooks customer records.

### `Vendor`

Imports QuickBooks vendor records.

### `InventoryItem`

Represents QuickBooks inventory item data.

### `NonInventoryItem`

Represents QuickBooks non-inventory item data.

### `PriceLevel`

Represents QuickBooks price level data.

### `State`

Represents US state data.

## User Workflow

Typical invoice tax workflow:

1. Open the application.
2. Configure QuickBooks company file and MySQL connection if needed.
3. Application loads active company.
4. Open the Invoices module.
5. Select date range.
6. Import invoices from QuickBooks.
7. Select target state.
8. Application automatically loads state tax rules.
9. Select relevant categories or use default category selections.
10. Review calculated tax rows.
11. Filter dirty records if needed.
12. Correct missing item or tax data.
13. Save corrections.
14. Export TT101 report or customer-level report.
15. Optionally create QuickBooks tax invoices.

Typical purchase tax workflow:

1. Open Purchases/Bills module.
2. Select date range.
3. Import bills from QuickBooks.
4. Select state.
5. Apply state tax rules.
6. Review vendor totals and grand tax totals.
7. Correct dirty records.
8. Save item and tax updates.

Typical item maintenance workflow:

1. Open Items List.
2. Select state.
3. Search item by UPC or description.
4. Filter by category.
5. Review unit volume, pack quantity, stick count, and unit tax.
6. Update missing or incorrect values.
7. Save changes.

## Key Features

- QuickBooks Desktop integration.
- MySQL-backed state tax rule engine.
- State-by-state tax calculation.
- Invoice and bill import by date range.
- Item master enrichment.
- Dirty-record detection.
- Editable tax-critical fields.
- Category and state filtering.
- Default category selection by state.
- Group totals by company, invoice, customer, or vendor.
- Grand tax totals.
- TT101 Excel export.
- Customer-level Excel export.
- QuickBooks tax invoice creation.
- JSON caching for imported transaction data.
- Encrypted database password in local config.
- Bulk MySQL imports for performance.

## Calculation Fields

The project calculates and displays these tax-specific fields:

- `Unit ml/mg`: Product unit volume or measurement.
- `Quantity In Pack`: Number of units in a pack.
- `Stick Count`: Number of sticks represented by the item.
- `Extended Taxable Amount`: Unit ml/mg multiplied by quantity.
- `Total No. Of Sticks Sold`: Stick count multiplied by quantity.
- `Unit Tax`: State-specific tax value for the UPC.
- `Tax`: Unit tax multiplied by quantity.

## Product Category Handling

The app reads QuickBooks custom fields from line items:

- `Catalog Category`
- `Catalog Brand`

Categories are stored locally and associated with the active company. During TT101 export, category values are mapped into federal and state product categories.

Examples from the current export logic:

- `09 Premium Cigar` maps to federal `LARGE CIGAR` and state `Cigar`.
- `06 Hookah Tobacco` and `08-5 Wraps Tobacco` map to federal `OTHER` and state `OTP`.
- Other categories default to vapor-product reporting fields.

## Impact

This project converted a manual tax-reporting workflow into a controlled desktop automation tool. The app reduces manual spreadsheet work, improves consistency, keeps state tax rules centralized, and gives accounting users a way to detect and fix missing tax data before reports are filed.

The most important impact is that state-specific tax logic became data-driven. Instead of rewriting formulas or manually editing spreadsheets for every state, users can maintain tax values in `item_master_tax` and reuse the same workflow across states.

## My Role

I automated the US sales tax calculation workflow according to state-level rules across the USA. My work included building the data flow from QuickBooks to MySQL, implementing the state-wise tax rule lookup, calculating item-level and total tax values, creating dirty-record validation, adding correction workflows, and generating Excel reports for compliance and review.

## Portfolio Description

Sema Tax Report is a C# WinForms automation tool that integrates with QuickBooks Desktop and MySQL to calculate US sales tax based on state-specific rules. The application imports invoices and bills from QuickBooks, enriches each transaction line with local item master data, applies tax rates by UPC and state, calculates taxable volume, stick totals, and tax totals, highlights records with missing calculation data, and exports filing-ready Excel reports. It also supports item tax maintenance and can create calculated tax invoices back into QuickBooks, making the overall sales tax workflow faster, more accurate, and easier to audit.

## Resume Bullet Points

- Built a C# WinForms desktop application to automate US state-wise sales tax calculation for QuickBooks invoice and bill data.
- Integrated QuickBooks Desktop through QBFC15 to import invoices, bills, customers, vendors, inventory items, non-inventory items, price levels, and company information.
- Designed a MySQL-backed tax rule model using item UPC and state code to calculate sales tax according to each US state's rule.
- Implemented item master enrichment for unit volume, pack quantity, stick count, extended taxable amount, total sticks sold, unit tax, and total tax.
- Added dirty-record detection and correction workflows to prevent inaccurate tax reporting caused by missing calculation fields.
- Developed Excel exports including TT101-style tax reporting and customer-level tax summaries.
- Added QuickBooks tax invoice creation and stored generated QuickBooks invoice references to prevent duplicate processing.
- Used bulk loading, caching, and structured DataTable workflows to improve performance for monthly reporting.

## Repository Structure

```text
SemaTaxReport/
  AddItem.cs
  App.config
  BillsTax.cs
  FormInvoices.cs
  ItemsList.cs
  MainMenu.cs
  Program.cs
  QuickBook.cs
  Settings.cs
  SemaTaxReport.csproj
  SemaTaxReport.sln
  Classes/
    AppConfigManager.cs
    DB.cs
    GlobalState.cs
    HelperFunctions.cs
    MySqlDatabase.cs
  Database/
    sema_tax_report.sql
  Model/
    Bill.cs
    BillDetail.cs
    BillShipping.cs
    Category.cs
    Company.cs
    Customer.cs
    DefaultCategory.cs
    InventoryItem.cs
    Invoice.cs
    InvoiceDetail.cs
    Item.cs
    ItemMasterTax.cs
    NonInventoryItem.cs
    PriceLevel.cs
    State.cs
    Vendor.cs
  Resources/
    Icons/
    Samples/
  Services/
    QuickBookService.cs
```

## Final Notes

This project is best presented in a portfolio as an accounting automation and compliance reporting tool. The strongest point is not just that it calculates tax, but that it automates the full operational loop:

```text
QuickBooks import -> MySQL normalization -> state tax rule lookup -> calculation -> validation -> correction -> Excel export -> QuickBooks tax invoice creation
```

That full loop shows practical business automation, accounting-system integration, state-wise tax rule management, and user-facing desktop application development.
