# ShiftSync API Postman Test Cases

### Base URL:
https://shiftsync-1.onrender.com

Use relative paths for endpoints, e.g., api/v1/locations

## LOCATIONS
### Create Location
POST /locations
```
{
  "name": "Downtown Hospital",
  "address": "123 Main Street"
}
```
### Get All Locations
GET URL/api/v1/locations

### Get Location By ID
GET URL/api/v1/locations/:id

### Update Location
PUT URL/api/v1/locations/:id
```
{
  "name": "Updated Name"
}
```

### Delete Location
DELETE URL/api/v1/locations/:id

## USERS
### Create User
POST URL/api/v1/users
```
{
  "name": "Alice",
  "email": "alice@test.com",
  "password": "password123",
  "role": "STAFF"
}
```
Note: role can be manager/staff/admin

### Get All Users
GET URL/api/v1/users
### Get User By ID
GET URL/api/v1/users/:id
### Update User
PUT URL/api/v1/users/:id
### Delete User
DELETE URL/api/v1/users/:id
### Add Certification
URL/api/v1/users/addcert
```
{
  "staffId": "USER_ID",
  "locationId": "LOCATION_ID"
}
```
### Add Availability
POST URL/api/v1/users/:id/addAvailability
```
{
  "startTime": "2026-03-05T09:00:00Z",
  "endTime": "2026-03-05T17:00:00Z"
}
```
### Get Availability
GET URL/api/v1/users/:id/availability
### Delete Availability
DELETE URL/api/v1/users/:id/availability/:availabilityId

## SKILLS
### Create Skill
POST URL/api/v1/skills
```
{
  "name": "server"
}
```
### Get Skills
GET URL/api/v1/skills
### Assign Skill
POST URL/api/v1/skills/assign
```
{
  "staffId": "USER_ID",
  "skillId": "SKILL_ID"
}
```
### Create Shift
POST URL/api/v1/shifts
```
{
  "locationId": "LOCATION_ID",
  "requiredSkillId": "SKILL_ID",
  "startTime": "2026-03-05T09:00:00Z",
  "endTime": "2026-03-05T17:00:00Z",
  "headcount": 2
}
```
### Get All Shifts
GET URL/api/v1/shifts
### Get Shift By ID
GET URL/api//shifts/:id
### Update Shift
PUT URL/api/v1/shifts/:id
### Delete Shift
DELETE URL/api/v1/shifts/:id
### Assign Staff
POST URL/api/v1/shifts/:id/assign
```
{
  "staffId": "USER_ID"
}
```
### Unassign Staff
DELETE URL/api/v1/shifts/:id/assign
```
{
  "staffId": "USER_ID"
}
```
### Publish Shift
PUT URL/api/v1/shifts/:id/publish
### Unpublish Shift
PUT URL/api/v1/shifts/:id/unpublish

## shift swap
### Request Swap
POST URL/api/v1/swaps/request
```
{
  "shiftId": "SHIFT_ID",
  "requestingStaffId": "USER_ID",
  "targetStaffId": "USER_ID"
}
```
### Accept Swap
POST URL/api/v1/swaps/:id/accept
### Approve Swap
POST URL/api/v1/swaps/:id/approve

## FAIRNESS ANALYTICS
### Staff Hours Summary
GET URL/api/v1/fairness/staff-hours-summary
### Premium Shift Distribution
GET URL/api/v1/fairness/premium-shift-distribution

## NOTIFICATIONS
### Create Notification
POST URL/api/v1/notifications
```
{
  "userId": "USER_ID",
  "message": "Shift updated"
}
```
### Get User Notifications
GET URL/api/v1/notifications/:userId
### Mark Notification Read
PATCH URL/api/v1/notifications/:id/read

# ShiftSync Backend Limitations

## User Management & Roles

- Role-based restrictions are incomplete; - managers can be treated as staff or create other managers.
- Certification logic is basic; no duplicate checks or validation of location existence.
- Skills are only validated during shift assignment, not on user creation or updates.

## Shift Scheduling

Basic shift creation and assignment work, but:
- Cross-timezone conflicts are not checked.
- Overnight shifts are miscounted in daily/weekly hours.
- Minimum 10-hour gap between shifts is not enforced.

## Availability & Scheduling Constraints

- Overlapping availability windows are not validated.
- Recurring availability is not supported.
- No timezone handling; assumes server local time.
- Overtime & Labor Law Compliance
Daily/weekly hours monitored, but warnings are console-only.
- Weekly overtime limits are not enforced.
- Consecutive days calculation uses calendar days, not actual shift durations.

## Swap / Coverage System

- Swap requests do not auto-cancel if shifts are edited.
- Pending swap/drop request limits (3 per staff) are not enforced but exists.
- Drop request expiries (24h before shift) are not implemented.
- Notifications exist but are not real-time or fully integrated with workflows.

## Fairness Analytics

- Staff hours and premium shift summaries exist.
- No fairness scoring or tracking of “desirable shifts” for inequities.

## Real-Time Functionality
- REST-only backend; no WebSocket or live updates.
- Simultaneous assignment conflicts are not detected automatically.

## Notifications & Communication

- Users cannot set preferences.
Notifications are API-only; no real-time push.
- Swap and assignment workflows are not fully integrated with notifications.

## Time Handling & Calendar Features

- No timezone awareness; shifts/availability may mismatch across locations.
- Overnight shifts not fully integrated with overtime or consecutive-day checks.
Daylight saving and recurring availability are unsupported.

## Audit Trail & History

- No structured logging for edits, assignments, or deletions.
- Managers cannot view full history; admins cannot export logs.

## Edge Case Handling

- Partial enforcement of key constraints (skills, location, hours).
- Scenarios like cross-timezone staff, simultaneous assignments, change-of-mind swaps, and last-minute cancellations are not fully handled.
