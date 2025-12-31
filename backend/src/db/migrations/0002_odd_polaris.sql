ALTER TABLE "document_texts" DROP CONSTRAINT "document_texts_document_id_documents_id_fk";
--> statement-breakpoint
ALTER TABLE "document_transactions" DROP CONSTRAINT "document_transactions_document_id_documents_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "document_texts" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "document_texts" ADD COLUMN "language" text NOT NULL;--> statement-breakpoint
ALTER TABLE "document_texts" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "document_texts" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "document_transactions" ADD COLUMN "extracted_json" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "document_transactions" ADD COLUMN "source" text;--> statement-breakpoint
ALTER TABLE "document_transactions" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "document_transactions" ADD CONSTRAINT "document_transactions_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_texts" DROP COLUMN "raw_text";--> statement-breakpoint
ALTER TABLE "document_texts" DROP COLUMN "translated_text";--> statement-breakpoint
ALTER TABLE "document_transactions" DROP COLUMN "doc_no";--> statement-breakpoint
ALTER TABLE "document_transactions" DROP COLUMN "execution_date";--> statement-breakpoint
ALTER TABLE "document_transactions" DROP COLUMN "registration_date";--> statement-breakpoint
ALTER TABLE "document_transactions" DROP COLUMN "nature";--> statement-breakpoint
ALTER TABLE "document_transactions" DROP COLUMN "consideration_value";--> statement-breakpoint
ALTER TABLE "document_transactions" DROP COLUMN "market_value";--> statement-breakpoint
ALTER TABLE "document_transactions" DROP COLUMN "survey_numbers";--> statement-breakpoint
ALTER TABLE "document_transactions" DROP COLUMN "plot_number";--> statement-breakpoint
ALTER TABLE "document_transactions" DROP COLUMN "extent";