import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const lessonId = parseInt(params.id);
  
  /* ensure we have a valid lesson id */
  if (isNaN(lessonId) || lessonId < 1) {
    throw error(404, "Lesson not found");
  }

  try {
    /* check if lesson exists in lessons.json */
    const lessons = (await import("$lib/lessons/lessons.json")).default;
    const lessonExists = lessons.some((lesson: any) => lesson.id === lessonId);
    
    if (!lessonExists) {
      throw error(404, "Lesson not found");
    }

    /* import the lesson markdown file */
    const l = await import(`$lib/lessons/${params.id}.md`);
    return {
      content: l.default,
      metadata: l.metadata,
    };
  } catch (err) {
    console.error("Error loading lesson:", err);
    throw error(404, "Lesson not found");
  }
};
