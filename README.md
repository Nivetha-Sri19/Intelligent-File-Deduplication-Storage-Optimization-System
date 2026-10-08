Intelligent File Deduplication & Storage Optimization System

Overview

The Intelligent File Deduplication & Storage Optimization System is a full-stack file management application designed to identify duplicate files, reduce unnecessary storage usage, and provide a secure way to manage files.

The system compares files based on their actual content rather than their filenames. A SHA-256 hash is generated for each uploaded file, allowing the application to identify files that contain the same data even when their names or locations are different.

The application also provides storage analytics, duplicate grouping, background file processing, secure deletion, authentication, audit tracking, and a modern dashboard for managing the complete file lifecycle.

Architecture

The application follows a layered enterprise-style architecture.

Frontend

   │
   
   │ HTTP / JSON
   
   ▼

FastAPI API Layer

   │
   
   ▼

Service Layer

   │
   
   ├── File Processing
   
   ├── Hashing
   
   ├── Duplicate Detection
   
   ├── Analytics
   
   ├── Safe Deletion
   
   └── Authentication
   
   │
   
   ▼

Repository Layer

   │
   
   ▼

SQLAlchemy Models

   │
   
   ▼


MySQL

Background processing is handled separately through Celery and Redis:

File Upload

     │
     
     ▼

FastAPI

     │
     
     ▼

File Stored

     │
     
     ▼

Celery Task

     │
     
     ▼

Redis Broker

     │
     
     ▼

Celery Worker

     │
     
     ▼

SHA-256 Hashing

     │
     
     ▼

Duplicate Detection

     │
     
     ▼

Database Update

Backend Architecture

The backend is built with Python 3.12 and FastAPI.

The backend is divided into clear responsibilities so that API logic, business logic, database operations, and background processing remain independent.

API Layer

The API layer is responsible for:

- Request validation

- Authentication and authorization

- Dependency injection

- Calling application services

- Returning structured responses

- API versioning

The API layer does not contain the main business logic.

Service Layer

The service layer contains the core application logic.

Main services include:

- Authentication service

- File service

- Hashing service

- Duplicate detection service

- Analytics service

- Safe deletion service

- Audit service

This keeps the business rules independent from the API and database implementation.

Repository Layer

Repositories are responsible only for database operations.

They handle:

- Creating records

- Updating records

- Fetching records

- Filtering data

- Duplicate-related queries

- Deletion history queries

- Audit data queries

This separation makes the database access layer easier to maintain and test.

Model Layer

SQLAlchemy models represent the database entities and relationships.

The project contains seven main business tables:

- users

- files

- file_hashes

- duplicate_groups

- file_metadata

- deletion_history

- audit_logs

Alembic is used to manage database schema migrations.

File Processing

The file processing workflow is designed around the complete file lifecycle.

When a file is uploaded:

1. The file is validated.

2. The file is stored in the configured storage location.

3. File information is recorded in MySQL.

4. A background hashing task is created.

5. The file is read in chunks.

6. SHA-256 is calculated from the actual file content.

7. The generated hash is stored.

8. Existing files with the same hash are identified.

9. Duplicate groups are updated.

10. Storage savings are calculated.

The file itself is not loaded completely into memory during hashing. Chunk-based processing is used to make the system more suitable for larger files.

Intelligent Duplicate Detection

Duplicate detection is based on file content rather than filenames.

For every processed file, the system generates a SHA-256 hash.

Conceptually:

Same Content

     ↓

Same SHA-256 Hash

     ↓

Duplicate Group


This allows files such as:

report.pdf

report-final.pdf

report-copy.pdf


to be recognized as duplicates when their actual contents are identical.

Duplicate groups maintain information about:

- Group hash

- Files belonging to the group

- Original file

- Storage consumed

- Potential storage savings

The original file is retained while duplicate files can be evaluated for safe removal.

Background Processing

File hashing is performed asynchronously using Celery and Redis.

This prevents expensive hashing operations from blocking normal API requests.

Components

Celery

Handles background task execution.

Redis

Acts as the message broker and result backend.

Celery Worker

Processes file hashing and cleanup tasks independently from the FastAPI application.

This architecture allows file processing to continue without making the user wait for the complete hashing operation.

Storage Layer

The application uses a dedicated storage abstraction instead of placing physical file operations directly inside API routes.

The storage layer handles operations such as:

- Saving files

- Resolving file paths

- Checking file existence

- Deleting files

- Managing stored file locations

This keeps physical storage operations separated from business logic.

The current implementation uses local storage, while the abstraction makes it easier to introduce another storage provider later.

Storage Analytics

The system calculates storage information based on the files managed by the application.

The analytics layer provides information such as:

- Total files

- Total storage used

- Duplicate storage

- Potential storage savings

- File distribution

- Storage efficiency

The dashboard uses these values to provide a visual overview of the storage environment.

Safe Deletion

File deletion is handled through a dedicated deletion service rather than directly removing files from the filesystem.

Before deletion, the system checks:

- File ownership

- File existence

- Protected-file status

- Duplicate membership

- Potential storage impact

Deletion history is recorded so that file deletion operations remain traceable.

The deletion workflow records:

- File information

- User responsible for the deletion

- File size


- Deletion status

- Reason when applicable

- Creation time

- Completion time

Physical deletion and database state updates are handled together to keep the application state consistent.

Authentication and Security


Authentication is implemented using JWT-based authentication.

The security layer is responsible for:

- Password handling

- Token generation

- Token validation

- User authentication

- Active-user verification

- Protected resource access

User-specific operations are scoped to the authenticated user so that users cannot access or manipulate files belonging to another account.

The application also includes file validation and controlled storage access.

Database

The system uses MySQL 8.0 as the primary relational database.

The database stores both application data and operational information.

Main entities

Users

Stores authentication and user account information.

Files

Stores file ownership, filename, size, storage path, status, and lifecycle information.

File Hashes

Stores SHA-256 content hashes associated with files.

Duplicate Groups

Represents relationships between files containing identical content.

File Metadata

Stores additional file information.

Deletion History

Maintains a record of file deletion operations.

Audit Logs

Provides traceability for important system operations.

Database Migrations

Alembic is used for database schema management.

Database changes are handled through migration scripts rather than manually modifying tables.

This keeps database structure version-controlled and makes the environment reproducible.

Error Handling

The backend contains centralized exception handling.

Application-specific exceptions are used for conditions such as:

- Authentication failures

- Unauthorized access

- Missing resources

- Invalid operations

- Protected-file deletion

- Conflicting operations

The API returns consistent error responses while internal exceptions are handled separately from business logic.

Logging and Auditing

Application logging is separated from audit logging.

Application Logging

Used for:

- Runtime information

- Errors

- Background task activity

- Debugging

- Operational monitoring

Audit Logging

Used to track important user and file actions.

This provides a history of important operations without mixing audit information with normal application logs.

Frontend Architecture

The frontend is built using:

- React

- TypeScript

- Vite

- Material UI

- Axios

- React Router

- Chart.js

- React Icons

The frontend is organized around reusable pages, components, layouts, API communication, and application-level styling.

Frontend Design

The UI follows a modern SaaS dashboard style with a dark visual theme, glass-style cards, gradient highlights, storage metrics, and responsive layouts.

The main interface includes:

- Authentication screen

- Dashboard

- File management

- Duplicate management

- Deletion history

- Storage analytics

- Navigation sidebar

- File upload interface

- Status indicators

- Data visualization

The dashboard provides a quick overview of storage consumption and duplicate-related savings.

API Communication

Axios is used as the frontend HTTP client.

The frontend communicates with the FastAPI backend through a centralized API layer.

Authentication information is maintained on the client side and included when accessing protected application resources.

React Router manages navigation between application screens.

File Management

The file management interface provides a centralized view of uploaded files.

The interface supports:

- File upload

- File information

- File size

- Processing status

- File download

- File deletion

- File refresh

- File search and filtering

The UI reflects the backend file-processing lifecycle so that users can distinguish between files that are still being processed and files that are ready.

Duplicate Management

The duplicate management screen presents files grouped according to their content hash.

The interface shows:

- Duplicate groups

- Files within each group

- Original file

- Duplicate files

- Storage consumed

- Potential storage savings


This allows users to understand exactly where storage is being consumed by duplicate content.

Dashboard

The dashboard acts as the main overview of the system.

It presents important storage information through:

- File count

- Storage usage

- Duplicate information

- Potential savings

- Storage efficiency

- Recent activity

- File-related insights

Chart.js is used for visual representation of storage and duplicate information.

Deletion History

The history interface provides visibility into previous deletion operations.

It allows the user to understand:

- Which file was deleted

- File size

- Deletion status

- When the operation occurred

- Storage that was released

This complements the safe-deletion workflow and provides traceability.

Docker Architecture

Docker is used to keep the application services isolated and consistent.

The application consists of separate containers for:

FastAPI Backend

      │
      
      ├── MySQL
      
      │
      
      ├── Redis
      
      │
      
      └── Celery Worker

The frontend runs separately during development and communicates with the backend service.

Docker Compose is used to manage the backend-related services together.

Configuration

Application configuration is centralized through environment variables.

Configuration includes areas such as:

- Database connection

- JWT settings

- Redis connection

- Celery configuration

- Storage configuration

- File size limits

- Hashing configuration

- Application environment

Sensitive configuration values are kept outside the source code through environment configuration.

An environment template is maintained separately for development configuration.

Validation

The backend uses Pydantic for request and response validation.

This provides:

- Structured request models

- Type validation

- Response validation

- Consistent data contracts

- Safer API communication

SQLAlchemy handles database persistence while Pydantic handles API-level data validation.

Testing

The project includes both unit and integration testing.

Unit Tests

The unit-test structure covers important business functionality such as:

- Hash calculation

- Duplicate detection

- File services

- Analytics

Integration Tests

Integration tests cover application-level workflows including:

- Authentication

- File operations

- Duplicate-related functionality

The testing structure is designed to keep core business logic independently testable.

Project Structure

intelligent_file_deduplication/

│

├── backend/

│   ├── app/

│   │   ├── api/

│   │   ├── core/

│   │   ├── models/

│   │   ├── repositories/

│   │   ├── schemas/

│   │   ├── services/

│   │   ├── storage/

│   │   ├── utils/

│   │   └── workers/

│   │

│   ├── alembic/

│   ├── tests/

│   ├── uploads/

│   ├── .env

│   ├── .env.example

│   ├── alembic.ini

│   ├── Dockerfile

│   ├── docker-compose.yml

│   ├── pytest.ini

│   ├── requirements.txt

│   └── README.md

│

└── frontend/

    ├── src/
    
    │   ├── components/
    
    │   ├── layouts/
    
    │   ├── pages/
    
    
    │   ├── services/
    
    │   ├── theme/
    
    │   └── ...
    
    ├── public/
    
    ├── package.json
    
    ├── package-lock.json
    
    ├── tsconfig.json
    
    └── vite.config.ts


Technology Stack

Backend

- Python 3.12

- FastAPI

- SQLAlchemy

- Pydantic

- Alembic

- Celery

- Redis

- JWT Authentication

Frontend

- React

- TypeScript

- Vite

- Material UI

- Axios

- React Router

- Chart.js

- React Icons

Database

- MySQL 8.0

Development & Infrastructure

- Docker

- Docker Compose

- VS Code

- MySQL Workbench

- Postman

- Swagger/OpenAPI

- Git

Design Principles

The project was structured around the following principles:

- Separation of concerns

- Clean layered architecture

- Reusable business services

- Repository-based database access

- Asynchronous processing for expensive operations

- Secure user-specific access

- Chunk-based file processing

- Database migration management

- Centralized error handling

- Auditability

- Maintainable frontend components

- Responsive and consistent UI design

Project Outcome

The final system brings file management, duplicate detection, storage analytics, and safe deletion into a single application.

The main focus of the project is not only detecting duplicate filenames, but identifying duplicate file content, calculating the resulting storage impact, processing large files efficiently, and giving users controlled tools to manage unnecessary files.

The combination of FastAPI, SQLAlchemy, MySQL, Celery, Redis, React, TypeScript, Docker, and JWT authentication provides a complete full-stack implementation with a clear separation between presentation, business logic, persistence, and background processing.
