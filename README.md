# ChequeMe

## What is ChequeMe?

ChequeMe is a financial tracker site that allows you to track where your money
is being spent and flowing to and make smart financial decisions. What you receive or spend is categorized for macromanaging and has a receipts feature that lets you track each month's income to expense for trends to identify.


## Project Setup

**Step 1:** Import the SQL file (`cheque_me_db.sql`) into pgAdmin 4 via **Tools → Restore**. This creates the database `csis_279_spring_26_db` with schema `cheque_me_db` and sample data. <br>
**Step 2:** Create two terminals and have each cd into `.\net-api` and `.\app` within the ChequeMe folder. <br>
**Step 3:** Run `npm install` on both terminals. <br>
**Step 4:** Run `npm run start:dev` in the `.\net-api` terminal (NestJS, watch mode, port `3001`) and `npm run dev` in the `.\app` terminal (Vite, port `5173`). <br>
**Step 5:** (Optional) For face login, copy the model files from `app/node_modules/@vladmandic/face-api/model/` into `app/public/models/`.


## Environment Variables

`net-api/.env`:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=csis_279_spring_26_db
DB_SCHEMA=cheque_me_db

JWT_SECRET=secret
PORT=3001
```

`app/.env` (optional — defaults assume the backend at `http://localhost:3001`):

```dotenv
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```


## API Endpoints and Usage

The backend is a **GraphQL** API. There is a single REST endpoint (`GET /` health-check) and one GraphQL endpoint (`POST /graphql`). All data operations go through GraphQL.

Apollo Sandbox is auto-served at **`http://localhost:3001/graphql`** — it provides interactive, schema-driven documentation for every operation (the equivalent of a Swagger UI for GraphQL). For authenticated requests, paste your JWT into the Sandbox's headers tab as `Authorization: Bearer <token>`.

### Queries (require JWT)

| Operation | Args | Returns | Description |
| --------- | ---- | ------- | ----------- |
| `me` | — | `User!` | The currently authenticated user |
| `accounts` | — | `[Account!]!` | All accounts owned by the current user |
| `account` | `id: Int!` | `Account!` | One account by ID |
| `categories` | — | `[Category!]!` | Used to organize incomes and expenses into a broad bucket |
| `category` | `id: Int!` | `Category!` | One category by ID |
| `expenses` | — | `[Expense!]!` | Expenses with eager `category` + `account` |
| `expense` | `id: Int!` | `Expense!` | One expense by ID |
| `incomes` | — | `[Income!]!` | Incomes with eager `category` + `account` |
| `income` | `id: Int!` | `Income!` | One income by ID |

### Mutations

**Auth (public — no JWT required)**

| Operation | Args | Returns |
| --------- | ---- | ------- |
| `register` | `input: RegisterInput!` | `User!` |
| `login` | `input: LoginInput!` | `AuthPayload!` (`{ authenticated, user, access_token }`) |
| `loginWithFace` | `input: LoginWithFaceInput!` | `AuthPayload!` |

**User, Account, Category, Expense, Income (require JWT)**

| Operation | Args | Returns | Notes |
| --------- | ---- | ------- | ----- |
| `updateUser` | `input: UpdateUserInput!` | `User!` | |
| `removeUser` | — | `OperationResult!` | |
| `createAccount` | `input: CreateAccountInput!` | `Account!` | Used to manage accounts (credit cards, loose cash, savings) |
| `updateAccount` | `id: Int!, input: UpdateAccountInput!` | `Account!` | |
| `removeAccount` | `id: Int!` | `OperationResult!` | Rejects if any expense/income still references the account |
| `createCategory` | `input: CreateCategoryInput!` | `Category!` | |
| `updateCategory` | `id: Int!, input: UpdateCategoryInput!` | `Category!` | |
| `removeCategory` | `id: Int!` | `OperationResult!` | Rejects if any expense/income still references the category |
| `createExpense` | `input: CreateExpenseInput!` | `Expense!` | Used to add expense sources of certain types and affect your account's balance |
| `updateExpense` | `id: Int!, input: UpdateExpenseInput!` | `Expense!` | Refunds the old account and re-debits the new one |
| `removeExpense` | `id: Int!` | `OperationResult!` | Refunds the linked account |
| `createIncome` | `input: CreateIncomeInput!` | `Income!` | Used to add income sources of certain types and transfer its funds to your account |
| `updateIncome` | `id: Int!, input: UpdateIncomeInput!` | `Income!` | |
| `removeIncome` | `id: Int!` | `OperationResult!` | |

Input-type shapes (DTO summaries) live in [`net-api/src/schema.gql`](net-api/src/schema.gql). Key fields:

```graphql
input RegisterInput {
  user_first_name: String!
  user_last_name:  String!
  user_email:      String!
  password:        String!
  user_dob:        String!     # ISO date YYYY-MM-DD
  face_descriptor: [Float!]    # optional, length 128
}

input CreateAccountInput { account_name: String!  account_type: String!  account_balance: Int! }
input CreateExpenseInput {
  expense_amount: Int!  expense_source: String!  expense_date: String!
  category_expense_id: Int!  account_expense_id: Int!
}
# CreateIncomeInput mirrors CreateExpenseInput with `income_amount: Float!`.
```

### WebSocket Events

The backend runs a Socket.IO gateway on the same port (`:3001`). The frontend connects when a user is logged in and listens for these events to keep the UI in sync across tabs:

| Event | Payload | Frontend behaviour |
| ----- | ------- | ------------------ |
| `account.changed` | `{ user_id: Int }` | Re-fetch accounts if `user_id` matches the current user |
| `category.changed` | `{ user_id: Int }` | Re-fetch categories |
| `expense.changed` | `{ user_id: Int }` | Re-fetch expenses |
| `income.changed` | `{ user_id: Int }` | Re-fetch incomes |


## Database Schema

All tables live in schema `cheque_me_db`.

**users**

| Column | Type | Description |
| ------ | ---- | ----------- |
| user_id | INT PK | Unique identifier for each user |
| user_first_name | TEXT | The user's first name |
| user_last_name | TEXT | The user's last name |
| user_email | TEXT | The user's email used for login |
| password_hash | TEXT | bcrypt-hashed password (10 salt rounds) |
| user_dob | DATE | The user's date of birth |
| face_descriptor | `double precision[]` | Optional 128-dim face descriptor for face login |

**categories**

| Column | Type | Description |
| ------ | ---- | ----------- |
| category_id | INT PK | Unique identifier for each category |
| user_category_id | INT FK -> users.user_id | Owner of the category |
| category_name | TEXT | Name of the category (Groceries, Salary). Unique per user |
| type | BOOLEAN | `true` = expense category, `false` = income category |

**accounts**

| Column | Type | Description |
| ------ | ---- | ----------- |
| account_id | INT PK | Unique identifier for each account |
| user_account_id | INT FK -> users.user_id | Owner of the account |
| account_name | TEXT | Name of the account (Visa, Savings). Unique per user |
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
| category_expense_id | INT FK -> categories.category_id (ON DELETE CASCADE) | Category this expense belongs to |
| account_expense_id | INT FK -> accounts.account_id | Account the funds were drawn from |


## Third Party Libraries and Tools

**Figma:** Figma helped me visualize how the front-end design should look. Along with a dashboard, its charts and the CSS to make it easier on me to implement a nice, clean look to the overall website.

**Recharts:** Recharts is an npm library that lets you create charts which is used heavily on the dashboard of the project. <br>
**MUI/Icons:** Adds icons to give the website a nice visual flair and make features a lot clearer to understand.

**NestJS + GraphQL (Apollo):** The backend framework and the GraphQL server it runs. NestJS gives us the module/service/resolver layering and dependency injection; `@nestjs/graphql` + `@nestjs/apollo` generate the GraphQL schema from the TypeScript classes (code-first) and serve Apollo Sandbox at `/graphql`. <br>
**TypeORM + `pg`:** ORM that maps our Postgres tables to TypeScript entities and handles queries, eager-loading of relations, and atomic updates (`adjustBalance` uses `.increment()`). <br>
**Passport-JWT + `@nestjs/jwt` + `bcryptjs`:** Auth pipeline — JWT tokens are signed at login and verified on every authenticated GraphQL request; bcrypt hashes passwords with 10 salt rounds. <br>
**Socket.IO (`@nestjs/websockets` + `socket.io-client`):** Real-time event bus that pushes `account.changed` / `category.changed` / `expense.changed` / `income.changed` events to all connected clients so the UI stays in sync across tabs. <br>
**Redux Toolkit + react-redux:** Frontend state management for auth, accounts, categories, expenses, and incomes; thunks wrap the GraphQL calls and slices upsert/delete locally. <br>
**React Router 7:** Client-side routing with public / auth-only / protected route types in [`app/src/app/routes.js`](app/src/app/routes.js). <br>
**MUI (`@mui/material`) + `@mui/x-date-pickers` + `dayjs`:** Component library for the entire UI; the date picker on the register form uses dayjs as its adapter. <br>
**`@vladmandic/face-api`:** Browser-side face-descriptor extraction. The user's webcam feed is run through tinyFaceDetector + face-landmark-68 + face-recognition models to produce a 128-D vector that's compared on login. <br>
**Vite:** Frontend build tool / dev server.


## How to run and test the application

**Step 1:** Register an account <br>
**Step 2:** Head to /accounts and add your accounts (credit card, loose cash, savings account) <br>
**Step 3:** Head to /categories and add your categories and its type (income, expense) to begin organizing your income and expense sources <br>
**Step 4:** Head to either /incomes or /expenses and add your respective sources, along with their category and which account will be affected by it. You cannot create an income/expense source **UNTIL** an account and a category for whichever source you're adding is made. <br>
**Step 5:** Check out your receipts and dashboard to see how they're visualized. <br>
**Step 6:** Try out edge cases (e.g. delete a category that's in use, edit an expense to point at a different account — the account balances should rebalance automatically). <br>


## Technical Documentation

### Backend Services

#### [`AuthService`](net-api/src/auth/auth.service.ts)

| Method | Parameters | Returns | Description |
| ------ | ---------- | ------- | ----------- |
| `register(dto: RegisterInput)` | first/last name, email, password, dob, optional face descriptor | `Promise<User>` | Hashes the password (bcrypt, 10 rounds), persists the user. Throws `ConflictException` if email is taken. |
| `login(dto: LoginInput)` | `{ user_email, password }` | `Promise<AuthPayload>` | Verifies password hash and issues a JWT. Throws `UnauthorizedException` on miss. |
| `loginWithFace(dto: LoginWithFaceInput)` | `{ user_email, descriptor: number[] }` | `Promise<AuthPayload>` | Loads the stored 128-D descriptor and computes Euclidean distance; accepts if `≤ 0.6`. |
| `issueAuthPayload(user)` *(private)* | `User` | `AuthPayload` | Strips `password_hash`/`face_descriptor`, signs JWT with `{ sub, user_email }` and 1-day expiry. |

#### [`UserService`](net-api/src/user/user.service.ts)

| Method | Parameters | Returns | Description |
| ------ | ---------- | ------- | ----------- |
| `findOne(user_id)` | `user_id: number` | `Promise<User>` | `NotFoundException` if missing. |
| `findByEmail(email)` | `email: string` | `Promise<User \| null>` | Used by the auth pipeline. |
| `update(user_id, input)` | `UpdateUserInput` | `Promise<User>` | `NotFoundException` if no rows updated. |
| `remove(user_id)` | `user_id: number` | `Promise<void>` | `NotFoundException` if no rows deleted. |

#### [`AccountService`](net-api/src/account/account.service.ts)

| Method | Parameters | Returns | Description |
| ------ | ---------- | ------- | ----------- |
| `getAccounts(user_id)` | `user_id: number` | `Promise<Account[]>` | Ordered by `account_id ASC`. |
| `getAccount(user_id, account_id)` | both ids | `Promise<Account>` | `NotFoundException` if missing or not owned. |
| `create(user_id, input)` | `CreateAccountInput` | `Promise<Account>` | `ConflictException` on duplicate name per user. Broadcasts `account.changed`. |
| `update(user_id, id, input)` | `UpdateAccountInput` | `Promise<Account>` | Same conflict guard on rename. |
| `remove(user_id, id)` | both ids | `Promise<void>` | Throws `BadRequestException` if any expense or income still references the account. |
| `adjustBalance(account_id, amount)` | signed delta | `Promise<void>` | Atomic `increment()` on `account_balance`. Broadcasts `account.changed`. |

#### [`CategoryService`](net-api/src/category/category.service.ts)

| Method | Parameters | Returns | Description |
| ------ | ---------- | ------- | ----------- |
| `getCategories(user_id)` | `user_id: number` | `Promise<Category[]>` | All categories owned by the user. |
| `getCategory(category_id, user_id)` | both ids | `Promise<Category>` | `NotFoundException` if missing. |
| `create(input, user_id)` | `CreateCategoryInput` | `Promise<Category>` | `ConflictException` on duplicate name per user. |
| `update(id, input, user_id)` | `UpdateCategoryInput` | `Promise<Category>` | Same conflict guard. |
| `remove(id, user_id)` | both ids | `Promise<void>` | `BadRequestException` if any expense/income still references the category. |

#### [`ExpenseService`](net-api/src/expense/expense.service.ts)

| Method | Parameters | Returns | Description |
| ------ | ---------- | ------- | ----------- |
| `getExpenses(user_id)` | `user_id: number` | `Promise<Expense[]>` | Eager-loads `category` + `account`. |
| `getExpense(user_id, expense_id)` | both ids | `Promise<Expense>` | Eager-loaded; `NotFoundException` if missing. |
| `create(user_id, input)` | `CreateExpenseInput` | `Promise<Expense>` | Persists row, debits the account via `AccountService.adjustBalance(-amount)`, broadcasts `expense.changed`, returns the re-fetched row. |
| `update(user_id, id, input)` | `UpdateExpenseInput` | `Promise<Expense>` | Refunds the old account, debits the new one. |
| `remove(user_id, id)` | both ids | `Promise<void>` | Refunds the linked account before deleting. |

#### [`IncomeService`](net-api/src/income/income.service.ts)

| Method | Parameters | Returns | Description |
| ------ | ---------- | ------- | ----------- |
| `getIncomes(user_id)` | `user_id: number` | `Promise<Income[]>` | Eager-loads relations. |
| `getIncome(user_id, id)` | both ids | `Promise<Income>` | `NotFoundException` if missing. |
| `create(user_id, input)` | `CreateIncomeInput` | `Promise<Income>` | Credits the account, broadcasts `income.changed`, returns the re-fetched row. |
| `update(user_id, id, input)` | `UpdateIncomeInput` | `Promise<Income>` | Reverses the old credit and applies the new one. |
| `remove(user_id, id)` | both ids | `Promise<void>` | Reverses the credit before deletion. |

#### [`SocketGateway`](net-api/src/socket/socket.gateway.ts)

| Method | Parameters | Returns | Description |
| ------ | ---------- | ------- | ----------- |
| `handleConnection(client)` | `Socket` | `void` | Logs the connection ID. |
| `handleDisconnect(client)` | `Socket` | `void` | Logs the disconnect. |
| `broadcast(event, payload)` | `event: string`, `payload: unknown` | `void` | Fan-outs to every connected client. Services pass `{ user_id }` so clients filter locally. |

#### Auth plumbing

| Item | Purpose |
| ---- | ------- |
| [`GqlAuthGuard`](net-api/src/auth/guards/gql-auth.guard.ts) | Extends `AuthGuard('jwt')`, overriding `getRequest` to pull from the GraphQL context. Applied at the class level to every business resolver. |
| [`JwtStrategy.validate(payload)`](net-api/src/auth/strategies/jwt.strategy.ts) | Returns `{ user_id: payload.sub }` for the `@CurrentUser` decorator. |
| [`@CurrentUser(key)`](net-api/src/auth/current/current-user.decorator.ts) | Parameter decorator that injects `req.user[key]` — every resolver uses `@CurrentUser('user_id')`. |

### Frontend Hooks

All in [`app/src/stores/hooks/`](app/src/stores/hooks/) — thin wrappers around the Redux slices.

#### [`useAuth`](app/src/stores/hooks/useAuth.js)

| Returns | Type | Description |
| ------- | ---- | ----------- |
| `user` | `User \| null` | Current user, mirrored to `localStorage`. |
| `accessToken` | `string \| null` | JWT for `Authorization` headers. |
| `signIn({ user, accessToken })` | function | Persists to Redux + localStorage. |
| `signOut()` | function | Clears both. |

#### [`useAccounts`](app/src/stores/hooks/useAccounts.js)

| Returns | Type | Description |
| ------- | ---- | ----------- |
| `items` | `Account[]` | Cached list. |
| `loading` | `boolean` | True during any in-flight thunk. |
| `error` | `string \| null` | Last failure message. |
| `loadAccounts(userId)` | `() => Promise<Account[]>` | Dispatches `fetchAccounts`, unwraps the thunk. |
| `saveAccount(data, id?)` | `() => Promise<Account>` | Calls create or update; upserts the slice's items. |
| `deleteAccount(id)` | `() => Promise<number>` | Removes from the slice; throws on backend rejection. |

#### [`useCategories`](app/src/stores/hooks/useCategories.js), [`useExpenses`](app/src/stores/hooks/useExpenses.js), [`useIncomes`](app/src/stores/hooks/useIncomes.js)

Mirror `useAccounts` with their respective entity types and `loadX` / `saveX` / `deleteX` names.

#### [`useSocketSync`](app/src/stores/hooks/useSocketSync.js)

Side-effect-only hook invoked once in [`App.jsx`](app/src/app/App.jsx#L10). Connects to Socket.IO when a user is logged in, listens for the four `*.changed` events, and re-dispatches the matching `fetchX` thunk only when `payload.user_id` matches the current user. Cleans up on user change / unmount.

### Frontend Helpers

#### [`dashboard.service.js`](app/src/features/dashboard/services/dashboard.service.js)

| Function | Parameters | Returns | Description |
| -------- | ---------- | ------- | ----------- |
| `buildDashboardData(expenses, incomes)` | full lists | `{ currentYear, currentMonth, totalIncome, totalExpenses, currentMonthProfit, expenseByCategory, topExpenseCategories, incomeByCategory, yearProfit, totalYearProfit }` | Aggregates current-month sums per category and a 12-row series of yearly profits for the recharts AreaChart. |
| `groupByCategory(items, amountKey)` *(internal)* | list + amount key | `{ name, value, color }[]` sorted desc | Sums by `item.category?.category_name`; falls back to `"Uncategorized"`. |

#### [`receipt.service.js`](app/src/features/receipts/services/receipt.service.js)

| Function | Parameters | Returns | Description |
| -------- | ---------- | ------- | ----------- |
| `buildReceiptData(expenses, incomes)` | full lists | `{ availableYears: number[], byYear: { [year]: MonthSummary[] } }` | One row per active month, each with `{ month, income, expenses, profit }`. Inactive months are filtered out. |
| `buildMonthDetail(expenses, incomes, year, month)` | lists + year + 1-indexed month | `{ year, month, expenses, incomes }` | Filters the raw rows whose date falls inside the requested month. |

#### [`api.js`](app/src/services/api.js)

| Function | Parameters | Returns | Description |
| -------- | ---------- | ------- | ----------- |
| `requestGraphql(document, options)` | `document: string`, `options: { variables?, includeMeta?, dataPath? }` | `Promise<any>` (or `{ ok, status, data }` when `includeMeta`) | POSTs to `${VITE_API_URL}/graphql` with the stored Bearer token. Throws the first GraphQL error's message by default, or returns `{ ok: false, data: error }` if `includeMeta` is set. On 401/UNAUTHENTICATED, clears `localStorage` and redirects to `/login`. |

#### [`socket.js`](app/src/services/socket.js)

| Export | Type | Description |
| ------ | ---- | ----------- |
| `SOCKET_ENABLED` | `boolean` | True when `VITE_SOCKET_URL` (or `VITE_API_URL`) is set. |
| `getSocket()` | `() => Socket \| null` | Lazily creates a single socket.io client; connection is deferred until `socket.connect()` is called inside `useSocketSync`. |
