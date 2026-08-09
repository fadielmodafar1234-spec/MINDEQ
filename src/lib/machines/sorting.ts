import type { Machine } from "./types";

export function sortMachinesForCatalogue(
  machines: readonly Machine[],
): Machine[] {
  return [...machines].sort((left, right) => {
    const categoryOrder = left.category.order - right.category.order;

    if (categoryOrder !== 0) {
      return categoryOrder;
    }

    return left.name.localeCompare(right.name, "en");
  });
}
