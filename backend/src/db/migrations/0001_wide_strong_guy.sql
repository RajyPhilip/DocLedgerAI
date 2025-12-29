CREATE TABLE "document_ai_outputs" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"summary_text" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "document_texts" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"raw_text" text,
	"translated_text" text
);
--> statement-breakpoint
CREATE TABLE "document_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"doc_no" text,
	"execution_date" text,
	"registration_date" text,
	"nature" text,
	"consideration_value" text,
	"market_value" text,
	"survey_numbers" jsonb,
	"plot_number" text,
	"extent" text
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"original_filename" text NOT NULL,
	"file_url" text NOT NULL,
	"translated_file_url" text,
	"status" text DEFAULT 'UPLOADED',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "document_ai_outputs" ADD CONSTRAINT "document_ai_outputs_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_texts" ADD CONSTRAINT "document_texts_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_transactions" ADD CONSTRAINT "document_transactions_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;