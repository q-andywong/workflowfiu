# STR Downstream Viewer

## Objective
The `STRViewer.tsx` is one of the heaviest components in the architecture, designed specifically to enforce the system's role as a downstream viewer. 

## Digital Reconstruction Constraints
We mapped the structure of an inherited 15-page legacy PDF document containing upstream Suspicious Transaction Reports natively into the React environment.
* **Read-Only Rigidity:** To preserve absolute integrity from upstream Q Platform pipelines, no component inside the viewer allows modification. Standard text-area inputs were redesigned into crisp, tabular grids spanning 7 explicit tabs.

## Form Structure Breakdown
* **Part I & II:** General profiling.
* **Part III:** Entity Information (incorporating robust checks for `Natural Persons` vs `Legal Entity` demographic flags).
* **Part V:** Suspicious Transaction Flow parameters.
* **Part VI:** Exhaustive reason grids, including a modular checkbox methodology evaluating upwards of 80 unique predicate crimes and red-flag behaviors.
