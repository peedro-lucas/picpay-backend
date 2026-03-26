CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"balance" numeric(10, 2) DEFAULT '0',
	"type" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
