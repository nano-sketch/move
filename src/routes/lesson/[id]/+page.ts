import { json } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  /* ensure we dont import a lesson which cant exist */
  const max_lessons = (await import("$lib/lessons/lessons.json")).length;
  if (parseInt(params.id) > max_lessons) return null;

  const l = await import(`$lib/lessons/${params.id}.md`);
  return {
    content: l.default,
    metadata: l.metadata,
  };
};
