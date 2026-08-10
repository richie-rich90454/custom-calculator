---
title: Unit Conversion
description: How to convert between physical units with the OPTN unit conversion tab.
---

# Unit Conversion

The options catalog (OPTN) includes a **Unit Conversion** tab that converts
values between physical units.

## Opening unit conversion

Press **OPTN** and open the **Unit Conversion** tab.

## Converting a value

1. Choose a **Unit category** such as Length, Mass, Pressure, or Energy.
2. Choose the **From unit** and **To unit**.
3. Enter a **Value to convert**.
4. Press **Convert**.

The result is shown in the target unit.

## Supported categories

| Category    | Sample units                                      |
| ----------- | ------------------------------------------------- |
| Length      | m, cm, mm, km, in, ft, yd, mi                     |
| Mass        | g, kg, mg, lb, oz, t                              |
| Temperature | C, F, K, R                                        |
| Pressure    | Pa, kPa, bar, atm, mmHg, psi                      |
| Energy      | J, kJ, cal, kcal, Wh, kWh, eV                     |
| Power       | W, kW, MW, hp                                     |
| Force       | N, kN, kgf, lbf, dyn                              |
| Time        | s, ms, min, h, day                                |
| Area        | m^2, cm^2, km^2, ha, acre, ft^2                   |
| Volume      | L, mL, m^3, cm^3, gal, fl oz                      |
| Speed       | m/s, km/h, mph, knot, ft/s                        |
| Angle       | deg, rad, gon                                     |

## Temperature conversions

Temperature uses affine formulas because the scales have different zero
points. Celsius, Fahrenheit, Kelvin, and Rankine are converted through a
dedicated temperature policy.

```
0 C -> 32 F
100 C -> 212 F
0 C -> 273.15 K
```

## Examples

```
1 m -> 100 cm
100 kPa -> 1 bar
1 mile -> 1.609344 km
```

## Errors

- A non-numeric value reports an error.
- An empty value reports an error.
- Units that cannot be converted to each other report a clear error.

## Related documentation

- [Constants](/user-guide/constants) lists scientific constants in OPTN.
- [Angle modes](/user-guide/angle-modes) explains angle unit behavior.
- [Display formats](/user-guide/display-formats) covers result formatting.
