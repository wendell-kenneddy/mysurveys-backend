-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "survey_id" TEXT NOT NULL,
    "respondant_id" TEXT NOT NULL,
    "question_title" TEXT NOT NULL,
    "choice_title" TEXT NOT NULL,
    "responded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);
