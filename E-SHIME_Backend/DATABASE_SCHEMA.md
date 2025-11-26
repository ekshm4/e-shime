# Database Schema (Inferred from Backend Code)
This document describes the MySQL schema inferred from the SQL used in the backend models. It is not an authoritative migration file, but a specification you can adapt into real `CREATE TABLE` statements.

Database: `eshime_db` (from `src/config/database.js`).

---

## Table: `users`

Stores application users (regular users and admins).

**Columns**
- `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `name` VARCHAR(255) NOT NULL
- `email` VARCHAR(255) NOT NULL UNIQUE
- `password` VARCHAR(255) NOT NULL
- `role` VARCHAR(50) NOT NULL DEFAULT 'user'  
  - Expected values (from code): `'user'`, possibly `'admin'`
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP

**Used in code**
- Insert: `INSERT INTO users (name, email, password, role, created_at)`
- Queries by:
  - `email`
  - `id`
  - `role = "user"` (for user stats)
- Joined by other tables via `user_id` (e.g. `bookings`, `stories`, `story_likes`, `story_comments`, `messages`, `mood_logs`).

**Indexes**
- `PRIMARY KEY (id)`
- `UNIQUE KEY users_email_unique (email)`
- Optional: `INDEX users_role_index (role)`

---

## Table: `therapists`

Stores therapist profiles exposed to users.

**Columns**
- `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `name` VARCHAR(255) NOT NULL
- `specialization` VARCHAR(255) NOT NULL
- `languages` TEXT NOT NULL  
  - JSON-encoded array (stored with `JSON.stringify` in code)
- `experience` INT UNSIGNED NOT NULL  
  - Interpreted as years of experience
- `rating` DECIMAL(3,2) NOT NULL DEFAULT 5.00
- `avatar` VARCHAR(255) NOT NULL DEFAULT '👨🏾‍⚕️'
- `status` VARCHAR(50) NOT NULL DEFAULT 'available'  
  - Code uses value `'available'` and filters by it
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP

**Used in code**
- Insert: `INSERT INTO therapists (name, specialization, languages, experience, rating, avatar, status, created_at)`
- Select: multiple fields including `languages`, which is parsed as JSON in code
- Updated fields:
  - `status` (for availability)
  - `rating`

**Relationships**
- Referenced by `bookings.therapist_id`.

**Indexes**
- `PRIMARY KEY (id)`
- Optional: `INDEX therapists_status_index (status)`
- Optional: `INDEX therapists_name_index (name)`

---

## Table: `bookings`

Represents therapy session bookings between a `user` and a `therapist`.

**Columns**
- `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `user_id` INT UNSIGNED NOT NULL
- `therapist_id` INT UNSIGNED NOT NULL
- `booking_date` DATE NOT NULL
- `booking_time` TIME NOT NULL
- `status` VARCHAR(50) NOT NULL DEFAULT 'pending'  
  - Code uses values such as `'pending'`, `'completed'`, `'cancelled'`
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP

**Used in code**
- Insert: `INSERT INTO bookings (user_id, therapist_id, booking_date, booking_time, status, created_at)`
- Select:
  - By `user_id` (with join to `therapists`)
  - By `therapist_id` (with join to `users`)
- Updates:
  - `status` and `updated_at`
  - Set `status = "cancelled"` with user ownership check

**Relationships**
- `user_id` → `users.id`
- `therapist_id` → `therapists.id`

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX bookings_user_id_index (user_id)`
- `INDEX bookings_therapist_id_index (therapist_id)`
- Optional: `INDEX bookings_date_time_index (booking_date, booking_time)`

---

## Table: `stories`

User-submitted stories with optional anonymity, media, likes, and comments.

**Columns**
- `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `user_id` INT UNSIGNED NOT NULL
- `title` VARCHAR(255) NOT NULL
- `content` TEXT NOT NULL
- `anonymous_name` VARCHAR(255) NULL
- `story_type` VARCHAR(50) NOT NULL DEFAULT 'text'  
  - Code uses default `'text'`
- `media_url` VARCHAR(512) NULL
- `likes_count` INT UNSIGNED NOT NULL DEFAULT 0
- `comments_count` INT UNSIGNED NOT NULL DEFAULT 0
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP

**Used in code**
- Insert: `INSERT INTO stories (user_id, title, content, anonymous_name, story_type, media_url, likes_count, comments_count, created_at)`
- Selected by:
  - Recent stories (paginated, ordered by `created_at`)
  - `user_id`
  - `id`
- Counters updated via `likes_count = likes_count ± 1` and `comments_count = comments_count + 1`.

**Relationships**
- `user_id` → `users.id`
- Referenced by:
  - `story_likes.story_id`
  - `story_comments.story_id`

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX stories_user_id_index (user_id)`
- `INDEX stories_created_at_index (created_at)`

---

## Table: `story_likes`

Tracks which users liked which stories.

**Columns**
- `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `story_id` INT UNSIGNED NOT NULL
- `user_id` INT UNSIGNED NOT NULL
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

**Used in code**
- Check if liked: `SELECT id FROM story_likes WHERE story_id = ? AND user_id = ?`
- Insert: `INSERT INTO story_likes (story_id, user_id, created_at)`
- Delete: `DELETE FROM story_likes WHERE story_id = ? AND user_id = ?`

**Relationships**
- `story_id` → `stories.id`
- `user_id` → `users.id`

**Indexes & Constraints**
- `PRIMARY KEY (id)`
- `UNIQUE KEY story_likes_story_user_unique (story_id, user_id)`  
  - Enforces single like per user per story
- `INDEX story_likes_user_id_index (user_id)`

---

## Table: `story_comments`

Stores comments users make on stories.

**Columns**
- `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `story_id` INT UNSIGNED NOT NULL
- `user_id` INT UNSIGNED NOT NULL
- `comment_text` TEXT NOT NULL
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

**Used in code**
- Insert: `INSERT INTO story_comments (story_id, user_id, comment_text, created_at)`
- Select (with join to `users`):
  - `SELECT sc.id, sc.comment_text, sc.created_at, u.name as user_name FROM story_comments sc JOIN users u ON sc.user_id = u.id WHERE sc.story_id = ?`

**Relationships**
- `story_id` → `stories.id`
- `user_id` → `users.id`

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX story_comments_story_id_index (story_id)`
- `INDEX story_comments_user_id_index (user_id)`
- Optional: `INDEX story_comments_created_at_index (created_at)`

---

## Table: `messages`

Chat messages for therapist chats, peer chats, and private direct messages.

**Columns**
- `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `sender_id` INT UNSIGNED NOT NULL
- `receiver_id` INT UNSIGNED NULL  
  - May be `NULL` for room types that do not require a direct receiver (e.g. group/peer rooms)
- `room_type` VARCHAR(50) NOT NULL  
  - Used values in code: `'therapist'`, `'peer'`, `'private'`
- `message_text` TEXT NOT NULL
- `sender_type` VARCHAR(50) NOT NULL  
  - Indicates who sent the message (e.g. user vs therapist vs system)
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

**Used in code**
- Insert: `INSERT INTO messages (sender_id, receiver_id, room_type, message_text, sender_type, created_at)`
- Queries:
  - By room/user: `room_type` plus `(sender_id = ? OR receiver_id = ? OR room_type = 'peer')`
  - Private messages between two users (`room_type = 'private'`)
  - Recent rooms: selects `other_user_id` and groups/filters by `room_type = 'therapist'`
- Cleanup: delete messages older than `N` days.

**Relationships**
- `sender_id` → `users.id`
- `receiver_id` → `users.id` (nullable)

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX messages_sender_id_index (sender_id)`
- `INDEX messages_receiver_id_index (receiver_id)`
- `INDEX messages_room_type_index (room_type)`
- `INDEX messages_created_at_index (created_at)`

---

## Table: `mood_logs`

Stores daily mood logs for each user, with optional journal notes.

**Columns**
- `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT
- `user_id` INT UNSIGNED NOT NULL
- `mood_value` TINYINT NOT NULL  
  - Numeric mood value (e.g. scale 1–5) inferred from usage
- `mood_label` VARCHAR(50) NOT NULL  
  - Descriptive label for mood (e.g. "Happy", "Sad")
- `journal_note` TEXT NULL
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

**Used in code**
- Insert: `INSERT INTO mood_logs (user_id, mood_value, mood_label, journal_note, created_at)`
- Queries by:
  - `user_id` (recent logs, ordered by `created_at`)
  - `id` and `user_id` together (ownership)
- Aggregations:
  - Per-user mood statistics with `GROUP BY mood_value, mood_label, DATE(created_at)`
  - Average mood over last N days
  - Distribution of moods over a time window (with percentage of total logs)
- Used for user activity stats: counts distinct `user_id` over last 7 days.

**Relationships**
- `user_id` → `users.id`

**Indexes**
- `PRIMARY KEY (id)`
- `INDEX mood_logs_user_id_index (user_id)`
- `INDEX mood_logs_created_at_index (created_at)`

---

## Relationships Overview

High-level foreign key relationships among tables:

- `bookings.user_id` → `users.id`
- `bookings.therapist_id` → `therapists.id`
- `stories.user_id` → `users.id`
- `story_likes.story_id` → `stories.id`
- `story_likes.user_id` → `users.id`
- `story_comments.story_id` → `stories.id`
- `story_comments.user_id` → `users.id`
- `messages.sender_id` → `users.id`
- `messages.receiver_id` → `users.id`
- `mood_logs.user_id` → `users.id`

These relationships are implied by the queries and joins used in the backend and should be enforced with `FOREIGN KEY` constraints in your actual DDL if you want referential integrity.
