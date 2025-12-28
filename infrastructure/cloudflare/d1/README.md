# D1 Database Infrastructure Configuration

This directory contains Terraform templates for Cloudflare D1 database deployment.

## Components

- `main.tf` - Main D1 database configuration
- `schema/` - Database schema definitions
- `migrations/` - Migration scripts
- `backups/` - Backup and restore procedures
- `seeds/` - Seed data management

## Database Schema

### Core Tables

- `tenants` - Business tenant information
- `users` - User accounts and profiles
- `appointments` - Booking appointments
- `services` - Available services
- `staff_schedules` - Employee schedules

### Extended Tables

- `products` - E-commerce products
- `orders` - Shopping orders
- `ai_conversations` - AI chat history
- `calendar_connections` - Google Calendar integration
- `marketing_campaigns` - Marketing automation

### Security Tables

- `roles` - RBAC roles
- `user_roles` - User role assignments
- `role_audit_log` - Security audit trail

## Features

- Automated migrations
- Backup scheduling
- Data seeding
- Performance optimization
- Security policies
