-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard_wcst" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "stats_id" INTEGER,

    CONSTRAINT "leaderboard_wcst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats_wcst" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(6),
    "categories_completed" SMALLINT,
    "trials_administered" SMALLINT,
    "total_correct" SMALLINT,
    "total_error" SMALLINT,
    "perseverative_responses" SMALLINT,
    "perseverative_errors" SMALLINT,
    "non_perseverative_errors" SMALLINT,
    "failure_to_maintain_set" SMALLINT,
    "trials_to_first_category" SMALLINT,
    "perseverativepercent" DECIMAL(5,2),
    "perseverativeerrorpercent" DECIMAL(5,2),
    "nonperseverativeerrorpercent" DECIMAL(5,2),
    "errorpercent" DECIMAL(5,2),
    "user_id" INTEGER,

    CONSTRAINT "stats_wcst_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "leaderboard_wcst" ADD CONSTRAINT "fk_leaderboard_wcst_stats_id" FOREIGN KEY ("stats_id") REFERENCES "stats_wcst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard_wcst" ADD CONSTRAINT "fk_leaderboard_wcst_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stats_wcst" ADD CONSTRAINT "fk_stats_wcst_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
