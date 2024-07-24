-- CreateTable
CREATE TABLE "survey_respondants" (
    "respondant_id" TEXT NOT NULL,
    "survey_id" TEXT NOT NULL,
    "responded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_respondants_pkey" PRIMARY KEY ("respondant_id","survey_id")
);

-- AddForeignKey
ALTER TABLE "survey_respondants" ADD CONSTRAINT "survey_respondants_respondant_id_fkey" FOREIGN KEY ("respondant_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_respondants" ADD CONSTRAINT "survey_respondants_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
