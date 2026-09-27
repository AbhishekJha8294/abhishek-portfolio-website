import type { ComponentType } from "react";
import type { ModuleId } from "@/content/sdlc";
import { AiOpsDrill } from "@/components/viz/aiops-drill";
import { GovernanceDrill } from "@/components/viz/governance-drill";
import { RuntimeDrill } from "@/components/viz/runtime-drill";

export const drills: Record<ModuleId, ComponentType> = {
  runtime: RuntimeDrill,
  governance: GovernanceDrill,
  aiops: AiOpsDrill,
};
