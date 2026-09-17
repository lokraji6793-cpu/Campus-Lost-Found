import React, { useState } from 'react';
import { 
  Info, 
  Code2, 
  Database, 
  Layers, 
  Terminal, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  FileText, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [openVivaIndex, setOpenVivaIndex] = useState<number | null>(0);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const vivaQuestions = [
    {
      q: "1. What is CRUD?",
      a: "CRUD stands for Create, Read, Update, and Delete. They represent the four foundational database data-manipulation operations supported by relational and document databases."
    },
    {
      q: "2. What is a REST API?",
      a: "A REST (Representational State Transfer) API is an architectural style that allows networked client applications (like our React frontend) to exchange data with backend servers using standard HTTP methods (GET, POST, PUT, PATCH, DELETE) and JSON formatting."
    },
    {
      q: "3. What is Django?",
      a: "Django is a high-level, batteries-included Python web framework that encourages rapid development, clean MVC/MVT architecture, built-in ORM, administrative panels, and secure database interactions."
    },
    {
      q: "4. What is React?",
      a: "React is a modern declarative JavaScript library developed by Meta for building dynamic, component-driven user interfaces. It uses a virtual DOM to efficiently re-render only the UI elements whose underlying state has changed."
    },
    {
      q: "5. What is Django REST Framework (DRF)?",
      a: "DRF is a powerful, flexible toolkit for building Web APIs in Django. It provides serializers, generic views, viewsets, authentication classes, and browsable API documentation out of the box."
    },
    {
      q: "6. What is an ORM?",
      a: "ORM stands for Object-Relational Mapping. It is a programming technique that translates Python class models (e.g. LostFoundItem) into SQL tables and queries, eliminating the need to write raw SQL statements."
    },
    {
      q: "7. What is SQLite?",
      a: "SQLite is a self-contained, serverless, zero-configuration SQL database engine. It stores the entire database in a single disk file (db.sqlite3), making it ideal for development, testing, and embedded applications."
    },
    {
      q: "8. What is HTTP?",
      a: "HTTP (Hypertext Transfer Protocol) is the application-layer foundation for communication on the World Wide Web, governing how request and response messages are formatted and transmitted."
    },
    {
      q: "9. What is the difference between GET and POST?",
      a: "GET is used to retrieve data from a server without modifying server state (idempotent and safe). POST is used to submit new data to the server to create a new resource."
    },
    {
      q: "10. What is the difference between PUT and PATCH?",
      a: "PUT completely replaces an existing resource with the complete representation provided in the request body. PATCH applies partial modifications to specific fields of the existing resource."
    },
    {
      q: "11. What is DELETE?",
      a: "DELETE is the HTTP method used to instruct the server to remove a specific resource identified by its URL/ID from the database."
    },
    {
      q: "12. What is JSON?",
      a: "JSON (JavaScript Object Notation) is a lightweight, language-independent, human-readable data interchange format consisting of key-value pairs and ordered lists."
    },
    {
      q: "13. What is CORS and why is it needed?",
      a: "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web applications running at one origin (e.g. localhost:3000) from making HTTP requests to a different domain/port (e.g. localhost:8000). The django-cors-headers package enables safe communication."
    },
    {
      q: "14. What is Form Validation?",
      a: "Form validation is the process of verifying that user input adheres to required formats, types, lengths, and constraints before being accepted or processed."
    },
    {
      q: "15. Why is backend validation strictly required even if frontend validation exists?",
      a: "Frontend validation improves user experience with fast feedback, but it can easily be bypassed using curl, Postman, or DevTools scripts. Backend validation is the true line of defense to guarantee database integrity and security."
    },
    {
      q: "16. What is a Primary Key?",
      a: "A Primary Key is a unique identifier (usually an auto-incrementing integer 'id') that uniquely distinguishes each record in a database table."
    },
    {
      q: "17. How does the frontend communicate with the backend?",
      a: "The React frontend uses asynchronous HTTP network requests via the Fetch API or Axios. It sends JSON payloads over HTTP to Django API endpoints and updates React state with the returned JSON responses."
    },
    {
      q: "18. How is data physically stored in this system?",
      a: "Data is stored inside the SQLite relational database file (db.sqlite3) within the 'items_lostfounditem' table structured with columns for item name, category, status, location, date, contact, and audit timestamps."
    },
    {
      q: "19. How does the Update operation work in Django REST Framework?",
      a: "When a PUT or PATCH request reaches /api/items/{id}/, DRF looks up the item instance by primary key in the SQLite database, validates the incoming payload using LostFoundItemSerializer, updates the model fields, and saves to the database."
    },
    {
      q: "20. How does the Delete operation work in this architecture?",
      a: "When the user confirms deletion, the frontend sends an HTTP DELETE request to /api/items/{id}/. DRF locates the model instance, executes SQL 'DELETE FROM ... WHERE id = ?', and returns a 204 No Content or success confirmation."
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* 1. Page Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-200 flex items-center justify-center">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Campus Lost & Found System
            </h1>
            <p className="text-xs font-semibold text-amber-800">
              Find it. Report it. Return it.
            </p>
          </div>
        </div>

        <p className="text-sm text-stone-600 leading-relaxed">
          A production-grade, academic full-stack web application designed for college campus 
          administration. Provides streamlined CRUD workflows, real-time inventory statistics, 
          categorical filtering, fuzzy search, contact integration, and SQLite persistence.
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-400 block font-medium">Architecture</span>
            <span className="text-stone-900 font-bold">Decoupled REST</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-400 block font-medium">Frontend</span>
            <span className="text-stone-900 font-bold">React 19 + Tailwind</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-400 block font-medium">Backend</span>
            <span className="text-stone-900 font-bold">Python Django / DRF</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-400 block font-medium">Database</span>
            <span className="text-stone-900 font-bold">SQLite 3</span>
          </div>
        </div>
      </div>

      {/* 2. System Architecture Flow */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-600" />
          System Architecture Pipeline
        </h2>
        <p className="text-xs text-stone-500">
          Standard academic data-flow model connecting student browser clients to persistent SQLite tables:
        </p>

        <div className="p-4 rounded-xl bg-stone-900 text-white font-mono text-xs overflow-x-auto space-y-2">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="px-2 py-1 rounded bg-stone-800 text-amber-400 font-bold">1. Client Layer</span>
            <span>Student / College User (Browser UI)</span>
          </div>
          <div className="text-stone-500 pl-6">↓ (User interaction: Report, Edit, Search, Delete)</div>
          <div className="flex items-center gap-2 text-stone-300">
            <span className="px-2 py-1 rounded bg-stone-800 text-blue-400 font-bold">2. Presentation</span>
            <span>React Single-Page Application (Components, Hooks, Tailwind)</span>
          </div>
          <div className="text-stone-500 pl-6">↓ (Asynchronous JSON HTTP Requests)</div>
          <div className="flex items-center gap-2 text-stone-300">
            <span className="px-2 py-1 rounded bg-stone-800 text-cyan-400 font-bold">3. Network Client</span>
            <span>Fetch API / Axios Client (Centralized in /src/api.ts)</span>
          </div>
          <div className="text-stone-500 pl-6">↓ (RESTful URLs: /api/items/)</div>
          <div className="flex items-center gap-2 text-stone-300">
            <span className="px-2 py-1 rounded bg-stone-800 text-emerald-400 font-bold">4. Backend Service</span>
            <span>Django REST Framework (Routers, ViewSets, Serializers)</span>
          </div>
          <div className="text-stone-500 pl-6">↓ (Model Validation & QuerySet Generation)</div>
          <div className="flex items-center gap-2 text-stone-300">
            <span className="px-2 py-1 rounded bg-stone-800 text-purple-400 font-bold">5. Data Access</span>
            <span>Django ORM (Object-Relational Mapping)</span>
          </div>
          <div className="text-stone-500 pl-6">↓ (SQL Translation: SELECT, INSERT, UPDATE, DELETE)</div>
          <div className="flex items-center gap-2 text-stone-300">
            <span className="px-2 py-1 rounded bg-stone-800 text-yellow-400 font-bold">6. Storage Engine</span>
            <span>SQLite Database (db.sqlite3 file storage)</span>
          </div>
        </div>
      </div>

      {/* 3. REST API Endpoint Specification */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-600" />
          REST API Specification Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 border-b border-stone-200">Method</th>
                <th className="p-3 border-b border-stone-200">Endpoint</th>
                <th className="p-3 border-b border-stone-200">Purpose</th>
                <th className="p-3 border-b border-stone-200">Payload / Query</th>
                <th className="p-3 border-b border-stone-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-mono text-stone-800">
              <tr>
                <td className="p-3 font-bold text-blue-600">GET</td>
                <td className="p-3 font-semibold">/api/items/</td>
                <td className="p-3 font-sans">List all items with search & filter</td>
                <td className="p-3 font-sans">?search=&status=&category=</td>
                <td className="p-3 font-bold text-emerald-600">200 OK</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-600">POST</td>
                <td className="p-3 font-semibold">/api/items/</td>
                <td className="p-3 font-sans">Create a new lost/found record</td>
                <td className="p-3 font-sans">JSON with item details</td>
                <td className="p-3 font-bold text-emerald-600">201 Created</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600">GET</td>
                <td className="p-3 font-semibold">/api/items/{'{id}'}/</td>
                <td className="p-3 font-sans">Retrieve single item details</td>
                <td className="p-3 font-sans">None</td>
                <td className="p-3 font-bold text-emerald-600">200 OK</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-600">PUT</td>
                <td className="p-3 font-semibold">/api/items/{'{id}'}/</td>
                <td className="p-3 font-sans">Update existing record completely</td>
                <td className="p-3 font-sans">Full JSON object</td>
                <td className="p-3 font-bold text-emerald-600">200 OK</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-600">PATCH</td>
                <td className="p-3 font-semibold">/api/items/{'{id}'}/</td>
                <td className="p-3 font-sans">Partial update of record fields</td>
                <td className="p-3 font-sans">Partial JSON object</td>
                <td className="p-3 font-bold text-emerald-600">200 OK</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-red-600">DELETE</td>
                <td className="p-3 font-semibold">/api/items/{'{id}'}/</td>
                <td className="p-3 font-sans">Remove item from SQLite database</td>
                <td className="p-3 font-sans">None</td>
                <td className="p-3 font-bold text-emerald-600">200 / 204</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-purple-600">POST</td>
                <td className="p-3 font-semibold">/api/items/{'{id}'}/mark_returned/</td>
                <td className="p-3 font-sans">Custom action: sets status to Returned</td>
                <td className="p-3 font-sans">None</td>
                <td className="p-3 font-bold text-emerald-600">200 OK</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600">GET</td>
                <td className="p-3 font-semibold">/api/stats/</td>
                <td className="p-3 font-sans">Aggregate statistics for dashboard</td>
                <td className="p-3 font-sans">None</td>
                <td className="p-3 font-bold text-emerald-600">200 OK</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Database Model Specification */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-600" />
          Database Model: LostFoundItem
        </h2>
        <p className="text-xs text-stone-500">
          Defined in <code className="text-stone-800 bg-stone-100 px-1 py-0.5 rounded">campus_lost_found/items/models.py</code>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">id</span>: AutoField (Primary Key)
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">item_name</span>: CharField(max_length=200)
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">description</span>: TextField()
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">category</span>: CharField(9 Choices)
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">status</span>: CharField('Lost' | 'Found' | 'Returned')
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">location</span>: CharField(max_length=200)
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">date_lost_found</span>: DateField()
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">reported_by</span>: CharField(Student Name)
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">student_email</span>: EmailField()
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">phone</span>: CharField(Phone number)
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">image_url</span>: URLField(blank=True, null=True)
          </div>
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-stone-500">created_at / updated_at</span>: DateTimeField(auto_now)
          </div>
        </div>
      </div>

      {/* 5. 20 Viva Questions and Answers */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            Viva / Defense Q&A Guide (20 Questions)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Carefully prepared academic questions and answers covering CRUD, DRF, React, and SQLite.
          </p>
        </div>

        <div className="space-y-2">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openVivaIndex === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenVivaIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 bg-stone-50/50 hover:bg-stone-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-900 cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 text-xs text-stone-700 bg-white border-t border-stone-200 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
