# Portfolio Lineart Fix Bugfix Design

## Overview

This document describes the design for fixing two bugs in the React portfolio website:

1. **Lineart Animation Not Working**: The sophisticated SVG-based scroll-driven lineart animation from the prototype is replaced with a static implementation in React. The fix will restore the animated SVG path that progressively draws based on scroll position, with color changes for blue backgrounds, an arrow tip that follows the path, and node filling to indicate progress.

2. **Left Margin Too Large on Project Page**: Project cards have excessive left padding (`md:pl-60` = 15rem/240px) causing unbalanced layout. The fix will remove this excessive padding while maintaining the proper lineart spacing via the existing `.pwrap` class.

The general strategy is to:
- Convert the vanilla JavaScript lineart implementation from `prototype.html` into a proper React component with hooks for scroll handling and animation
- Remove the `md:pl-60` class from `ProjectCard.tsx` to fix the margin issue

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bugs - when the FlowArrow component renders a static implementation instead of an animated SVG, and when ProjectCard applies excessive left padding
- **Property (P)**: The desired behavior - scroll-driven animated lineart with color changes, arrow tip rotation, and node filling; balanced margins on project cards
- **Preservation**: Existing mobile behavior, accessibility features, resize handling, and non-lineart functionality must remain unchanged
- **FlowArrow**: The React component in `src/components/common/FlowArrow.tsx` that renders the lineart SVG
- **ProjectCard**: The React component in `src/components/common/ProjectCard.tsx` that renders individual project slides
- **stroke-dasharray**: SVG attribute used to create the progressive drawing animation by controlling the visible portion of the path
- **Bezier curves**: The curved path segments that connect nodes with smooth S-curves

## Bug Details

### Bug Condition

**Bug 1: Lineart Animation**

The bug manifests when viewing the projects section. The `FlowArrow` component renders a static vertical line with simple circular nodes instead of an animated SVG path. The component is missing:
- SVG path generation with Bezier curves through all project nodes
- `stroke-dasharray` animation based on scroll position
- Color gradient that changes from blue to white when passing through blue-background slides
- Arrow tip element that follows the drawn path and rotates based on direction
- Node filling based on scroll progress

**Formal Specification:**
```
FUNCTION isBugCondition_Lineart(state)
  INPUT: state of type RenderState
  OUTPUT: boolean
  
  RETURN state.component === "FlowArrow"
         AND state.renderType === "static-div"
         AND NOT hasSVGPath(state.element)
         AND NOT hasScrollAnimation(state.element)
         AND NOT hasColorGradient(state.element)
         AND NOT hasArrowTip(state.element)
END FUNCTION
```

**Bug 2: Left Margin**

The bug manifests when viewing project cards on medium screens and larger. The `ProjectCard` component applies `md:pl-60` class which adds 15rem (240px) of left padding, compounded by the existing `padding-left: 3.5rem` from the `.pwrap` CSS class.

**Formal Specification:**
```
FUNCTION isBugCondition_Margin(state)
  INPUT: state of type RenderState
  OUTPUT: boolean
  
  RETURN state.component === "ProjectCard"
         AND state.innerWidth >= 768
         AND hasClass(state.element, "md:pl-60")
         AND computedPaddingLeft(state.element) > 200 // pixels
END FUNCTION
```

### Examples

**Bug 1: Lineart Animation**
- **Example 1**: When scrolling through projects, the lineart path should progressively draw from top to bottom following scroll position, but instead shows as a static faded line
- **Example 2**: When the lineart passes through a project with `bg="blue"`, the path color should change to white (`#fff`), but instead remains the default blue (`#2563EB`)
- **Example 3**: When scrolling, an arrow tip should follow the drawn path and rotate based on the path direction, but no arrow tip is visible
- **Example 4**: When scroll position passes a node, the circle should fill to indicate progress, but nodes remain unfilled

**Bug 2: Left Margin**
- **Example 1**: On a 1024px wide screen, project cards show content pushed 240px + 56px (3.5rem) from the left, creating an unbalanced layout
- **Example 2**: The left margin for project content is approximately 296px total, while the right margin is only the container padding (~80px), causing visual imbalance

## Expected Behavior

### Preservation Requirements

**Bug 1: Lineart Animation**

**Unchanged Behaviors:**
- Mobile title labels must remain hidden (width < 768px) via CSS `display: none`
- Accessibility via `prefers-reduced-motion` must continue to disable animations
- Window resize handling must continue to rebuild the lineart to match new dimensions
- Node positioning must remain accurate for each project's vertical position
- The existing `.pwrap` padding structure must remain unchanged

**Scope:**
All inputs that do NOT involve the FlowArrow component's animation logic should be completely unaffected. This includes:
- Mouse interactions with project cards
- Modal opening/closing functionality
- Navigation dot behavior
- Other scroll-driven animations (reveal, parallax on `.pin` elements)

**Bug 2: Left Margin**

**Unchanged Behaviors:**
- Mobile padding (width < 768px) must continue to apply `padding-left: 3.6rem`
- The two-column grid layout on medium screens and larger must remain unchanged
- The `gap-4 md:gap-10` spacing between grid columns must remain unchanged
- The `.pwrap` class providing lineart spacing (3.5rem) must remain unchanged

**Scope:**
All layout behavior that does NOT involve the `md:pl-60` class should be completely unaffected. This includes:
- Mobile responsive layout
- Grid column structure
- Gap spacing between columns
- Container max-width and centering

## Hypothesized Root Cause

**Bug 1: Lineart Animation**

Based on the bug analysis, the root cause is:

1. **Incomplete React Conversion**: The `FlowArrow.tsx` component was simplified to a static implementation during the conversion from vanilla JavaScript to React, losing all animation logic
   - The prototype uses `buildFlow()` to construct SVG path data with Bezier curves
   - The prototype uses `updFlow()` to update `stroke-dasharray` based on scroll position
   - The React component only renders static `<div>` elements without SVG

2. **Missing Scroll Event Integration**: The React component lacks:
   - `useEffect` hook to set up scroll event listeners
   - `requestAnimationFrame` throttling for smooth animations
   - State management for scroll-driven updates

3. **Missing SVG Rendering**: The React component doesn't generate:
   - `<svg>` element with proper viewBox
   - `<path>` elements with `stroke-dasharray` for animation
   - `<linearGradient>` for color changes
   - Arrow tip `<g>` element with rotation transforms
   - Node `<circle>` elements with fill state

**Bug 2: Left Margin**

Based on the bug analysis, the root cause is:

1. **Incorrect Tailwind Class**: The `md:pl-60` class in `ProjectCard.tsx` applies `padding-left: 15rem` (240px) on medium screens and larger
   - This was likely added by mistake or as a placeholder
   - It compounds with the existing `.pwrap` class which already provides `padding-left: 3.5rem` (56px)

2. **CSS Duplication**: The inline Tailwind class conflicts with the existing CSS architecture:
   - `.wrap.pwrap` in `index.css` already handles project wrapper padding
   - The `md:pl-60` class overrides and unnecessarily increases the padding

## Correctness Properties

Property 1: Bug Condition - Lineart Scroll Animation

_For any_ scroll position within the projects section, the fixed FlowArrow component SHALL progressively draw the SVG path from the starting point to the current scroll position using `stroke-dasharray`, with the drawn length corresponding to the vertical scroll progress.

**Validates: Requirements 2.1, 2.2**

Property 2: Bug Condition - Lineart Color Gradient

_For any_ project slide with blue background (`bg="blue"`), the fixed FlowArrow component SHALL render the lineart path segment in white (`#fff`), and for light/sky backgrounds SHALL render in blue (`#2563EB`), using SVG `linearGradient` with appropriate color stops.

**Validates: Requirements 2.3**

Property 3: Bug Condition - Arrow Tip Movement

_For any_ scroll position, the fixed FlowArrow component SHALL position the arrow tip element at the current path endpoint and rotate it based on the path direction at that point, calculated using `getPointAtLength` and `Math.atan2`.

**Validates: Requirements 2.4**

Property 4: Bug Condition - Node Filling

_For any_ node where the scroll position has passed (current Y position >= node Y position), the fixed FlowArrow component SHALL fill the node circle with the foreground color, and for unpassed nodes SHALL fill with the background color.

**Validates: Requirements 2.5**

Property 5: Bug Condition - Left Margin Fix

_For any_ viewport width >= 768px, the fixed ProjectCard component SHALL NOT apply `md:pl-60` class, resulting in computed left padding of approximately 56px (3.5rem) from the `.pwrap` class only.

**Validates: Requirements 2.6, 2.7**

Property 6: Preservation - Mobile Layout

_For any_ viewport width < 768px, the fixed components SHALL produce the same layout as the original, with mobile-appropriate padding and hidden title labels.

**Validates: Requirements 3.1, 3.5**

Property 7: Preservation - Reduced Motion

_For any_ user with `prefers-reduced-motion: reduce` preference enabled, the fixed FlowArrow component SHALL disable scroll-driven animations while maintaining the static lineart visualization.

**Validates: Requirements 3.2**

Property 8: Preservation - Resize Handling

_For any_ window resize event, the fixed FlowArrow component SHALL rebuild the SVG path to match the new container dimensions.

**Validates: Requirements 3.3**

## Fix Implementation

### Changes Required

**File**: `src/components/common/FlowArrow.tsx`

**Function**: `FlowArrow` component

**Specific Changes**:

1. **Add SVG Element Structure**: Replace static `<div>` elements with proper `<svg>` element
   - Use React's `useRef` to reference the SVG element
   - Generate viewBox based on container dimensions
   - Set up SVG namespace and attributes

2. **Implement Path Generation**: Create Bezier curve path through all project nodes
   - Calculate node Y positions based on equal spacing (`containerHeight / projectCount`)
   - Generate S-curve path with control points for smooth transitions
   - Start path at 5% from top, end at 94% from top

3. **Add Scroll Animation Logic**: Implement scroll-driven animation
   - Use `useEffect` to attach scroll event listener to `#snap` container
   - Implement `requestAnimationFrame` throttling (similar to prototype's `tk` flag)
   - Calculate scroll progress based on container's `getBoundingClientRect()`
   - Update `stroke-dasharray` to show progressive path drawing

4. **Implement Color Gradient**: Add linear gradient for color changes
   - Create `<defs>` section with `<linearGradient>`
   - Generate color stops based on each project's background color
   - Apply gradient to path via `stroke="url(#fg)"`

5. **Add Arrow Tip Element**: Implement following arrow tip
   - Create `<g id="tip">` group with arrow path
   - Use `getPointAtLength` to find current endpoint
   - Calculate rotation using `Math.atan2` for path direction
   - Apply `transform` attribute for position and rotation

6. **Implement Node Filling**: Add node circle filling based on progress
   - Track node Y positions in state/ref
   - Compare current scroll position to node positions
   - Set `fill` attribute based on whether scroll has passed the node

7. **Add Resize Handler**: Rebuild SVG on window resize
   - Use `useEffect` with resize event listener
   - Recalculate all dimensions and regenerate path
   - Store path length and sample points for scroll calculations

**File**: `src/components/common/ProjectCard.tsx`

**Function**: `ProjectCardComponent`

**Specific Changes**:

1. **Remove Excessive Padding Class**: Remove `md:pl-60` from the grid container
   - Line 48: Change `<div className="pin grid gap-4 md:gap-10 md:grid-cols-[1fr_1.35fr] md:pl-60 items-center">`
   - To: `<div className="pin grid gap-4 md:gap-10 md:grid-cols-[1fr_1.35fr] items-center">`
   - This removes the 240px left padding while preserving the 56px from `.pwrap`

**File**: `src/styles/index.css`

**Function**: CSS rules (verification only, no changes needed)

The existing `.pwrap` class already provides the correct padding:
- Mobile: `padding-left: 3.6rem` (~58px)
- Desktop: `padding-left: 3.5rem` (~56px)

This is appropriate for spacing content from the lineart, so no CSS changes are required.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm the root cause analysis.

**Test Plan**: Write tests that verify the presence of bugs in the current implementation. Run these tests on the UNFIXED code to observe failures.

**Test Cases for Bug 1 (Lineart Animation)**:
1. **SVG Element Test**: Verify FlowArrow renders an `<svg>` element (will fail on unfixed code - renders `<div>`)
2. **Path Element Test**: Verify SVG contains `<path>` elements with `stroke-dasharray` (will fail - no path elements)
3. **Color Gradient Test**: Verify SVG contains `<linearGradient>` with color stops (will fail - no gradient)
4. **Arrow Tip Test**: Verify SVG contains arrow tip element (will fail - no arrow tip)
5. **Scroll Animation Test**: Simulate scroll and verify `stroke-dasharray` updates (will fail - no animation)

**Test Cases for Bug 2 (Left Margin)**:
1. **Padding Test**: Verify computed `padding-left` on desktop is <= 100px (will fail on unfixed code - ~296px)
2. **Class Test**: Verify `md:pl-60` class is not present (will fail - class exists)

**Expected Counterexamples**:
- FlowArrow renders static `<div>` elements instead of SVG
- No `stroke-dasharray` attribute on any element
- No scroll event listener attached
- `md:pl-60` class applied to grid container
- Computed padding exceeds expected values

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL scrollPosition WHERE isBugCondition_Lineart(state) DO
  result := FlowArrow_fixed(scrollPosition)
  ASSERT hasSVGElement(result)
  ASSERT hasAnimatedPath(result)
  ASSERT hasColorGradient(result)
  ASSERT hasArrowTip(result)
  ASSERT nodeFillingCorrect(result, scrollPosition)
END FOR

FOR ALL viewportWidth >= 768 WHERE isBugCondition_Margin(state) DO
  result := ProjectCard_fixed(viewportWidth)
  ASSERT NOT hasClass(result, "md:pl-60")
  ASSERT computedPaddingLeft(result) <= 100 // approximately 56px
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL viewportWidth < 768 DO
  ASSERT FlowArrow_original(viewportWidth) ≈ FlowArrow_fixed(viewportWidth)
  ASSERT ProjectCard_original(viewportWidth) ≈ ProjectCard_fixed(viewportWidth)
END FOR

FOR ALL userPreference WHERE userPreference.reducedMotion = true DO
  ASSERT FlowArrow_original(userPreference).animations = disabled
  ASSERT FlowArrow_fixed(userPreference).animations = disabled
END FOR

FOR ALL resizeEvent DO
  ASSERT FlowArrow_fixed rebuilds SVG correctly
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different viewport sizes
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for mobile layout and reduced motion, then write tests to verify these behaviors continue after fix.

**Test Cases**:
1. **Mobile Title Labels**: Verify title labels are hidden on mobile (width < 768px)
2. **Mobile Padding**: Verify mobile padding remains `3.6rem` for `.pwrap`
3. **Reduced Motion**: Verify animations are disabled when `prefers-reduced-motion: reduce`
4. **Resize Handling**: Verify SVG rebuilds correctly on window resize
5. **Grid Layout Preservation**: Verify two-column grid layout remains unchanged
6. **Gap Spacing Preservation**: Verify `gap-4 md:gap-10` spacing is preserved

### Unit Tests

- Test SVG path generation with Bezier curves
- Test `stroke-dasharray` calculation based on scroll position
- Test color gradient generation from project backgrounds
- Test arrow tip rotation calculation
- Test node filling logic based on scroll position
- Test that `md:pl-60` class is removed from ProjectCard

### Property-Based Tests

- Generate random scroll positions and verify path drawing progress
- Generate random project background combinations and verify color gradient
- Generate random viewport sizes and verify responsive behavior
- Generate random resize events and verify SVG rebuilding

### Integration Tests

- Test full scroll interaction with lineart animation
- Test lineart behavior when switching between project slides
- Test visual appearance of lineart across different project backgrounds
- Test that modal functionality remains unaffected by lineart changes
- Test that navigation dots remain unaffected by lineart changes
