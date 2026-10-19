# Implementation Plan

## Overview

This implementation plan addresses two bugs:
1. **Lineart Animation Not Working** - Restore the sophisticated SVG-based scroll-driven lineart animation from the prototype
2. **Left Margin Too Large on Project Page** - Remove excessive `md:pl-60` padding from ProjectCard

---

- [ ] 1. Write bug condition exploration test for lineart animation
  - **Property 1: Bug Condition** - Static Lineart Instead of Animated SVG
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases:
    - Verify FlowArrow renders an `<svg>` element (currently renders `<div>`)
    - Verify SVG contains `<path>` elements with `stroke-dasharray` attribute (currently missing)
    - Verify SVG contains `<linearGradient>` for color changes (currently missing)
    - Verify SVG contains arrow tip element `<g id="tip">` (currently missing)
  - Test implementation details from Bug Condition in design:
    - `isBugCondition_Lineart`: `state.component === "FlowArrow" AND state.renderType === "static-div" AND NOT hasSVGPath(state.element)`
  - The test assertions should match the Expected Behavior Properties from design:
    - SVG path generation with Bezier curves
    - `stroke-dasharray` animation based on scroll position
    - Color gradient for blue backgrounds
    - Arrow tip element following the path
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 2. Write bug condition exploration test for left margin
  - **Property 1: Bug Condition** - Excessive Left Padding on Project Cards
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases:
    - Verify `md:pl-60` class is NOT present on the grid container (currently present)
    - Verify computed `padding-left` on desktop (width >= 768px) is approximately 56px from `.pwrap` (currently ~296px)
  - Test implementation details from Bug Condition in design:
    - `isBugCondition_Margin`: `state.component === "ProjectCard" AND state.innerWidth >= 768 AND hasClass(state.element, "md:pl-60")`
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., "ProjectCard has md:pl-60 class applying 240px extra padding")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.6, 2.7_

- [ ] 3. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Mobile Layout and Accessibility Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - **Observe on UNFIXED code**:
    - Mobile title labels are hidden (width < 768px) via CSS `display: none`
    - Mobile padding remains `padding-left: 3.6rem` for `.pwrap`
    - The two-column grid layout (`md:grid-cols-[1fr_1.35fr]`) is preserved
    - The `gap-4 md:gap-10` spacing between grid columns is preserved
    - Animations are disabled when `prefers-reduced-motion: reduce` is enabled
    - Window resize triggers lineart rebuild (currently static, but should preserve this hook)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - For all viewport width < 768px, mobile layout behavior is unchanged
    - For all user preferences with `prefers-reduced-motion: reduce`, animations are disabled
    - For all resize events, SVG rebuilds correctly (after fix)
    - Grid layout and gap spacing remain unchanged
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 4. Fix for lineart animation

  - [ ] 4.1 Add SVG element structure to FlowArrow component
    - Replace static `<div>` elements with proper `<svg>` element
    - Use React's `useRef` to reference the SVG element
    - Generate viewBox based on container dimensions
    - Set up SVG namespace and attributes (`xmlns`, `width`, `height`, `viewBox`)
    - Add `<defs>` section for gradients
    - _Bug_Condition: isBugCondition_Lineart(state) where renderType === "static-div"_
    - _Expected_Behavior: SVG element with proper viewBox and dimensions_
    - _Preservation: Mobile layout, reduced-motion support, resize handling_
    - _Requirements: 2.1_

  - [ ] 4.2 Implement Bezier curve path generation
    - Calculate node Y positions based on equal spacing (`containerHeight / projectCount`)
    - Generate S-curve path with control points for smooth transitions
    - Start path at 5% from top, end at 94% from top
    - Create two paths: traced path (`#tr`) with dashed line, progress path (`#pr`) for animation
    - Use `stroke-dasharray` attribute for animation capability
    - _Bug_Condition: NOT hasSVGPath(state.element)_
    - _Expected_Behavior: Path element with Bezier curves through all project nodes_
    - _Preservation: Node positioning must remain accurate for each project's vertical position_
    - _Requirements: 2.1, 2.2_

  - [ ] 4.3 Add scroll-driven animation logic
    - Use `useEffect` to attach scroll event listener to `#snap` container
    - Implement `requestAnimationFrame` throttling (similar to prototype's `tk` flag)
    - Calculate scroll progress based on container's `getBoundingClientRect()`
    - Update `stroke-dasharray` on progress path (`#pr`) to show progressive path drawing
    - Store path length and sample points for efficient scroll calculations
    - _Bug_Condition: NOT hasScrollAnimation(state.element)_
    - _Expected_Behavior: stroke-dasharray updates based on scroll position_
    - _Preservation: prefers-reduced-motion disables scroll animations_
    - _Requirements: 2.2_

  - [ ] 4.4 Implement color gradient for blue backgrounds
    - Create `<linearGradient id="fg">` in `<defs>` section
    - Generate color stops based on each project's background color
    - For blue backgrounds: use white (`#fff`)
    - For light/sky backgrounds: use blue (`#2563EB`)
    - Apply gradient to paths via `stroke="url(#fg)"`
    - _Bug_Condition: NOT hasColorGradient(state.element)_
    - _Expected_Behavior: Path color changes based on project background_
    - _Preservation: Gradient calculation matches project backgrounds_
    - _Requirements: 2.3_

  - [ ] 4.5 Add arrow tip element that follows the path
    - Create `<g id="tip">` group with arrow path shape
    - Use `getPointAtLength` to find current endpoint position
    - Calculate rotation using `Math.atan2` for path direction
    - Apply `transform` attribute for position and rotation
    - Arrow should point in direction of path travel
    - _Bug_Condition: NOT hasArrowTip(state.element)_
    - _Expected_Behavior: Arrow tip positioned at path endpoint with correct rotation_
    - _Preservation: Arrow tip hides when animations disabled_
    - _Requirements: 2.4_

  - [ ] 4.6 Implement node circle filling based on scroll progress
    - Render `<circle>` elements for each project node
    - Track node Y positions in state/ref
    - Compare current scroll position to node positions
    - Set `fill` attribute: foreground color if scroll passed, background color if not
    - Apply stroke color based on project background (white for blue, blue for others)
    - _Bug_Condition: Nodes remain unfilled regardless of scroll position_
    - _Expected_Behavior: Node circles fill as scroll passes them_
    - _Preservation: Node positions remain accurate for each project_
    - _Requirements: 2.5_

  - [ ] 4.7 Add resize handler to rebuild SVG
    - Use `useEffect` with resize event listener
    - Recalculate all dimensions and regenerate path on resize
    - Store path length and sample points for scroll calculations
    - Re-render SVG with new viewBox and path coordinates
    - _Bug_Condition: Static lineart doesn't respond to resize_
    - _Expected_Behavior: SVG rebuilds to match new container dimensions_
    - _Preservation: Existing resize behavior from prototype_
    - _Requirements: 3.3_

  - [ ] 4.8 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - Animated SVG Lineart
    - **IMPORTANT**: Re-run the SAME tests from tasks 1 and 2 - do NOT write new tests
    - The tests from tasks 1 and 2 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run bug condition exploration tests from steps 1 and 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 4.9 Verify preservation tests still pass
    - **Property 2: Preservation** - Mobile Layout and Accessibility Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 3 - do NOT write new tests
    - Run preservation property tests from step 3
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 5. Fix for left margin issue

  - [ ] 5.1 Remove excessive padding class from ProjectCard
    - In `src/components/common/ProjectCard.tsx`, locate the grid container div
    - Line with: `<div className="pin grid gap-4 md:gap-10 md:grid-cols-[1fr_1.35fr] md:pl-60 items-center">`
    - Remove `md:pl-60` from the className
    - Result: `<div className="pin grid gap-4 md:gap-10 md:grid-cols-[1fr_1.35fr] items-center">`
    - This removes the 240px left padding while preserving the 56px from `.pwrap`
    - _Bug_Condition: isBugCondition_Margin(state) where hasClass(state.element, "md:pl-60")_
    - _Expected_Behavior: computedPaddingLeft(state.element) <= 100 (approximately 56px)_
    - _Preservation: Mobile padding, grid layout, gap spacing unchanged_
    - _Requirements: 2.6, 2.7_

  - [ ] 5.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Balanced Margins on Project Cards
    - **IMPORTANT**: Re-run the SAME test from task 2 - do NOT write a new test
    - The test from task 2 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run left margin bug condition test from step 2
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.6, 2.7_

  - [ ] 5.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Layout Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 3 - do NOT write new tests
    - Run preservation property tests from step 3
    - Verify mobile padding, grid layout, and gap spacing remain unchanged
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - _Requirements: 3.5, 3.6, 3.7_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Run all exploration tests (tasks 1, 2) - should now PASS
  - Run all preservation tests (task 3) - should still PASS
  - Verify visual appearance in browser:
    - Lineart animates on scroll through projects
    - Lineart color changes when passing blue backgrounds
    - Arrow tip follows the drawn path
    - Node circles fill as scroll passes them
    - Project cards have balanced margins (no excessive left padding)
  - Ensure accessibility: prefers-reduced-motion disables animations
  - Ensure responsive: mobile layout unchanged, desktop has proper lineart
  - Ask the user if questions arise.
