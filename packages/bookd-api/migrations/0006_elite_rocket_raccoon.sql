CREATE TABLE IF NOT EXISTS "aditionalServiceInstance" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"price" integer NOT NULL,
	"bookingId" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "aditionalServiceInstance_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskInstance" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"done" boolean DEFAULT false,
	"note" varchar,
	"isExternal" boolean DEFAULT false NOT NULL,
	"aditionalServiceInstanceId" varchar,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "taskInstance_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "aditionalService" RENAME COLUMN "serviceName" TO "name";--> statement-breakpoint
ALTER TABLE "aditionalService" DROP CONSTRAINT "aditionalService_bookingId_booking_id_fk";
--> statement-breakpoint
ALTER TABLE "roomType" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "aditionalService" DROP COLUMN IF EXISTS "bookingId";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aditionalServiceInstance" ADD CONSTRAINT "aditionalServiceInstance_bookingId_booking_id_fk" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskInstance" ADD CONSTRAINT "taskInstance_aditionalServiceInstanceId_aditionalServiceInstance_id_fk" FOREIGN KEY ("aditionalServiceInstanceId") REFERENCES "aditionalServiceInstance"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
