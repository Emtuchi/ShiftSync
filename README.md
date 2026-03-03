# ShiftSync API Postman Test Cases

###

Base URL: https://shiftsync-1.onrender.com

Use relative paths for endpoints, e.g., api/v1/locations

## Locations

POST /locations/ — Body: { "name": string, "address": string } — Create a new location

GET /locations/ — Get all locations

GET /locations/:id — Path param: id — Get a single location by ID

PUT /locations/:id — Body: { "name": string, "address": string } — Update location details

DELETE /locations/:id — Path param: id — Delete a location

## Users

POST /users/ — Body: { "name": string, "email": string, "password": string } — Create a new user

GET /users/ — Get all users

GET /users/:id — Path param: id — Get a single user by ID

PUT /users/:id — Body: { "name": string, "email": string, "password": string } — Update user details

DELETE /users/:id — Path param: id — Delete a user

POST /users/addcert — Body: { "staffId": string, "locationId": string } — Add certification for staff at a location

POST /users/:id/addAvailability — Body: { "startTime": ISOString, "endTime": ISOString } — Add availability for staff

GET /users/:id/availability — Get all availability windows for a staff member

DELETE /users/:id/availability/:availabilityId — Path param: availabilityId — Delete specific availability window

## Shifts

POST /shifts/ — Body: { "locationId": string, "startTime": ISOString, "endTime": ISOString, "requiredSkillId": string, "headcount": number } — Create a shift

GET /shifts/ — Get all shifts

GET /shifts/:id — Path param: id — Get a single shift by ID

PUT /shifts/:id — Body: { ...fields } — Update shift

DELETE /shifts/:id — Path param: id — Delete shift

POST /shifts/:id/assign — Body: { "staffId": string } — Assign staff to shift

DELETE /shifts/:id/assign — Body: { "staffId": string } — Unassign staff from shift

PUT /shifts/:id/publish — Publish shift

PUT /shifts/:id/unpublish — Unpublish shift

## Skills

POST /skills/ — Body: { "name": string } — Create a new skill

GET /skills/ — Get all skills

GET /skills/:id — Path param: id — Get skill by ID

PUT /skills/:id — Body: { "name": string } — Update skill

DELETE /skills/:id — Path param: id — Delete skill

POST /skills/assign — Body: { "staffId": string, "skillId": string } — Assign skill to staff

## Swaps

POST /swaps/request — Body: { "originalAssignmentId": string, "targetStaffId": string } — Request a swap

POST /swaps/:id/accept — Body: { "staffId": string } — Accept a swap request

POST /swaps/:id/approve — Manager approves a swap

## Fairness / Reporting

GET /fairness/staff-hours-summary — Get summary of hours worked by staff

GET /fairness/premium-shift-distribution — Get distribution of premium shifts

## Notifications

POST /notifications/ — Body: { "userId": string, "message": string } — Create a notification

GET /notifications/:userId — Path param: userId — Get all notifications for a user

PATCH /notifications/:id/read — Path param: id — Mark a notification as read
