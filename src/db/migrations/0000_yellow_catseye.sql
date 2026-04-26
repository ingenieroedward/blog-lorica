CREATE TYPE "public"."ad_position" AS ENUM('HEADER', 'SIDEBAR_TOP', 'SIDEBAR_BOTTOM', 'IN_CONTENT_1', 'IN_CONTENT_2', 'FOOTER');--> statement-breakpoint
CREATE TABLE "ad_slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"position" "ad_position" NOT NULL,
	"size" varchar(50) NOT NULL,
	"advertiser" varchar(200),
	"image_url" varchar(500),
	"link_url" varchar(500),
	"alt_text" varchar(200),
	"ad_code" text,
	"active" boolean DEFAULT false NOT NULL,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"impressions" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"category_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"bio" text NOT NULL,
	"short_bio" varchar(200) NOT NULL,
	"image" varchar(500),
	"email" varchar(200),
	"twitter" varchar(100),
	"instagram" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "authors_slug_unique" UNIQUE("slug"),
	CONSTRAINT "authors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text,
	"color" varchar(7),
	"image" varchar(500),
	"meta_title" varchar(70),
	"meta_desc" varchar(160),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(200) NOT NULL,
	"name" varchar(100),
	"active" boolean DEFAULT true NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"confirmed_at" timestamp,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "post_relations" (
	"source_post_id" integer NOT NULL,
	"target_post_id" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "post_relations_source_post_id_target_post_id_pk" PRIMARY KEY("source_post_id","target_post_id")
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"post_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "post_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "post_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"date" varchar(10) NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"cover_image" varchar(500),
	"cover_image_alt" varchar(200),
	"meta_title" varchar(70),
	"meta_desc" varchar(160),
	"canonical_url" varchar(500),
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"reading_time" integer,
	"author_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "post_relations" ADD CONSTRAINT "post_relations_source_post_id_posts_id_fk" FOREIGN KEY ("source_post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_relations" ADD CONSTRAINT "post_relations_target_post_id_posts_id_fk" FOREIGN KEY ("target_post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_views" ADD CONSTRAINT "post_views_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ad_slot_position_idx" ON "ad_slots" USING btree ("position","active");--> statement-breakpoint
CREATE INDEX "author_slug_idx" ON "authors" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "category_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "newsletter_active_idx" ON "newsletter_subscribers" USING btree ("active");--> statement-breakpoint
CREATE INDEX "post_tags_tag_idx" ON "post_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "post_views_post_idx" ON "post_views" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_views_date_idx" ON "post_views" USING btree ("post_id","date");--> statement-breakpoint
CREATE INDEX "post_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "post_published_idx" ON "posts" USING btree ("published","published_at");--> statement-breakpoint
CREATE INDEX "post_category_idx" ON "posts" USING btree ("category_id","published");--> statement-breakpoint
CREATE INDEX "post_author_idx" ON "posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "tag_slug_idx" ON "tags" USING btree ("slug");