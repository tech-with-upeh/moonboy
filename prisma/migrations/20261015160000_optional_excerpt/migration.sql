-- Allow posts to omit their excerpt while preserving existing values.
ALTER TABLE "Post" ALTER COLUMN "excerpt" SET DEFAULT '';
