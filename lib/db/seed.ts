import "./load-env";

import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { db, pool } from "./index";
import { post, comment, postLike, auditEvent } from "./schema";
import { auth } from "../auth";

const DEMO_PASSWORD = "Password123!";

const USERS = [
  { name: "Aisha Rahman", email: "aisha@lurkstack.dev", demo: true },
  { name: "Yusuf Khan", email: "yusuf@lurkstack.dev", demo: true },
  { name: "Fatima Siddiqui", email: "fatima@lurkstack.dev" },
  { name: "Omar Farooq", email: "omar@lurkstack.dev" },
  { name: "Layla Hassan", email: "layla@lurkstack.dev" },
  { name: "Bilal Ahmed", email: "bilal@lurkstack.dev" },
  { name: "Mariam Yusuf", email: "mariam@lurkstack.dev" },
  { name: "Zaid Malik", email: "zaid@lurkstack.dev" },
];

const POST_TEXTS = [
  "Just wrapped up the term's attendance review. Clean data makes everything downstream so much easier.",
  "Reminder: parent-teacher evening is next Thursday. Slots are filling up fast.",
  "Finished grading the mid-term essays. Genuinely impressed by this cohort's writing.",
  "Small win today — the new enrollment flow cut sign-up time in half.",
  "Does anyone have a good rubric for Hifz progress tracking? Happy to share mine too.",
  "The library finally got the new reference section organized. Worth the weekend.",
  "Coffee count today: four. Report deadline: tomorrow. We'll see how this goes.",
  "Watching a student finally click with long division never gets old.",
  "Tuition reconciliation is done for the month. On time, for once.",
  "New whiteboards in room 204 are a quiet upgrade but everyone noticed.",
  "Shared the updated grading policy with staff. Feedback welcome before we finalize.",
  "Took the afternoon class outside today. Sometimes a change of scene is the whole lesson.",
  "Our weekend program hit full capacity for the first time. Proud of the team.",
  "Debugging a scheduling conflict in the timetable. Three classes, one room, zero chill.",
  "Just a note to say the front office crew handles chaos with incredible grace.",
  "Started a reading challenge for the younger students. The leaderboard is already competitive.",
  "Finalized the exam calendar. Printed, posted, and emailed — no excuses now.",
  "The quiet focus during assessment week is my favorite sound in this building.",
  "Set up automated reminders for overdue fees. Fewer awkward phone calls ahead.",
  "A student brought in homemade dates today. Staff room morale is at an all-time high.",
  "Reviewed last year's retention numbers. The mentoring program clearly made a difference.",
  "Mapping out next term's curriculum. Trying to leave real room for revision this time.",
  "The new projector in the main hall actually works on the first try. Small miracles.",
  "Had a great conversation with a parent about progress reports. Transparency pays off.",
  "Cleaned up the old records archive. Found attendance sheets from a decade ago.",
  "Testing a new way to visualize grade trends. Early results look promising.",
  "Reminder to self: back up the gradebook before every major update.",
  "The after-school study group has doubled in size. Need a bigger room already.",
  "Finished onboarding two new teachers this week. Fresh energy is contagious.",
  "Updated the staff handbook. It only took approximately forever.",
  "Watching the Hifz students review together is the best part of my Fridays.",
  "Pushed a fix for the report-card formatting bug. No more overlapping columns.",
  "The sports day schedule is locked in. Pray for good weather.",
  "Spent the morning helping a student catch up after a long absence. Worth every minute.",
  "New sign-in kiosk at the entrance is live. Goodbye, paper logbook.",
  "Grades are posted. Deep breath. On to the next term.",
  "Had to reschedule the staff meeting twice but we finally made it work.",
  "The feedback forms came back overwhelmingly positive. Sharing highlights with the team tomorrow.",
  "Reorganized the supply closet. I now know where everything is for exactly one week.",
  "Proud moment: a former student came back to volunteer as a tutor.",
];

const COMMENT_TEXTS = [
  "This is great to hear.",
  "Happy to help with that if you need a hand.",
  "Totally agree — clean data saves hours.",
  "Can you share the template when you get a chance?",
  "Congrats to the whole team!",
  "This made my day.",
  "We should talk about rolling this out more widely.",
  "Needed this reminder, thank you.",
  "Impressive turnaround.",
  "Let me know if you want a second pair of eyes.",
  "The students are lucky to have you.",
  "Saving this for later.",
  "Finally! Been waiting for this.",
  "Great point, I hadn't considered that.",
  "Count me in for the next session.",
];

async function main() {
  console.log("Clearing existing data…");
  await db.delete(postLike);
  await db.delete(comment);
  await db.delete(post);
  await db.delete(auditEvent);
  // Clear auth-managed tables too for a reproducible seed.
  await db.execute(sql`delete from "session"`);
  await db.execute(sql`delete from "account"`);
  await db.execute(sql`delete from "verification"`);
  await db.execute(sql`delete from "user"`);

  console.log("Creating users…");
  const userIds: string[] = [];
  for (const u of USERS) {
    await auth.api.signUpEmail({
      body: { name: u.name, email: u.email, password: DEMO_PASSWORD },
    });
    const res = await db.execute(sql`select id from "user" where email = ${u.email}`);
    userIds.push((res.rows[0] as { id: string }).id);
  }

  console.log("Creating posts…");
  const postIds: string[] = [];
  const base = Date.now();
  for (let i = 0; i < POST_TEXTS.length; i++) {
    const id = randomUUID();
    postIds.push(id);
    const authorId = userIds[i % userIds.length];
    const createdAt = new Date(base - (POST_TEXTS.length - i) * 1000 * 60 * 47);
    await db
      .insert(post)
      .values({ id, authorId, content: POST_TEXTS[i], createdAt, updatedAt: createdAt });
  }

  console.log("Creating comments…");
  let commentCount = 0;
  for (let i = 0; i < postIds.length; i++) {
    const n = i % 3; // 0,1,2 comments cycling
    for (let j = 0; j < n; j++) {
      const authorId = userIds[(i + j + 1) % userIds.length];
      await db.insert(comment).values({
        id: randomUUID(),
        postId: postIds[i],
        authorId,
        content: COMMENT_TEXTS[(i + j) % COMMENT_TEXTS.length],
        createdAt: new Date(base - (postIds.length - i) * 1000 * 60 * 30 + j * 60000),
      });
      commentCount++;
    }
  }

  console.log("Creating likes…");
  let likeCount = 0;
  for (let i = 0; i < postIds.length; i++) {
    const likers = (i % 4) + 2; // 2..5 likes
    for (let k = 0; k < likers; k++) {
      const userId = userIds[(i + k) % userIds.length];
      try {
        await db
          .insert(postLike)
          .values({ id: randomUUID(), postId: postIds[i], userId })
          .onConflictDoNothing();
        likeCount++;
      } catch {
        /* unique(postId,userId) — ignore duplicates */
      }
    }
  }

  const counts = {
    users: userIds.length,
    posts: postIds.length,
    comments: commentCount,
    likes: likeCount,
  };
  console.log("Seed complete:", counts);
  console.log(`Demo accounts (password: ${DEMO_PASSWORD}):`);
  USERS.filter((u) => u.demo).forEach((u) => console.log(`  ${u.email}`));

  await pool.end();
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  await pool.end();
  process.exit(1);
});
