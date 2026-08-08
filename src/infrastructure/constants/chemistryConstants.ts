import { ScientificConstant } from "../../domain/model/ScientificConstant";
import { ScientificConstantCategory } from "../../domain/model/ScientificConstantCategory";

export const chemistryConstants: readonly ScientificConstant[] = [
  new ScientificConstant(
    "standardPressure",
    "p₀",
    "Standard pressure",
    ScientificConstantCategory.CHEMISTRY,
    "101325",
    "Pa",
    "The standard atmospheric pressure used in chemical thermodynamics.",
    "IUPAC",
    ["p0"]
  ),
  new ScientificConstant(
    "molarVolumeIdealGas",
    "V_m",
    "Molar volume of an ideal gas at STP",
    ScientificConstantCategory.CHEMISTRY,
    "0.02241396954",
    "m³/mol",
    "The volume occupied by one mole of an ideal gas at standard temperature and pressure.",
    "IUPAC",
    ["Vm"]
  ),
  new ScientificConstant(
    "waterTriplePointTemperature",
    "T_tp",
    "Water triple point temperature",
    ScientificConstantCategory.CHEMISTRY,
    "273.16",
    "K",
    "The temperature at which water coexists in solid, liquid, and vapor phases.",
    "BIPM SI Brochure",
    []
  ),
  new ScientificConstant(
    "icePointTemperature",
    "T_ice",
    "Ice point temperature",
    ScientificConstantCategory.CHEMISTRY,
    "273.15",
    "K",
    "The freezing point of pure water at standard pressure.",
    "IUPAC",
    []
  ),
];
