-- AlterTable
ALTER TABLE "choices" ADD COLUMN     "frequency" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
