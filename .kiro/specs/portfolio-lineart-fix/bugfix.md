# Bugfix Requirements Document

## Introduction

This document addresses two bugs in the React portfolio website:
1. **Lineart Animation Not Working** - The sophisticated SVG-based scroll-driven lineart animation from the prototype is replaced with a static implementation in React
2. **Left Margin Too Large on Project Page** - Project cards have excessive left padding causing unbalanced layout

---

## Bug Analysis

### Current Behavior (Defect)

**Bug 1: Lineart Animation**

1.1 WHEN viewing the projects section THEN the system displays a static vertical line with simple circular nodes instead of an animated SVG path

1.2 WHEN scrolling through project slides THEN the system does not animate the lineart path progressively based on scroll position

1.3 WHEN the lineart passes through a project with blue background THEN the system does not change the path color to white (it remains blue)

1.4 WHEN scrolling through projects THEN the system does not display an arrow tip that follows the drawn path and rotates based on direction

1.5 WHEN the scroll position passes a node THEN the system does not fill the node circles to indicate progress

**Bug 2: Left Margin**

1.6 WHEN viewing project cards on medium screens and larger THEN the system applies `md:pl-60` (15rem/240px) left padding causing excessive left margin

1.7 WHEN viewing project cards THEN the system applies additional `padding-left: 3.5rem` from CSS, compounding the margin issue

### Expected Behavior (Correct)

**Bug 1: Lineart Animation**

2.1 WHEN viewing the projects section THEN the system SHALL render an SVG path with Bezier curves passing through all project slides

2.2 WHEN scrolling through project slides THEN the system SHALL progressively draw the lineart path using `stroke-dasharray` animation based on scroll position

2.3 WHEN the lineart passes through a project with blue background THEN the system SHALL change the path color to white; WHEN passing through light/sky backgrounds THEN the system SHALL use #2563EB color

2.4 WHEN scrolling through projects THEN the system SHALL display an arrow tip element that follows the drawn path and rotates based on the path direction

2.5 WHEN the scroll position passes a node THEN the system SHALL fill the node circle to indicate progress

**Bug 2: Left Margin**

2.6 WHEN viewing project cards on medium screens and larger THEN the system SHALL NOT apply `md:pl-60` class to avoid excessive left padding

2.7 WHEN viewing project cards THEN the system SHALL maintain balanced margins appropriate for the layout

### Unchanged Behavior (Regression Prevention)

**Bug 1: Lineart Animation**

3.1 WHEN viewing on mobile devices (width < 768px) THEN the system SHALL CONTINUE TO hide the project title labels next to nodes

3.2 WHEN prefers-reduced-motion is enabled THEN the system SHALL CONTINUE TO disable animations for accessibility

3.3 WHEN the window is resized THEN the system SHALL CONTINUE TO rebuild the lineart to match new dimensions

3.4 WHEN there are multiple projects THEN the system SHALL CONTINUE TO display a node for each project at the correct vertical position

**Bug 2: Left Margin**

3.5 WHEN viewing on mobile devices THEN the system SHALL CONTINUE TO apply appropriate padding for mobile layout

3.6 WHEN viewing the project card grid THEN the system SHALL CONTINUE TO display content in a two-column layout on medium screens and larger

3.7 WHEN viewing project cards THEN the system SHALL CONTINUE TO apply the gap-4 md:gap-10 spacing between grid columns
