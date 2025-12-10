# Architecture Specification

This document outlines the architecture for the Appointment Booking SaaS platform.

## 1. Overview

The platform is a multi-tenant SaaS application built on a modern web stack. It is designed to be scalable, secure, and maintainable.

## 2. Technology Stack

- **Frontend:** Next.js (React)
- **Backend:** Next.js API Routes and Cloudflare Workers
- **Database:** Supabase (PostgreSQL) with Drizzle ORM
- **Authentication:** NextAuth.js
- **Deployment:** Vercel and Cloudflare

## 3. System Architecture

The system is composed of the following components:

- **Marketing Website:** A static Next.js site for marketing and user acquisition.
- **Booking Application:** A Next.js application for clients to book appointments.
- **Dashboard Application:** A Next.js application for salon owners to manage their business.
- **API:** A set of serverless functions (Next.js API Routes and Cloudflare Workers) that provide the backend logic.
- **Database:** A PostgreSQL database hosted on Supabase for data storage.

## 4. Data Model

The data model is defined in the `@repo/db` package using Drizzle ORM. The main tables are:

- `tenants`
- `users`
- `appointments`
- `services`
- `employees`

## 5. Authentication and Authorization

Authentication is handled by NextAuth.js with Google as the primary OAuth provider. Authorization is managed through a role-based access control (RBAC) system, with roles such as `admin` and `customer`.

## 6. Deployment and Infrastructure

The applications and API are deployed on Vercel and Cloudflare. The database is hosted on Supabase. This provides a scalable and resilient infrastructure.
