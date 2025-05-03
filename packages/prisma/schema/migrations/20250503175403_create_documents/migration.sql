CREATE EXTENSION IF NOT EXISTS vector SCHEMA public;

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "namespace" TEXT,
    "vector" vector,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
