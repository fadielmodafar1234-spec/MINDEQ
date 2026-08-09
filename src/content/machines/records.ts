import { developmentMachine } from "@/content/machines/development-machine";
import { parseMachineCatalogue } from "@/lib/machines/schema";

export const machineRecords = parseMachineCatalogue([developmentMachine]);
