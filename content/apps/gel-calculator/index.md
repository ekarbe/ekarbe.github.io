---
title: "Gel Calculator Details"
app_slug: "gel-calculator"
---

## Gel Calculator: In-Depth App Analysis, Features, and Technical Breakdown

### Introduction: What is Gel Calculator? 🧪⚡

The Gel Calculator is a sophisticated web application meticulously designed for endurance athletes seeking to optimize their nutritional strategies by creating personalized energy gel or drink mix recipes. In a world where off-the-shelf sports nutrition products offer a one-size-fits-all approach, the Gel Calculator empowers athletes to take control of their fueling, tailoring it precisely to their individual physiological needs, activity demands, and taste preferences.

The core problem this application addresses is the complexity of balancing carbohydrate intake—specifically managing the crucial glucose-to-fructose ratio for optimal absorption—and replenishing electrolytes lost through sweat. As outlined in the project's README, the app helps athletes "Determine the right mix of carbohydrates (controlling the glucose-to-fructose ratio) and electrolytes based on your activity duration, intensity, and sweat profile". This level of customization is paramount for maximizing performance, preventing gastrointestinal distress, and ensuring adequate hydration during prolonged physical exertion.

The primary target audience includes runners, cyclists, triathletes, and any endurance enthusiast who understands the critical role of nutrition in their performance and recovery. It caters to individuals who are ready to move beyond generic recommendations and delve into the science of sports fueling.

The live application can be accessed at: https://eikekarbe.com/gel-calculator.

The application's value lies in its ability to translate complex nutritional science into a practical, actionable recipe. By providing granular control over various input parameters, it enables a highly personalized approach to sports nutrition, a significant step up from generic commercial products. This focus on personalization and DIY solutions is a clear trend among informed athletes looking for an edge and better control over what they consume.

## Core Functionality & Key Features: A Deep Dive

The Gel Calculator is packed with features designed to provide a comprehensive solution for DIY sports nutrition. Each feature is thoughtfully implemented to contribute to the overall goal of creating precise, personalized fuel recipes.

### A. Basic Inputs: Setting the Stage

The foundation of any personalized nutrition plan begins with understanding the demands of the activity. The Gel Calculator captures these through its "Basic Inputs" section, handled by the `BasicInputs.tsx` component.

Users are prompted to input:

-   **Duration (hours):** The planned duration of their activity. This is captured via an `<input id="duration"...>` field. The application ensures a minimum input of 0.1 hours, preventing zero or negative values that would invalidate calculations.
-   **Target Carbs per Hour:** The desired rate of carbohydrate intake in grams per hour. This is captured via an `<input id="carbsPerHour"...>` field, with a minimum input of 0 grams.

From these two primary inputs, the component calculates and displays the "Total Target Carbs: {totalCarbsNeeded.toFixed(1)}g". This `totalCarbsNeeded` value is a critical piece of information, serving as the cornerstone for all subsequent carbohydrate calculations performed by the `useCarbCalculation` hook. The straightforward nature of these inputs ensures a low barrier to entry for users, while their direct impact on the entire calculation pipeline underscores their importance. The built-in minimum value constraints (`min="0.1"` for hours, `min="0"` for carbs/hour) represent a basic form of client-side validation, guiding users towards sensible entries and enhancing the overall user experience by preventing obvious input errors from propagating into more complex calculations.

### B. Carbohydrate Customization: Precision Fueling

Once the total carbohydrate need is established, the Gel Calculator offers detailed control over the composition of these carbohydrates. This is crucial because the type and ratio of sugars can significantly impact absorption rates and gastrointestinal comfort.

#### 1. Glucose/Fructose Ratio Control

A standout feature is the ability to "Adjust the desired ratio between glucose and fructose pathway carbohydrates using sliders". This addresses the physiological principle that utilizing multiple carbohydrate transporters (SGLT1 for glucose, GLUT5 for fructose) can increase the total rate of carbohydrate absorption and potentially reduce GI distress.

-   **Implementation:** The `CarbSourceSection.tsx` component renders separate sections for "Glucose (SGLT1)" and "Fructose (GLUT-5)" pathways. Each section includes a `Slider` component that controls its respective `ratioSliderValue` (e.g., `glucoseRatioSlider`, `fructoseRatioSlider`). The current "part(s)" for each pathway is displayed alongside the slider.
-   **Logic:** The `useCarbCalculation.ts` hook manages the state for these sliders, with initial default values of `initialGlucoseRatio = 100` and `initialFructoseRatio = 80`. These defaults suggest a common sports nutrition guideline aiming for a ratio around 1.25:1 or often simplified to 2:1 glucose to fructose (when considering sucrose as a mixed source). Based on these slider values and the `totalCarbsNeeded`, the hook calculates the `targetGlucoseCarbs` and `targetFructoseCarbs` for each pathway.
-   **Significance:** This explicit control allows athletes to experiment with different ratios (e.g., 2:1, 1:0.8) to find what works best for their individual tolerance and performance, aligning the application with evidence-based sports nutrition practices. Any change to these sliders immediately triggers a recalculation of carbohydrate needs and source amounts, highlighting the application's reactive design.

#### 2. Multiple Carbohydrate Sources & Percentage Contribution

The application allows users to "Select from various glucose and fructose sources... and define their percentage contribution" for each pathway. This provides flexibility in recipe formulation.

-   **Implementation:** Within each `CarbSourceSection.tsx`, a table allows users to add multiple carbohydrate sources. For each source, users can:
    -   Select the source type (e.g., Maltodextrin, Dextrose, Sucrose, Fructose) from a dropdown (`<Select value={source.source}...>`). The available options are populated from `glucoseSourceOptions` and `fructoseSourceOptions` arrays defined in `src/constants/gelCalculator.ts`.
    -   Define the percentage this source should contribute to that pathway's carbohydrate target using an input field (`<input type="number" value={source.percentage}...>`).
-   **Data Source:** The nutritional properties of each carbohydrate source (including `carbsPerGram`, `glucoseContent`, and `fructoseContent`) are stored in `src/constants/gelCalculator.ts`. This data is efficiently accessed via a `sourceDataMap` within the calculation logic.
-   **Logic:** The `useCarbCalculation.ts` hook manages the arrays of `glucoseSources` and `fructoseSources`. It handles adding/removing sources and updating percentages. Crucially, it validates that the percentages for sources within a pathway sum to 100% (`isGlucosePercentagesValid`, `isFructosePercentagesValid`). The hook then calculates the precise grams needed for each selected source to meet the target carbohydrate amounts for each pathway, while respecting the defined glucose/fructose ratio.
-   **Significance:** This feature enables athletes to choose ingredients based on availability, cost, taste preference, or specific digestive tolerances. The percentage-based contribution allows for sophisticated blending of multiple sources within a single pathway. The system's ability to handle "mixed" sources (like sucrose, which provides both glucose and fructose) by accounting for their contributions to both pathways (`glucoseAccountedByMixed`, `fructoseAccountedByMixed`) before calculating needs from "pure" sources demonstrates a nuanced approach to achieving the target ratio.

The following table details the carbohydrate sources available in the Gel Calculator, derived from `src/constants/gelCalculator.ts`:

**Table 1: Available Carbohydrate Sources and Properties**

| Source Name (Label)                  | Carbs per Gram | Glucose Content (%) | Fructose Content (%) | Pathway Category    |
| :----------------------------------- | :------------- | :------------------ | :------------------- | :------------------ |
| Dextrose                             | 1.00           | 100%                | 0%                   | Glucose             |
| Glucose Syrup                        | 0.80           | 100%                | 0%                   | Glucose             |
| Maltodextrin                         | 0.98           | 100%                | 0%                   | Glucose             |
| Maltose                              | 1.00           | 100%                | 0%                   | Glucose             |
| Highly Branched Cyclic Dextrin (HBCD) | 1.00           | 100%                | 0%                   | Glucose             |
| Rice Syrup                           | 0.85           | 100%                | 0%                   | Glucose             |
| Barley Malt Extract                  | 0.80           | 95%                 | 5%                   | Glucose (Primarily) |
| Crystalline Fructose                 | 1.00           | 0%                  | 100%                 | Fructose            |
| High Fructose Corn Syrup             | 0.76           | 45%                 | 55%                  | Fructose (Mixed)    |
| Agave Syrup                          | 0.76           | 18%                 | 82%                  | Fructose (Mixed)    |
| Honey                                | 0.82           | 38%                 | 47%                  | Fructose (Mixed)    |
| Date Syrup                           | 0.70           | 50%                 | 50%                  | Fructose (Mixed)    |
| Fruit Juice Concentrate              | 0.80           | 50%                 | 50%                  | Fructose (Mixed)    |
| Maple Syrup                          | 0.67           | 50%                 | 50%                  | Fructose (Mixed)    |
| Sucrose (Cane Sugar)                 | 1.00           | 50%                 | 50%                  | Fructose (Mixed)    |
| Coconut Sugar                        | 1.00           | 50%                 | 50%                  | Fructose (Mixed)    |

This centralized data structure in `src/constants/gelCalculator.ts` ensures that nutritional information is consistent and easily updatable, promoting maintainability.

### C. Electrolyte Management: Balancing Act

Proper electrolyte balance is as critical as carbohydrate intake for endurance performance. The Gel Calculator provides flexible ways to manage this.

#### 1. Targeting: Sweat Profile vs. Manual Input

Users can determine their electrolyte needs using one of two methods:

-   **Sweat Profile:** This mode allows users to estimate their needs based on:
    -   *Sweat Rate (L/h):* Selected from a dropdown in `ElectrolyteSection.tsx`. The options (`SWEAT_RATES`) and their user-friendly descriptions (`SWEAT_RATE_DESCRIPTIONS`) are defined in `src/constants/gelCalculator.ts`.
    -   *Sweat Saltiness:* Also selected from a dropdown, with levels and descriptions (`SALTINESS_DESCRIPTIONS`) from the constants file.
    -   The application then uses predefined `ELECTROLYTE_CONCENTRATIONS` (in mmol/L for various saltiness levels) and `CONVERSION_FACTORS` (molar masses to convert mmol/L to mg/L) from `src/constants/gelCalculator.ts` to estimate hourly electrolyte loss for Sodium, Chloride, Potassium, Magnesium, and Calcium.
-   **Manual Target (mg/h):** Users can bypass the estimation and directly input their known target electrolyte requirements in milligrams per hour for each electrolyte.

The `ElectrolyteSection.tsx` component uses a `Tabs` element to switch between these two modes. The `useElectrolyteCalculation.ts` hook manages the relevant state (`isSweatRate`, `sweatRate`, `saltiness`, `manualTargets`) and calculates the `targetAmountsPerHour` accordingly. Users can also toggle which electrolytes they wish to actively target using the `ElectrolytesGrid.tsx` component, which updates the `activeElectrolytes` state. This dual-mode approach makes the feature accessible to users with varying levels of information about their personal sweat losses, from those needing a guided estimation to those with lab-tested data.

#### 2. Multiple Electrolyte Sources & Auto-Calculation

Once targets are set, users can add electrolyte sources:

-   **Manual Addition:** Users can add various electrolyte sources (e.g., Sodium Chloride, Potassium Citrate) from a predefined list (`electrolyteSourceOptions` in `src/constants/gelCalculator.ts`) and specify the total amount (in mg) of that source they plan to use for the entire activity duration. The application then shows the contribution of each individual electrolyte from that source.
-   **Auto-Calculation:** A key feature is the "Auto-Calculate" button in `ElectrolyteSection.tsx`. This triggers the `handleAutoCalculateElectrolytes` function within the `useElectrolyteCalculation.ts` hook. This function attempts to automatically select and quantify preferred electrolyte sources to meet the user's defined targets for the active electrolytes. The logic uses a list of `preferredSources` for each electrolyte and a specific `calculationOrder` (Sodium, Potassium, Magnesium, Calcium, Chloride), performing two passes to refine the amounts and account for electrolytes provided by multiple sources. This significantly enhances usability by providing a sensible starting point for users.

The `electrolyteSourceOptions` in `src/constants/gelCalculator.ts` define each source's name and its constituent electrolyte components, including the ratio of each electrolyte in the source and an estimated `absorptionRate`. This consideration of absorption rates adds a layer of physiological realism to the calculations, as the application distinguishes between the raw amount of an electrolyte added and the amount likely to be absorbed by the body.

The following table outlines the structure for electrolyte source data from `src/constants/gelCalculator.ts`:

**Table 2: Example Electrolyte Source Data Structure**

| Property         | Example Value (for Sodium Citrate)                                  | Description                                                              |
| :--------------- | :------------------------------------------------------------------ | :----------------------------------------------------------------------- |
| `label`          | 'Sodium Citrate'                                                    | The common name of the electrolyte source.                               |
| `components`     | `[{ name: 'Sodium', ratio: 0.267, absorptionRate: 0.90 }, ...]`    | An array detailing each electrolyte (or other molecule) within the source. |
| `components.name`| 'Sodium'                                                            | The name of the specific electrolyte component.                          |
| `components.ratio`| 0.267                                                               | The proportion of this component by weight in the source.                |
| `components.absorptionRate` | 0.90                                                                | The estimated decimal absorption rate of this component from this source. |

This detailed data structure allows the calculator to accurately determine the contribution of each selected source to the overall electrolyte intake.