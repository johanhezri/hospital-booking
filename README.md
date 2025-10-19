# Hospital Booking

A NestJS + TypeORM backend for hospital appointment booking. It supports multiple hospitals, doctors and patients, JWT auth, email notifications, scheduled reminders and a REST API with Swagger docs.

## Quick links to key files and symbols

- Project entry / DI root: [`AppModule`](src/app.module.ts) ([src/app.module.ts](src/app.module.ts))
- App bootstrap: [`bootstrap()` in src/main.ts](src/main.ts)
- Database config: [`databaseConfig`](src/config/database.config.ts) ([src/config/database.config.ts](src/config/database.config.ts))
- TypeORM datasource for migrations/seeds: [src/database/datasource.ts](src/database/datasource.ts)
- Auth endpoints & logic: [`AuthController`](src/modules/auth/auth.controller.ts) / [`AuthService`](src/modules/auth/auth.service.ts) ([src/modules/auth/auth.controller.ts](src/modules/auth/auth.controller.ts), [src/modules/auth/auth.service.ts](src/modules/auth/auth.service.ts))
- Hospitals API: [`HospitalsController`](src/modules/hospitals/hospitals.controller.ts) / [`HospitalsService`](src/modules/hospitals/hospitals.service.ts) ([src/modules/hospitals/hospitals.controller.ts](src/modules/hospitals/hospitals.controller.ts), [src/modules/hospitals/hospitals.service.ts](src/modules/hospitals/hospitals.service.ts))
- Appointments API: [`AppointmentsController`](src/modules/appointments/appointments.controller.ts) / [`AppointmentsService`](src/modules/appointments/appointments.service.ts) ([src/modules/appointments/appointments.controller.ts](src/modules/appointments/appointments.controller.ts), [src/modules/appointments/appointments.service.ts](src/modules/appointments/appointments.service.ts))
- Doctors API: [`DoctorsController`](src/modules/doctors/doctors.controller.ts) / [`DoctorsService`](src/modules/doctors/doctors.service.ts) ([src/modules/doctors/doctors.controller.ts](src/modules/doctors/doctors.controller.ts), [src/modules/doctors/doctors.service.ts](src/modules/doctors/doctors.service.ts))
- Calendars (working schedules & slots): [`CalendarsController`](src/modules/calendars/calendars.controller.ts) / [`CalendarsService`](src/modules/calendars/calendars.service.ts) ([src/modules/calendars/calendars.controller.ts](src/modules/calendars/calendars.controller.ts), [src/modules/calendars/calendars.service.ts](src/modules/calendars/calendars.service.ts))
- Mailer: [`MailService`](src/modules/mail/mail.service.ts) ([src/modules/mail/mail.service.ts](src/modules/mail/mail.service.ts))
- Scheduled reminders job: [`RemindersService`](src/modules/jobs/reminders.service.ts) ([src/modules/jobs/reminders.service.ts](src/modules/jobs/reminders.service.ts))
- Package scripts: [package.json](package.json)

## Getting started - Local

### 1. Install dependancies

```sh
npm install
```

### 2. Environment
   Create a `.env` at project root

- DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
- JWT_SECRET
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- PORT

### 3. Database

- Configure DB details in [src/config/database.config.ts](src/config/database.config.ts).
- Create DB in Postgres and run migrations:

```sh
# run migrations (uses the configured datasource)
npm run migration:run
```

- Seed admin user:

```sh
# uses typeorm-extension and datasource.ts
npm run seed:run -- -d datasource.ts -n Admin1760604629025
```

### 4. Run the app

- Development (watch / hot reload):

```sh
npm run start:dev
```

### 5. Swagger API docs

- After starting the server, Swagger is available at: http://localhost:3000/api (see [src/main.ts](src/main.ts))

Postman / API summary (recommended collections)

Top-level route groups and representative endpoints (controller -> route):

- Auth [`AuthController`](src/modules/auth/auth.controller.ts) ([src/modules/auth/auth.controller.ts](src/modules/auth/auth.controller.ts))

  - POST /auth/login - login, returns access + refresh tokens
  - POST /auth/refresh - refresh tokens
  - POST /auth/register/patient - create patient
  - POST /auth/register/doctor - create doctor (requires JWT + Roles: admin/staff)
  - POST /auth/logout - invalidate refresh token

- Hospitals [`HospitalsController`](src/modules/hospitals/hospitals.controller.ts) ([src/modules/hospitals/hospitals.controller.ts](src/modules/hospitals/hospitals.controller.ts))

  - POST /hospitals - create hospital
  - GET /hospitals - list hospitals
  - GET /hospitals/:id - get hospital
  - PATCH /hospitals/:id - update
  - DELETE /hospitals/:id - soft-delete

- Doctors [`DoctorsController`](src/modules/doctors/doctors.controller.ts) ([src/modules/doctors/doctors.controller.ts](src/modules/doctors/doctors.controller.ts))

  - GET /doctors - list doctors
  - GET /doctors/:id - doctor detail

- Calendars [`CalendarsController`](src/modules/calendars/calendars.controller.ts) ([src/modules/calendars/calendars.controller.ts](src/modules/calendars/calendars.controller.ts))

  - POST /calendars/:doctorId/schedules?hospitalId=... - add working schedule (authenticated)
  - GET /calendars/:doctorId/schedules - list schedules

- Appointments [`AppointmentsController`](src/modules/appointments/appointments.controller.ts) ([src/modules/appointments/appointments.controller.ts](src/modules/appointments/appointments.controller.ts))

  - POST /appointments - book appointment (payload: hospitalId, doctorId, patientId, startsAt, endsAt)
  - GET /appointments - list
  - GET /appointments/:id - detail

- Reminders / Jobs
  - Reminders are scheduled by [`RemindersService`](src/modules/jobs/reminders.service.ts) and send emails using [`MailService`](src/modules/mail/mail.service.ts). You can simulate/trigger manually by invoking the job method in a short script or by temporarily enabling a route that calls it during development.

## Postman collection structure

- Auth
  - Register (Patient)
  - Login
  - Refresh Token
  - Logout
- Admin
  - Create Hospital
  - Get Hospitals
- Staff
  - Register Doctor
  - Add Doctor Schedule
  - View Doctor Schedule
  - Book Appointment (for patient)
  - Cancel Appointment
- Patient
  - View Hospitals
  - View Doctors by Hospital
  - View Available Slots
  - Book Appointment
  - Cancel Appointment
- CRON (manual)
  - Trigger Send Reminders (simulate)

## Notes

- JWT strategy reads secret from env: see [`JwtStrategy`](src/modules/auth/strategies/jwt.strategy.ts) ([src/modules/auth/strategies/jwt.strategy.ts](src/modules/auth/strategies/jwt.strategy.ts)).
- Passwords and refresh tokens are hashed with bcrypt (see [`AuthService`](src/modules/auth/auth.service.ts)).
- Time handling: doctor schedules and slot computation use Luxon in [`CalendarsService`](src/modules/calendars/calendars.service.ts); timezone conversions helpers are in [`TimezoneService`](src/common/timezone/timezone.service.ts).
- TypeORM entities are auto-loaded in [src/database/datasource.ts](src/database/datasource.ts).
- Migrations live under [src/database/migrations](src/database/migrations). If you change entities, generate a migration then run it.

## Docker

- A Dockerfile is included to build and run the app in a container. Ensure env vars and a Postgres instance are available to the container before running. See [Dockerfile](Dockerfile).
