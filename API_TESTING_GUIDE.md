# API Testing Guide - Portfolio Application

## Overview
This document provides comprehensive API endpoints and testing scenarios for the portfolio application.

---

## 📋 Table of Contents
1. [Contact Form API](#contact-form-api)
2. [Firebase Firestore APIs](#firebase-firestore-apis)
3. [Firebase Authentication APIs](#firebase-authentication-apis)
4. [Testing Tools & Setup](#testing-tools--setup)
5. [API Test Cases](#api-test-cases)

---

## 🔌 1. Contact Form API

### Web3Forms API
**Provider:** Web3Forms  
**Documentation:** https://web3forms.com/

#### Endpoint
```
POST https://api.web3forms.com/submit
```

#### Request Headers
```
Content-Type: multipart/form-data
```

#### Request Body
```json
{
  "access_key": "YOUR_WEB3FORMS_ACCESS_KEY",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, this is a test message"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Invalid access key"
}
```

#### Test Cases

##### TC-CF-001: Valid Form Submission
```bash
curl -X POST https://api.web3forms.com/submit \
  -F "access_key=YOUR_ACCESS_KEY" \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "message=This is a test message from API testing"
```

**Expected Result:** 200 OK with success: true

##### TC-CF-002: Missing Required Fields
```bash
curl -X POST https://api.web3forms.com/submit \
  -F "access_key=YOUR_ACCESS_KEY" \
  -F "name=Test User"
```

**Expected Result:** 400 Bad Request

##### TC-CF-003: Invalid Email Format
```bash
curl -X POST https://api.web3forms.com/submit \
  -F "access_key=YOUR_ACCESS_KEY" \
  -F "name=Test User" \
  -F "email=invalid-email" \
  -F "message=Test message"
```

**Expected Result:** Client-side validation should catch this

##### TC-CF-004: Invalid Access Key
```bash
curl -X POST https://api.web3forms.com/submit \
  -F "access_key=INVALID_KEY" \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "message=Test message"
```

**Expected Result:** 400 Bad Request with error message

---

## 🔥 2. Firebase Firestore APIs

### Base Configuration
```
Project ID: portfolio-admin-console-4717d
Region: us-central1
Database: Firestore (Native Mode)
```

### Collections

#### 2.1 Projects Collection
**Collection Name:** `projects`

##### Get All Projects
```javascript
// Firestore Query
const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
const querySnapshot = await getDocs(q);
```

**REST API Equivalent:**
```
GET https://firestore.googleapis.com/v1/projects/portfolio-admin-console-4717d/databases/(default)/documents/projects
```

**Response Schema:**
```json
{
  "documents": [
    {
      "name": "projects/PROJECT_ID",
      "fields": {
        "name": { "stringValue": "Project Name" },
        "description": { "stringValue": "Project description" },
        "image": { "stringValue": "https://..." },
        "tags": { "arrayValue": { "values": [...] } },
        "sourceCodeLink": { "stringValue": "https://github.com/..." },
        "createdAt": { "timestampValue": "2024-01-01T00:00:00Z" }
      }
    }
  ]
}
```

##### Add New Project
```javascript
await addDoc(collection(db, 'projects'), {
  name: "New Project",
  description: "Project description",
  image: "https://example.com/image.jpg",
  tags: [
    { name: "React", color: "text-blue-500" },
    { name: "TypeScript", color: "text-blue-600" }
  ],
  sourceCodeLink: "https://github.com/username/repo",
  createdAt: Timestamp.now()
});
```

##### Update Project
```javascript
await updateDoc(doc(db, 'projects', PROJECT_ID), {
  name: "Updated Project Name",
  updatedAt: Timestamp.now()
});
```

##### Delete Project
```javascript
await deleteDoc(doc(db, 'projects', PROJECT_ID));
```

#### 2.2 Experience Collection
**Collection Name:** `experiences`

**Document Schema:**
```json
{
  "title": "Job Title",
  "companyName": "Company Name",
  "icon": "https://...",
  "iconBg": "#FFFFFF",
  "date": "Jan 2023 - Present",
  "points": [
    "Responsibility 1",
    "Responsibility 2"
  ],
  "createdAt": "timestamp"
}
```

#### 2.3 Skills Collection
**Collection Name:** `skills`

**Document Schema:**
```json
{
  "category": "Frontend Development",
  "technologies": [
    { "name": "React", "icon": "https://..." },
    { "name": "TypeScript", "icon": "https://..." }
  ],
  "createdAt": "timestamp"
}
```

#### 2.4 Education Collection
**Collection Name:** `education`

**Document Schema:**
```json
{
  "degree": "Bachelor of Science",
  "institution": "University Name",
  "year": "2020-2024",
  "description": "Description",
  "createdAt": "timestamp"
}
```

---

## 🔐 3. Firebase Authentication APIs

### Base URL
```
https://identitytoolkit.googleapis.com/v1/accounts
```

### 3.1 Sign Up (Create Account)

**Endpoint:**
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_API_KEY
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePassword123",
  "returnSecureToken": true
}
```

**Success Response:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs...",
  "email": "admin@example.com",
  "refreshToken": "...",
  "expiresIn": "3600",
  "localId": "USER_ID"
}
```

### 3.2 Sign In (Login)

**Endpoint:**
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePassword123",
  "returnSecureToken": true
}
```

**Success Response:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs...",
  "email": "admin@example.com",
  "refreshToken": "...",
  "expiresIn": "3600",
  "localId": "USER_ID",
  "registered": true
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": 400,
    "message": "INVALID_PASSWORD",
    "errors": [...]
  }
}
```

### 3.3 Sign Out

**Client-Side:**
```javascript
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';

await signOut(auth);
```

---

## 🛠️ 4. Testing Tools & Setup

### 4.1 Postman Collection

Create a Postman collection with the following requests:

#### Environment Variables
```
BASE_URL: http://localhost:5173
WEB3FORMS_API: https://api.web3forms.com/submit
WEB3FORMS_KEY: YOUR_ACCESS_KEY
FIREBASE_API_KEY: YOUR_FIREBASE_API_KEY
```

### 4.2 cURL Commands

#### Test Contact Form
```bash
# Success Case
curl -X POST https://api.web3forms.com/submit \
  -H "Content-Type: multipart/form-data" \
  -F "access_key=$WEB3FORMS_KEY" \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "message=This is a test message"

# Invalid Email
curl -X POST https://api.web3forms.com/submit \
  -F "access_key=$WEB3FORMS_KEY" \
  -F "name=Test User" \
  -F "email=invalid-email" \
  -F "message=Test"

# Missing Fields
curl -X POST https://api.web3forms.com/submit \
  -F "access_key=$WEB3FORMS_KEY" \
  -F "name=Test User"
```

### 4.3 JavaScript/Fetch Testing

```javascript
// Test Contact Form API
async function testContactForm() {
  const formData = new FormData();
  formData.append('access_key', 'YOUR_ACCESS_KEY');
  formData.append('name', 'Test User');
  formData.append('email', 'test@example.com');
  formData.append('message', 'Test message');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 4.4 Automated Testing with Jest

```javascript
// contactForm.test.js
describe('Contact Form API', () => {
  test('should submit form successfully', async () => {
    const formData = new FormData();
    formData.append('access_key', process.env.WEB3FORMS_KEY);
    formData.append('name', 'Test User');
    formData.append('email', 'test@example.com');
    formData.append('message', 'Test message');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    expect(response.ok).toBe(true);
    expect(result.success).toBe(true);
  });

  test('should fail with invalid access key', async () => {
    const formData = new FormData();
    formData.append('access_key', 'INVALID_KEY');
    formData.append('name', 'Test User');
    formData.append('email', 'test@example.com');
    formData.append('message', 'Test message');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    expect(response.ok).toBe(false);
  });
});
```

---

## 📝 5. API Test Cases

### 5.1 Contact Form Tests

| Test ID | Test Case | Method | Expected Result | Priority |
|---------|-----------|--------|-----------------|----------|
| CF-001 | Valid form submission | POST | 200 OK, success: true | High |
| CF-002 | Missing name field | POST | Client validation error | High |
| CF-003 | Missing email field | POST | Client validation error | High |
| CF-004 | Invalid email format | POST | Client validation error | High |
| CF-005 | Missing message field | POST | Client validation error | High |
| CF-006 | Message too short (<10 chars) | POST | Client validation error | Medium |
| CF-007 | Invalid access key | POST | 400 Bad Request | High |
| CF-008 | Network timeout | POST | Retry mechanism | Medium |
| CF-009 | Offline submission | POST | Queue for later | High |
| CF-010 | Special characters in message | POST | 200 OK | Low |

### 5.2 Firebase Firestore Tests

| Test ID | Test Case | Operation | Expected Result | Priority |
|---------|-----------|-----------|-----------------|----------|
| FS-001 | Get all projects | READ | Array of projects | High |
| FS-002 | Add new project | CREATE | Project ID returned | High |
| FS-003 | Update project | UPDATE | Success confirmation | High |
| FS-004 | Delete project | DELETE | Success confirmation | High |
| FS-005 | Get projects with ordering | READ | Ordered by createdAt desc | Medium |
| FS-006 | Add project without required fields | CREATE | Validation error | High |
| FS-007 | Update non-existent project | UPDATE | Error message | Medium |
| FS-008 | Delete non-existent project | DELETE | Error message | Medium |
| FS-009 | Concurrent updates | UPDATE | Last write wins | Low |
| FS-010 | Large dataset retrieval | READ | Paginated results | Low |

### 5.3 Firebase Authentication Tests

| Test ID | Test Case | Operation | Expected Result | Priority |
|---------|-----------|-----------|-----------------|----------|
| AUTH-001 | Sign up with valid credentials | SIGNUP | User created, token returned | High |
| AUTH-002 | Sign up with existing email | SIGNUP | Error: EMAIL_EXISTS | High |
| AUTH-003 | Sign up with weak password | SIGNUP | Error: WEAK_PASSWORD | High |
| AUTH-004 | Sign in with valid credentials | LOGIN | Token returned | High |
| AUTH-005 | Sign in with invalid password | LOGIN | Error: INVALID_PASSWORD | High |
| AUTH-006 | Sign in with non-existent email | LOGIN | Error: EMAIL_NOT_FOUND | High |
| AUTH-007 | Sign out | LOGOUT | Success | High |
| AUTH-008 | Access protected route without auth | ACCESS | Redirect to login | High |
| AUTH-009 | Token expiration | ACCESS | Refresh token | Medium |
| AUTH-010 | Multiple concurrent sessions | LOGIN | All sessions valid | Low |

---

## 🔍 6. Testing Scenarios

### Scenario 1: Complete User Flow
```
1. User visits portfolio
2. Navigates to contact section
3. Fills form with valid data
4. Submits form
5. Receives success message
6. Form clears
```

**API Calls:**
- POST to Web3Forms API

### Scenario 2: Admin Workflow
```
1. Admin navigates to /login
2. Logs in with credentials
3. Accesses dashboard
4. Adds new project
5. Updates existing project
6. Deletes old project
7. Logs out
```

**API Calls:**
- POST to Firebase Auth (login)
- GET from Firestore (fetch projects)
- POST to Firestore (add project)
- PUT to Firestore (update project)
- DELETE from Firestore (delete project)
- POST to Firebase Auth (logout)

### Scenario 3: Offline Handling
```
1. User fills contact form
2. Network goes offline
3. User submits form
4. Form is queued
5. Network comes back online
6. Form auto-submits
```

**API Calls:**
- POST to Web3Forms API (queued, then executed)

---

## 📊 7. Performance Testing

### Load Testing Endpoints

```bash
# Using Apache Bench
ab -n 100 -c 10 -p form-data.txt -T "multipart/form-data" \
  https://api.web3forms.com/submit

# Using Artillery
artillery quick --count 10 --num 100 \
  https://api.web3forms.com/submit
```

### Expected Performance Metrics
- **Contact Form API:** < 500ms response time
- **Firestore Read:** < 200ms
- **Firestore Write:** < 300ms
- **Auth Login:** < 400ms

---

## 🔒 8. Security Testing

### Test Cases

1. **SQL Injection Prevention**
   - Input: `'; DROP TABLE users; --`
   - Expected: Sanitized, no SQL execution

2. **XSS Prevention**
   - Input: `<script>alert('XSS')</script>`
   - Expected: Escaped, no script execution

3. **CSRF Protection**
   - Test: Submit form from different origin
   - Expected: CORS policy blocks request

4. **Rate Limiting**
   - Test: Send 100 requests in 1 second
   - Expected: Rate limit error after threshold

---

## 📱 9. API Endpoints Summary

### Public Endpoints (No Auth Required)
```
POST /api/web3forms/submit          - Contact form submission
GET  /api/projects                  - Get all projects (public view)
```

### Protected Endpoints (Auth Required)
```
POST   /api/auth/signup             - Create admin account
POST   /api/auth/login              - Admin login
POST   /api/auth/logout             - Admin logout
GET    /api/projects                - Get all projects (admin)
POST   /api/projects                - Create project
PUT    /api/projects/:id            - Update project
DELETE /api/projects/:id            - Delete project
GET    /api/experience              - Get all experience
POST   /api/experience              - Create experience
PUT    /api/experience/:id          - Update experience
DELETE /api/experience/:id          - Delete experience
GET    /api/skills                  - Get all skills
POST   /api/skills                  - Create skill
PUT    /api/skills/:id              - Update skill
DELETE /api/skills/:id              - Delete skill
GET    /api/education               - Get all education
POST   /api/education               - Create education
PUT    /api/education/:id           - Update education
DELETE /api/education/:id           - Delete education
```

---

## 🎯 10. Quick Test Commands

### Test Contact Form (Success)
```bash
curl -X POST https://api.web3forms.com/submit \
  -F "access_key=$VITE_WEB3FORMS_ACCESS_KEY" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "message=Hello, this is a test message from the API testing suite."
```

### Test Contact Form (Validation Error)
```bash
curl -X POST https://api.web3forms.com/submit \
  -F "access_key=$VITE_WEB3FORMS_ACCESS_KEY" \
  -F "name=John Doe"
```

### Test Firebase Auth (Login)
```bash
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$FIREBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password",
    "returnSecureToken": true
  }'
```

---

## 📚 Additional Resources

- **Web3Forms Docs:** https://docs.web3forms.com/
- **Firebase Firestore Docs:** https://firebase.google.com/docs/firestore
- **Firebase Auth Docs:** https://firebase.google.com/docs/auth
- **Postman:** https://www.postman.com/
- **cURL Documentation:** https://curl.se/docs/

---

**Last Updated:** 2025-12-20  
**Version:** 1.0.0  
**Maintained By:** Portfolio Development Team
