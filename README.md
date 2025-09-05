# Metadata Catalog Backend API — Frontend Developer Guide

This document describes all the REST API endpoints your frontend will interact with to implement the metadata catalog features: user authentication, database connection management, metadata ingestion and enrichment, and automatic PII tagging.

## Table of Contents

- [Authentication](#authentication)
  - [Register](#register)
  - [Login](#login)
  - [Get Current User](#get-current-user)
- [Database Connections](#database-connections)
  - [Create Connection](#create-connection)
  - [List Connections](#list-connections)
- [Metadata Ingestion](#metadata-ingestion)
  - [Ingest Metadata](#ingest-metadata)
- [Metadata Enrichment](#metadata-enrichment)
  - [Enrich Collection Metadata](#enrich-collection-metadata)
  - [Enrich Field Metadata](#enrich-field-metadata)
- [Automatic PII Tagging](#automatic-pii-tagging)
- [Common Headers](#common-headers)
- [Authentication Flow](#authentication-flow)

## Authentication

All endpoints except `/auth/register` and `/auth/login` **require** the `Authorization` header with a valid JWT access token:

```
Authorization: Bearer 
```

### Register

> Create a new user account.

**Endpoint:**

```
POST /auth/register
```

**Request Body:**

```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string"
}
```

**Response:**

```json
{
  "email": "user@example.com",
  "id": "string"  // User ID
}
```

### Login

> Authenticate user and receive a JWT access token.

**Endpoint:**

```
POST /auth/login
```

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### Get Current User

> Retrieve current user info, verifying the JWT token.

**Endpoint:**

```
GET /auth/me
```

**Headers:**

```
Authorization: Bearer 
```

**Response:**

```json
{
  "email": "user@example.com",
  "id": "string"
}
```

## Database Connections

### Create Connection

> Save a new MongoDB connection profile. The backend will validate the connection before saving.

**Endpoint:**

```
POST /db/connect
```

**Headers:**

```
Authorization: Bearer 
Content-Type: application/json
```

**Request Body:**

```json
{
  "host": "string",                // MongoDB host
  "port": 27017,                  // (optional for Atlas)
  "username": "string",
  "password": "string",
  "database": "string"
}
```

**Response:**

```json
{
  "id": "string",                 // Connection ID
  "host": "string",
  "port": 27017,
  "username": "string",
  "database": "string",
  "created_by": "string"          // User ID
}
```

### List Connections

> List all MongoDB connections saved by the authenticated user.

**Endpoint:**

```
GET /db/connections
```

**Headers:**

```
Authorization: Bearer 
```

**Response:**

```json
[
  {
    "id": "string",               // Connection ID
    "host": "string",
    "port": 27017,
    "username": "string",
    "database": "string",
    "created_by": "string"
  },
  ...
]
```

## Metadata Ingestion

### Ingest Metadata

> Using a saved MongoDB connection, discover databases, collections, and infer fields with types. Metadata will be saved and returned.

**Endpoint:**

```
POST /ingest/mongodb/{connection_id}
```

**Path Parameters:**

- `connection_id`: string — The ID of the MongoDB connection profile (from `/db/connections`)

**Headers:**

```
Authorization: Bearer 
```

**Response:**

```json
[
  {
    "id": "string",               // Metadata document ID
    "connection_id": "string",
    "database": "string",
    "collection": "string",
    "fields": [
      { "name": "string", "type": "string" },
      ...
    ],
    "created_by": "string"
  },
  ...
]
```

## Metadata Enrichment

### Enrich Collection Metadata

> Add or update description, tags, owner for a particular metadata collection.

**Endpoint:**

```
PATCH /metadata/{metadata_id}/collection
```

**Path Parameters:**

- `metadata_id`: string — Metadata ID referring to a metadata entry from ingestion

**Headers:**

```
Authorization: Bearer 
Content-Type: application/json
```

**Request Body:** (All fields optional)

```json
{
  "description": "string",
  "tags": ["string", "string"],
  "owner": "string (email or username)"
}
```

**Response:**

```json
{
  "msg": "Collection enriched successfully."
}
```

### Enrich Field Metadata

> Add or update description and tags for a specific field inside a collection.

**Endpoint:**

```
PATCH /metadata/{metadata_id}/field/{field_name}
```

**Path Parameters:**

- `metadata_id`: string — Metadata ID
- `field_name`: string — Name of the field within the collection to enrich

**Headers:**

```
Authorization: Bearer 
Content-Type: application/json
```

**Request Body:** (All fields optional)

```json
{
  "description": "string",
  "tags": ["string", "string"]
}
```

**Response:**

```json
{
  "msg": "Field 'field_name' enriched successfully."
}
```

## Automatic PII Tagging

### Auto-detect and Tag PII Fields

> Based on field names and value samples, automatically identify and tag fields as PII or Sensitive.

**Endpoint:**

```
POST /metadata/{metadata_id}/auto-pii
```

**Path Parameters:**

- `metadata_id`: string — Metadata ID to run PII detection on

**Headers:**

```
Authorization: Bearer 
```

**Response:**

```json
{
  "msg": "PII tags added where applicable."
}
```

## Common Headers

| Header         | Description                        |
|----------------|----------------------------------|
| Authorization  | `Bearer ` (required for all protected endpoints) |
| Content-Type   | `application/json` (for POST/PATCH requests with body) |

## Authentication Flow Summary

1. **Register a user** with `/auth/register`
2. **Login** at `/auth/login` to get a JWT token
3. **Pass the JWT token** with all requests that require authentication
4. **Use `/db/connections`** to list or create MongoDB connection profiles
5. **Use `/ingest/mongodb/{connection_id}`** with a selected connection to ingest metadata
6. **Enrich metadata** with the PATCH endpoints
7. **Run PII tagging** on metadata fields via `/metadata/{metadata_id}/auto-pii`

## Example Usage Summary (Curl)

```bash
# Login → Save JWT token
curl -X POST /auth/login -d '{"username":"user","password":"pass"}'

# List connections
curl -X GET /db/connections -H "Authorization: Bearer TOKEN"

# Ingest metadata
curl -X POST /ingest/mongodb/CONNECTION_ID -H "Authorization: Bearer TOKEN"

# Enrich collection
curl -X PATCH /metadata/METADATA_ID/collection -H "Authorization: Bearer TOKEN" -d '{"description":"...","tags":[""]}'

# Enrich field
curl -X PATCH /metadata/METADATA_ID/field/FIELD_NAME -H "Authorization: Bearer TOKEN" -d '{"description":"..."}'

# Auto PII tagging
curl -X POST /metadata/METADATA_ID/auto-pii -H "Authorization: Bearer TOKEN"
```

If your frontend developer wants, I can also provide a full Postman collection or Swagger/OpenAPI docs for easy API exploration.

Let me know if you want that!
# main-104
