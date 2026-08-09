import type { z } from "zod";

import type {
  applicationSchema,
  contentVerificationStatusSchema,
  dimensionGroupSchema,
  documentationAssetSchema,
  featureSchema,
  hotspotSchema,
  imageAssetSchema,
  machineCategorySchema,
  machineSchema,
  machineSeoSchema,
  modelAssetSchema,
  publicationStatusSchema,
  sourceReferenceSchema,
  specificationGroupSchema,
  specificationItemSchema,
} from "./schema";

export type PublicationStatus = z.infer<typeof publicationStatusSchema>;
export type ContentVerificationStatus = z.infer<
  typeof contentVerificationStatusSchema
>;
export type MachineCategory = z.infer<typeof machineCategorySchema>;
export type Application = z.infer<typeof applicationSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type SpecificationItem = z.infer<typeof specificationItemSchema>;
export type SpecificationGroup = z.infer<typeof specificationGroupSchema>;
export type DimensionGroup = z.infer<typeof dimensionGroupSchema>;
export type ImageAsset = z.infer<typeof imageAssetSchema>;
export type ModelAsset = z.infer<typeof modelAssetSchema>;
export type Hotspot = z.infer<typeof hotspotSchema>;
export type DocumentationAsset = z.infer<typeof documentationAssetSchema>;
export type MachineSeo = z.infer<typeof machineSeoSchema>;
export type SourceReference = z.infer<typeof sourceReferenceSchema>;
export type Machine = z.infer<typeof machineSchema>;
export type MachineInput = z.input<typeof machineSchema>;
