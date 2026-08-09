type MachineCategoryDefinition = Readonly<{
  id: string;
  label: string;
  description?: string;
  order: number;
}>;

export const machineCategories = {
  textile: {
    id: "textile",
    label: "Textile",
    order: 10,
  },
  confection: {
    id: "confection",
    label: "Confection",
    order: 20,
  },
  agroFood: {
    id: "agro-food",
    label: "Agro-food",
    order: 30,
  },
  construction: {
    id: "construction",
    label: "Construction",
    order: 40,
  },
  customEngineering: {
    id: "custom-engineering",
    label: "Custom engineering",
    order: 50,
  },
} as const satisfies Record<string, MachineCategoryDefinition>;
