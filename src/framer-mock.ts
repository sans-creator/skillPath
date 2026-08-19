import * as React from "react"

export const ControlType = {
  Color: "color",
  Boolean: "boolean",
  String: "string",
  Number: "number",
  Enum: "enum",
} as const;

export function addPropertyControls(component: React.ComponentType<any>, controls: Record<string, any>) {
  // Local no-op helper to prevent errors and verify configuration
  (component as any).propertyControls = controls;
}
