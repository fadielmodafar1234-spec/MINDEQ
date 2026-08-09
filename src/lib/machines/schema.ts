import { z } from "zod";

import { machineCategories } from "@/content/machines/categories";

import { DEVELOPMENT_PLACEHOLDER_LABEL } from "./constants";

const nonEmptyStringSchema = z.string().trim().min(1);
const canonicalSlugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Machine slug must use lowercase kebab-case.",
  );
const vector3Schema = z.tuple([z.number(), z.number(), z.number()]);
const languageTagSchema = nonEmptyStringSchema.refine(
  (value) => {
    try {
      return Intl.getCanonicalLocales(value).length === 1;
    } catch {
      return false;
    }
  },
  { message: "Documentation language must be a valid language tag." },
);
const isoCalendarDateSchema = nonEmptyStringSchema.refine(
  (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
      return false;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(0);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCFullYear(year, month - 1, day);

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  },
  { message: "Date must be a valid ISO calendar date (YYYY-MM-DD)." },
);

export const publicationStatusSchema = z.enum([
  "development",
  "review",
  "published",
]);

export const contentVerificationStatusSchema = z.enum([
  "verified",
  "approved-brief",
  "development-placeholder",
  "rejected-or-superseded",
]);

type RegisteredMachineCategory = Readonly<{
  id: string;
  label: string;
  description?: string;
  order: number;
}>;

const registeredMachineCategories = new Map<string, RegisteredMachineCategory>(
  Object.values(machineCategories).map((category) => [category.id, category]),
);

export const machineCategorySchema = z
  .object({
    id: nonEmptyStringSchema,
    label: nonEmptyStringSchema,
    description: nonEmptyStringSchema.optional(),
    order: z.number().int().nonnegative(),
  })
  .superRefine((category, context) => {
    const registeredCategory = registeredMachineCategories.get(category.id);

    if (
      !registeredCategory ||
      registeredCategory.label !== category.label ||
      registeredCategory.description !== category.description ||
      registeredCategory.order !== category.order
    ) {
      context.addIssue({
        code: "custom",
        message: "Machine must use a registered machine category.",
        path: ["id"],
      });
    }
  });

export const applicationSchema = z.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema.optional(),
  industryId: nonEmptyStringSchema.optional(),
});

export const featureSchema = z.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema.optional(),
  componentId: nonEmptyStringSchema.optional(),
});

export const specificationItemSchema = z.object({
  id: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  value: nonEmptyStringSchema,
  unit: nonEmptyStringSchema.optional(),
  note: nonEmptyStringSchema.optional(),
  sourceReferenceId: nonEmptyStringSchema.optional(),
  verificationStatus: contentVerificationStatusSchema,
});

export const specificationGroupSchema = z.object({
  id: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  items: z.array(specificationItemSchema),
});

export const imageAssetSchema = z.object({
  id: nonEmptyStringSchema,
  src: nonEmptyStringSchema,
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: nonEmptyStringSchema.optional(),
  focalPoint: z
    .tuple([
      z.number().min(0).max(1),
      z.number().min(0).max(1),
    ])
    .optional(),
  credit: nonEmptyStringSchema.optional(),
  publicationStatus: publicationStatusSchema,
});

export const dimensionItemSchema = specificationItemSchema;

export const dimensionGroupSchema = z.object({
  id: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  items: z.array(dimensionItemSchema),
  drawing: imageAssetSchema.optional(),
});

const modelTransformSchema = z.object({
  position: vector3Schema,
  rotation: vector3Schema,
  scale: vector3Schema,
});

const cameraPresetSchema = z.object({
  position: vector3Schema,
  target: vector3Schema,
  fov: z.number().positive().max(179),
});

export const modelAssetSchema = z.object({
  id: nonEmptyStringSchema,
  src: nonEmptyStringSchema,
  variant: z.enum(["viewer", "hero", "mobile"]),
  fileBytes: z.number().int().nonnegative(),
  componentIds: z.array(nonEmptyStringSchema),
  componentMapVersion: nonEmptyStringSchema,
  transform: modelTransformSchema.optional(),
  cameraPreset: cameraPresetSchema.optional(),
  qualityNotes: nonEmptyStringSchema.optional(),
  publicationStatus: publicationStatusSchema,
});

export const hotspotSchema = z.object({
  id: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  position: vector3Schema,
  componentId: nonEmptyStringSchema.optional(),
  technicalValues: z.array(specificationItemSchema).optional(),
  cameraPreset: cameraPresetSchema.optional(),
});

export const documentationAssetSchema = z.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  type: z.enum(["datasheet", "manual", "drawing", "certificate", "other"]),
  language: languageTagSchema,
  file: nonEmptyStringSchema,
  revision: nonEmptyStringSchema.optional(),
  date: isoCalendarDateSchema.optional(),
  publicationStatus: publicationStatusSchema,
});

export const machineSeoSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  image: imageAssetSchema.optional(),
  canonicalPath: nonEmptyStringSchema,
  noIndex: z.boolean(),
});

export const sourceReferenceSchema = z.object({
  id: nonEmptyStringSchema,
  type: z.enum([
    "human-approval",
    "technical-document",
    "asset-package",
    "public-material",
    "development-placeholder",
  ]),
  title: nonEmptyStringSchema,
  location: nonEmptyStringSchema,
  revision: nonEmptyStringSchema.optional(),
  date: isoCalendarDateSchema.optional(),
  approvalState: z.enum(["development", "review", "approved", "rejected"]),
  approvalNote: nonEmptyStringSchema.optional(),
});

export const machineSchema = z
  .object({
    slug: canonicalSlugSchema,
    name: nonEmptyStringSchema,
    shortName: nonEmptyStringSchema,
    category: machineCategorySchema,
    tagline: nonEmptyStringSchema.optional(),
    description: nonEmptyStringSchema,
    applications: z.array(applicationSchema),
    features: z.array(featureSchema),
    specifications: z.array(specificationGroupSchema),
    dimensions: z.array(dimensionGroupSchema),
    heroImage: imageAssetSchema,
    gallery: z.array(imageAssetSchema),
    model: modelAssetSchema.nullable(),
    modelMobile: modelAssetSchema.nullable(),
    modelPoster: imageAssetSchema.nullable(),
    hotspots: z.array(hotspotSchema),
    documentation: z.array(documentationAssetSchema),
    seo: machineSeoSchema,
    publicationStatus: publicationStatusSchema,
    featured: z.boolean(),
    sourceReferences: z.array(sourceReferenceSchema),
  })
  .superRefine((machine, context) => {
    const identifiers = new Set<string>();

    function register(id: string, path: (string | number)[]) {
      if (identifiers.has(id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate machine-local ID: ${id}`,
          path,
        });
      }

      identifiers.add(id);
    }

    register(machine.heroImage.id, ["heroImage", "id"]);
    machine.applications.forEach((application, index) => {
      register(application.id, ["applications", index, "id"]);
    });
    machine.features.forEach((feature, index) => {
      register(feature.id, ["features", index, "id"]);
    });
    machine.specifications.forEach((group, groupIndex) => {
      register(group.id, ["specifications", groupIndex, "id"]);
      group.items.forEach((item, itemIndex) => {
        register(item.id, [
          "specifications",
          groupIndex,
          "items",
          itemIndex,
          "id",
        ]);
      });
    });
    machine.dimensions.forEach((group, groupIndex) => {
      register(group.id, ["dimensions", groupIndex, "id"]);
      group.items.forEach((item, itemIndex) => {
        register(item.id, [
          "dimensions",
          groupIndex,
          "items",
          itemIndex,
          "id",
        ]);
      });
      if (group.drawing) {
        register(group.drawing.id, ["dimensions", groupIndex, "drawing", "id"]);
      }
    });
    machine.gallery.forEach((image, index) => {
      register(image.id, ["gallery", index, "id"]);
    });
    if (machine.model) {
      register(machine.model.id, ["model", "id"]);
    }
    if (machine.modelMobile) {
      register(machine.modelMobile.id, ["modelMobile", "id"]);
    }
    if (machine.modelPoster) {
      register(machine.modelPoster.id, ["modelPoster", "id"]);
    }
    machine.hotspots.forEach((hotspot, hotspotIndex) => {
      register(hotspot.id, ["hotspots", hotspotIndex, "id"]);
      hotspot.technicalValues?.forEach((item, itemIndex) => {
        register(item.id, [
          "hotspots",
          hotspotIndex,
          "technicalValues",
          itemIndex,
          "id",
        ]);
      });
    });
    machine.documentation.forEach((document, index) => {
      register(document.id, ["documentation", index, "id"]);
    });
    machine.sourceReferences.forEach((source, index) => {
      register(source.id, ["sourceReferences", index, "id"]);
    });

    if (
      machine.publicationStatus === "published" &&
      !machine.sourceReferences.some(
        (source) =>
          source.approvalState === "approved" &&
          source.type !== "development-placeholder",
      )
    ) {
      context.addIssue({
        code: "custom",
        message: "Published machine requires an approved source.",
        path: ["sourceReferences"],
      });
    }

    if (machine.featured && machine.publicationStatus !== "published") {
      context.addIssue({
        code: "custom",
        message: "Featured machine must be published.",
        path: ["featured"],
      });
    }

    if ((machine.model || machine.modelMobile) && !machine.modelPoster) {
      context.addIssue({
        code: "custom",
        message: "Model-backed machine requires a poster.",
        path: ["modelPoster"],
      });
    }

    const componentIds = new Set([
      ...(machine.model?.componentIds ?? []),
      ...(machine.modelMobile?.componentIds ?? []),
    ]);

    machine.hotspots.forEach((hotspot, index) => {
      if (hotspot.componentId && !componentIds.has(hotspot.componentId)) {
        context.addIssue({
          code: "custom",
          message: `Hotspot targets unknown model component: ${hotspot.componentId}`,
          path: ["hotspots", index, "componentId"],
        });
      }
    });

    if (machine.seo.canonicalPath !== `/machines/${machine.slug}`) {
      context.addIssue({
        code: "custom",
        message: "Canonical path must match machine slug.",
        path: ["seo", "canonicalPath"],
      });
    }

    if (machine.publicationStatus === "published" && machine.seo.noIndex) {
      context.addIssue({
        code: "custom",
        message: "Published machine must be indexable.",
        path: ["seo", "noIndex"],
      });
    }

    if (machine.publicationStatus === "published") {
      const technicalValues = [
        ...machine.specifications.flatMap((group) => group.items),
        ...machine.dimensions.flatMap((group) => group.items),
        ...machine.hotspots.flatMap(
          (hotspot) => hotspot.technicalValues ?? [],
        ),
      ];

      const approvedSourceIds = new Set(
        machine.sourceReferences
          .filter(
            (source) =>
              source.approvalState === "approved" &&
              source.type !== "development-placeholder",
          )
          .map((source) => source.id),
      );

      if (
        technicalValues.some(
          (item) =>
            !item.sourceReferenceId ||
            !approvedSourceIds.has(item.sourceReferenceId),
        )
      ) {
        context.addIssue({
          code: "custom",
          message:
            "Published technical value requires an approved source reference.",
          path: ["specifications"],
        });
      }

      if (
        technicalValues.some(
          (item) => item.verificationStatus !== "verified",
        )
      ) {
        context.addIssue({
          code: "custom",
          message:
            "Published machine cannot contain development technical values.",
          path: ["specifications"],
        });
      }

      const mediaStatuses = [
        machine.heroImage.publicationStatus,
        ...machine.gallery.map((image) => image.publicationStatus),
        ...machine.dimensions.flatMap((group) =>
          group.drawing ? [group.drawing.publicationStatus] : [],
        ),
        ...(machine.model ? [machine.model.publicationStatus] : []),
        ...(machine.modelMobile
          ? [machine.modelMobile.publicationStatus]
          : []),
        ...(machine.modelPoster
          ? [machine.modelPoster.publicationStatus]
          : []),
        ...(machine.seo.image ? [machine.seo.image.publicationStatus] : []),
        ...machine.documentation.map(
          (document) => document.publicationStatus,
        ),
      ];

      if (mediaStatuses.some((status) => status !== "published")) {
        context.addIssue({
          code: "custom",
          message: "Published machine requires published media.",
          path: ["heroImage"],
        });
      }

      if (JSON.stringify(machine).includes(DEVELOPMENT_PLACEHOLDER_LABEL)) {
        context.addIssue({
          code: "custom",
          message:
            "Published machine cannot contain the development placeholder label.",
          path: [],
        });
      }
    }
  });

export const machineCatalogueSchema = z
  .array(machineSchema)
  .superRefine((machines, context) => {
    const slugs = new Set<string>();

    machines.forEach((machine, index) => {
      if (slugs.has(machine.slug)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate machine slug: ${machine.slug}`,
          path: [index, "slug"],
        });
      }

      slugs.add(machine.slug);
    });
  });

export function parseMachineCatalogue(
  input: unknown,
): readonly z.infer<typeof machineSchema>[] {
  return machineCatalogueSchema.parse(input);
}
