---
name: Clinical Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-margin: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for the modern healthcare sector, prioritizing trust, efficiency, and patient-centricity. It targets medical professionals and patients who require high-density information to be presented with absolute clarity and calm. 

The aesthetic is **Modern Corporate**, leaning heavily into functional minimalism. It utilizes a refined color palette and generous white space to reduce cognitive load during critical decision-making. The UI evokes a sense of sterile precision balanced with an approachable warmth, ensuring the interface feels like a reliable tool rather than a complex machine.

## Colors
This design system uses a primary blue (`#2563EB`) to establish authority and trust, while the secondary green (`#10B981`) signifies health, success, and positive outcomes. 

- **Primary Blue:** Used for core actions, navigation states, and brand identifiers.
- **Secondary Green:** Reserved for success states, "available" indicators, and healthy trend lines.
- **Tertiary Amber:** Used sparingly for warnings or pending appointments.
- **Neutrals:** A range of Slate grays is utilized for text hierarchy and subtle borders, maintaining a cool, professional temperature throughout the UI.
- **Backgrounds:** The primary interface uses a very light gray (`#F8FAFC`) to provide subtle contrast against pure white (`#FFFFFF`) cards and surfaces.

## Typography
**Inter** is the sole typeface for this design system, chosen for its exceptional legibility in data-heavy environments. 

- **Headlines:** Use Semi-Bold (600) and Bold (700) weights with slight negative letter-spacing to create a strong, professional anchor for page sections.
- **Body Text:** Maintains a standard 400 weight. For critical patient data or medical notes, `body-md` is the workhorse size.
- **Labels:** Small caps or all-caps with increased letter-spacing are used for metadata, timestamps, and table headers to distinguish them from actionable data.

## Layout & Spacing
The layout follows a **Fluid Grid** model with fixed maximum widths for content readability.

- **Grid:** A 12-column grid is used for desktop layouts, transitioning to a 4-column grid for mobile.
- **Sidebar:** A fixed 280px sidebar is standard for desktop navigation, providing immediate access to medical records and schedules.
- **Spacing Rhythm:** Based on a 4px baseline. Most components utilize 16px (`stack-md`) padding to ensure elements don't feel cramped, which is essential for error prevention in medical software.
- **Margins:** Standard page margins are 24px, increasing to 40px on large monitors to maintain a focused central workspace.

## Elevation & Depth
This design system employs **Tonal Layering** combined with **Ambient Shadows**. Depth is used purposefully to indicate interactivity and importance.

- **Base Layer:** The light gray background serves as the canvas.
- **Card Layer:** White cards use a soft, highly diffused shadow (`0px 4px 12px rgba(0, 0, 0, 0.05)`) to appear slightly lifted.
- **Interactive Layer:** Elements like buttons or active dropdowns may have a slightly stronger shadow on hover to provide tactile feedback.
- **Overlays:** Modals and flyouts use a significant backdrop blur (8px) and a deeper shadow to pull focus during critical patient entries.

## Shapes
The shape language is characterized by a high degree of "Softness" to counter the sterile nature of healthcare. 

- **Cards & Containers:** Consistent 16px (`rounded-lg`) corner radius for all dashboard cards, modals, and main containers.
- **Buttons & Inputs:** Follow a 8px (`rounded-md`) radius to maintain a professional yet approachable look.
- **Chips & Badges:** These utilize a "Full" or "Pill" radius to distinguish them clearly from interactive buttons.

## Components
Consistent component styling ensures the interface feels unified and reliable.

- **Large Buttons:** 48px height with 16px horizontal padding. Primary buttons use the brand blue with white text. Ghost buttons use a subtle gray outline for secondary actions like "Cancel."
- **Dashboard Cards:** 16px rounded corners, white background, and a soft shadow. They include a 16px internal padding and a 1px border (`#E2E8F0`) to maintain definition on white backgrounds.
- **Sidebar:** A dark or very light neutral surface with high-contrast active states. Icons are 24px, paired with `body-md` labels.
- **Input Fields:** 40px height with a 1px border. On focus, the border transitions to Primary Blue with a 2px soft outer glow.
- **Medical Icons:** Use a consistent 2px stroke weight. Icons should be monochrome (Slate) unless indicating a specific status (e.g., Red for urgent alerts).
- **Status Chips:** Small, pill-shaped indicators with low-opacity background tints (e.g., 10% Green background with 100% Green text) for "Completed" or "Stable" statuses.