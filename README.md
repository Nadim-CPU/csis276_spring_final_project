# ChequeMe

## What is ChequeMe?

ChequeMe is a financial tracker site that allows you to track where your money
is being spent and flowing to and make smart financial decisions. What you receive or spend is categorized for macromanaging and has a receipts feature that lets you track each month's income to expense for trends to identify.


## Project Setup

**Step 1:** Import the SQL file into pgadmin 4 <br>
**Step 2:** Create two terminals and have each cd into `.\api` and `.\app` within the ChequeMeFolder <br>
**Step 3:** run npm install on both terminals <br>
**Step 4:** run `npm run dev` on both terminals and the project should be ready to begin.


## API Endpoints and Usage

| API Endpoint | Usage |
| ------------ | ----- |
| /categories  | Used to create categories to organize incomes and expenses into a broad bucket|
| /accounts    | Used to manage accounts (credit cards, loose cash, savings) to track where all your liquidity is being stored|
| /incomes     | Used to add income sources of certain types and transfer its funds to your account|
| /expenses    | Used to add expense sources of certain types and affect your accounts balance |
| /users       | Create users and let them track their financials! |

## Database Schema

**users**

| Column | Type | Description |
| ------ | ---- | ----------- |
| user_id | INT PK | Unique identifier for each user |
| user_first_name | TEXT | The user's first name |
| user_last_name | TEXT | The user's last name |
| user_email | TEXT UNIQUE | The user's email used for login |
| password_hash | TEXT | Hashed password  |
| user_dob | DATE | The user's date of birth |

**categories**

| Column | Type | Description |
| ------ | ---- | ----------- |
| category_id | INT PK | Unique identifier for each category |
| user_category_id | INT FK -> users.user_id | Owner of the category |
| category_name | TEXT | Name of the category (Groceries, Salary) |
| type | TEXT | Whether the category groups income or expense sources |

**accounts**

| Column | Type | Description |
| ------ | ---- | ----------- |
| account_id | INT PK | Unique identifier for each account |
| user_account_id | INT FK -> users.user_id | Owner of the account |
| account_name | TEXT | Name of the account (Visa, Savings) |
| account_type | TEXT | Type of account (credit card, cash, savings) |
| account_balance | BIGINT | Current balance held in the account |

**incomes**

| Column | Type | Description |
| ------ | ---- | ----------- |
| income_id | INT PK | Unique identifier for each income entry |
| user_income_id | INT FK -> users.user_id | Owner of the income entry |
| income_amount | BIGINT | Amount of money received |
| income_source | TEXT | Description of where the income came from |
| income_date | DATE | Date the income was received |
| category_income_id | INT FK -> categories.category_id | Category this income belongs to |
| account_income_id | INT FK -> accounts.account_id | Account that receives the funds |

**expenses**

| Column | Type | Description |
| ------ | ---- | ----------- |
| expense_id | INT PK | Unique identifier for each expense entry |
| user_expense_id | INT FK -> users.user_id | Owner of the expense entry |
| expense_amount | BIGINT | Amount of money spent |
| expense_source | TEXT | Description of where the money was spent |
| expense_date | DATE | Date the expense took place |
| category_expense_id | INT FK -> categories.category_id | Category this expense belongs to |
| account_expense_id | INT FK -> accounts.account_id | Account the funds were drawn from |

## Third Party Libraries and Tools

**Figma:** Figma helped me visualize how the front-end design should look. Along with a dashboard, its charts and the CSS to make it easier on me to implement a nice, clean look to the overall website.

**Recharts:** Recharts is a npm library that lets you create charts which is used heavily on the dashboard of the project. <br>
**MUI/Icons:** Adds icons to give the website a nice visual flair and make features a lot clearer to understand.

## How to run and test the application

**Step 1:** Register an account <br>
**Step 2:** Head to /accounts and add your accounts (credit card, loose cash, savings account) <br>
**Step 3:** Head to /categories and add your categories and its type (income, expense) to begin organizing your income and expense sources <br>
**Step 4:** Head to either /incomes or /expenses and add your respective sources, along with their category and which account will be affected by it. You cannot create an income/expense source **UNTIL** an account and a category for whichever source you're adding is made. <br>
**Step 5:** Check out your receipts and dashboard to see how they're visualized. <br>
**Step 6:** Try out edge cases <br>

