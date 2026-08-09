const homeRoute = { href: "/", label: "Home" } as const;
const machinesRoute = { href: "/machines", label: "Machines" } as const;
const expertiseRoute = { href: "/expertise", label: "Expertise" } as const;
const contactRoute = { href: "/contact", label: "Contact" } as const;

export const primaryNavigationRoutes = [
  homeRoute,
  machinesRoute,
  expertiseRoute,
] as const;

export const contactNavigationRoute = contactRoute;

export const siteNavigationRoutes = [
  ...primaryNavigationRoutes,
  contactNavigationRoute,
] as const;
