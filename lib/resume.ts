import { existsSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/content/site";

/** Evaluated at build time: the Resume link only renders when the PDF ships. */
export function hasResume() {
  return existsSync(join(process.cwd(), "public", site.resume.file));
}
