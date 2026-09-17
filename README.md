# Campus Lost & Found Management System

> **"Find it. Report it. Return it."**  
> An academic, production-grade CRUD web application designed for college campuses to record, track, search, update, and resolve lost and found belongings.

---

## 1. Project Overview & Objectives

The **Campus Lost & Found Management System** provides college students, faculty, and campus security staff with a centralized, reliable platform to report lost belongings, log found items, track claim statuses, and safely reunite owners with their personal effects.

### Core Capabilities Demonstrated
* **Full CRUD Operations**: Create new reports, Read/display records with filters, Update details or mark items returned, and Delete entries with safety confirmations.
* **Decoupled Architecture**: React 19 Frontend communicating via RESTful JSON APIs with a Python / SQLite backend.
* **Dual-Tier Validation**: Client-side feedback with synchronous dirty-checking alongside strict server-side schema and pattern validations.
* **Campus Inventory Dashboard**: Real-time aggregated metrics for Total Items, Lost Items, Found Items, and Returned Items.
* **Responsive Visual Hierarchy**: Designed with Tailwind CSS, supporting mobile phones, tablets, laptops, and wide displays.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 (TypeScript) | Declarative UI, state management, hooks |
| **Styling & Icons** | Tailwind CSS v4 + Lucide Icons | Responsive layout, semantic design system |
| **Routing** | React Router v7 | Single Page Application client-side navigation |
| **Backend REST API** | Python / Django REST Framework & Node Express | RESTful endpoints, query parsing, validation |
| **Database** | SQLite 3 (`db.sqlite3`) | Relational persistence, transactional ACID storage |
| **Tooling & Build** | Vite & ESBuild | Fast dev server, production bundling |

---

## 3. Project Directory Structure

```text
├── campus_lost_found/             # Django Backend Project Directory
│   ├── manage.py                  # Django administrative script
│   ├── requirements.txt           # Python dependencies
│   ├── backend/                   # Django project configuration
│   │   ├── __init__.py
│   │   ├── settings.py            # Apps, CORS, DRF, SQLite configuration
│   │   ├── urls.py                # Root URL routing (/admin/, /api/)
│   │   ├── wsgi.py                # WSGI entry point
│   │   └── asgi.py                # ASGI entry point
│   └── items/                     # Django core application
│       ├── __init__.py
│       ├── admin.py               # Django Admin registration & bulk actions
│       ├── apps.py                # App configuration
│       ├── models.py              # LostFoundItem ORM schema definition
│       ├── serializers.py         # DRF serializers & field validations
│       ├── views.py               # LostFoundItemViewSet with filter/search
│       ├── urls.py                # App URL routes with DefaultRouter
│       ├── tests.py               # 10 automated test cases
│       └── migrations/            # Database schema migrations
│           ├── __init__.py
│           └── 0001_initial.py
├── src/                           # React Frontend Application Directory
│   ├── components/                # Modular UI components
│   │   ├── Navbar.tsx             # Main campus navigation header
│   │   ├── Footer.tsx             # Academic project footer
│   │   ├── ItemCard.tsx           # Item card with badges & actions
│   │   ├── ItemForm.tsx           # Reusable form for create & edit
│   │   ├── DeleteConfirmModal.tsx # Safe modal confirmation dialog
│   │   └── NotificationToast.tsx  # User feedback toasts
│   ├── pages/                     # Routed view pages
│   │   ├── HomePage.tsx           # Hero section, statistics, recent items
│   │   ├── AllItemsPage.tsx       # Search, filter, sort, & all items grid
│   │   ├── ReportLostPage.tsx     # Dedicated Lost item reporting flow
│   │   ├── ReportFoundPage.tsx    # Dedicated Found item reporting flow
│   │   ├── ItemDetailsPage.tsx    # Detailed item card with audit timestamps
│   │   ├── EditItemPage.tsx       # Pre-filled edit form with PUT/PATCH
│   │   └── AboutPage.tsx          # System architecture, API docs & Viva Q&A
│   ├── api.ts                     # Centralized API service for HTTP calls
│   ├── constants.ts               # Categories, statuses, badges, sample data
│   ├── types.ts                   # TypeScript interfaces & validation schemas
│   ├── App.tsx                    # Route definitions & base layout
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global Tailwind CSS imports
├── server.ts                      # Express API proxy & SQLite bridge
├── db_manager.py                  # Standalone Python SQLite manager
├── db.sqlite3                     # SQLite database file
├── metadata.json                  # Application metadata
└── package.json                   # Dependencies & npm scripts
```

---

## 4. REST API Endpoint Specification

| Method | Endpoint | Description | Request Body | Response Status |
|---|---|---|---|---|
| `GET` | `/api/items/` | List all records with query filters | Query params (`search`, `status`, `category`, `ordering`) | `200 OK` |
| `POST` | `/api/items/` | Create a new lost or found report | JSON item payload | `201 Created` |
| `GET` | `/api/items/{id}/` | Retrieve single item details | None | `200 OK` / `404 Not Found` |
| `PUT` | `/api/items/{id}/` | Full update of existing item | Full JSON item payload | `200 OK` |
| `PATCH` | `/api/items/{id}/` | Partial update of specific fields | Partial JSON payload | `200 OK` |
| `DELETE` | `/api/items/{id}/` | Permanently delete record | None | `200 OK` / `204 No Content` |
| `POST` | `/api/items/{id}/mark_returned/` | Custom action: transition status to Returned | None | `200 OK` |
| `GET` | `/api/stats/` | Aggregated metrics for total, lost, found, returned | None | `200 OK` |

---

## 5. Local Setup Instructions (Windows PowerShell)

### Step 1: Clone or Open Workspace
```powershell
cd CampusLostAndFound
```

### Step 2: Running the Integrated Development Server
```powershell
# Install Node dependencies
npm install

# Start development server (serves frontend + backend on port 3000)
npm run dev
```

### Step 3: Running Pure Python Django Backend (Optional Alternative)
If you wish to run the pure Django server on a machine with Python installed:
```powershell
# Navigate into Django project directory
cd campus_lost_found

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start Django development server on port 8000
python manage.py runserver 8000

# In a second PowerShell window, run test suite
python manage.py test items
```

---

## 6. CRUD Verification Checklist for Demonstrations

- [x] **Create (Lost)**: Fill and submit `/report-lost`. Verify record appears immediately with badge `Lost`.
- [x] **Create (Found)**: Fill and submit `/report-found`. Verify record appears immediately with badge `Found`.
- [x] **Read (List & Details)**: View all cards on `/items`. Click `View` to inspect detailed contact info and timestamps.
- [x] **Update**: Click `Edit` on an existing item. Modify location and description. Submit and verify updated values.
- [x] **Mark as Returned**: Click `Mark as Returned`. Verify badge changes to blue `Returned` and statistics update.
- [x] **Delete**: Click `Delete`. Verify warning confirmation dialog opens. Confirm deletion and verify record is removed.
- [x] **Search & Filter**: Search by keyword "Keys" or filter by category "Electronics" and status "Lost". Verify instant results.

---

## 7. Viva & Academic Defense Q&A

1. **What is CRUD?**
   Create, Read, Update, Delete — the four fundamental data persistence operations.
2. **Why use Django REST Framework?**
   Provides powerful serializers, validation, routers, and content negotiation out of the box.
3. **What is the difference between PUT and PATCH?**
   PUT performs a complete resource replacement, while PATCH applies partial updates to specified fields.
4. **Why do we need backend validation?**
   Frontend validation is easily bypassed via curl/scripts. Backend validation guarantees database integrity.
5. **How is the SQLite database queried?**
   Through Django ORM QuerySets or SQL parameter binding, avoiding SQL injection vulnerabilities.
