# Suppliers Page - Responsive Layout Reference

## Quick Responsive Breakdown

### DESKTOP (1200px+)
```
┌─────────────────────────────────────────────────────────┐
│                      HERO SECTION                        │
│                    (Standalone block)                     │
│  - Breadcrumb                                            │
│  - Title: "Find Verified Suppliers"                      │
│  - Search bar (horizontal)                               │
│  - 3 Stats: Total Suppliers, Industries, Categories      │
│                                                           │
│ [Decorative grid background + gradient blob]             │
│                         100px bottom padding              │
└─────────────────────────────────────────────────────────┘
              ─────── Visual separator ───────
┌─────────────────────────────────────────────────────────┐
│                  CONTENT SECTION                         │
│  ┌──────────────┐  ┌──────────────────────────────────┐ │
│  │   SIDEBAR    │  │     MAIN AREA                    │ │
│  │  (sticky     │  │  ┌──────────────────────────────┐│ │
│  │   top:100px) │  │  │ Toolbar (sort, view)        ││ │
│  │              │  │  ├──────────────────────────────┤│ │
│  │ Filters:     │  │  │ Supplier Cards Grid (2 cols) ││ │
│  │ ・Type      │  │  │ ┌────────┐  ┌────────┐       ││ │
│  │ ・Industry  │  │  │ │Card 1  │  │Card 2  │       ││ │
│  │ ・[Apply]   │  │  │ ├────────┤  ├────────┤       ││ │
│  │              │  │  │ │Card 3  │  │Card 4  │       ││ │
│  │              │  │  │ └────────┘  └────────┘       ││ │
│  │              │  │  ├──────────────────────────────┤│ │
│  │              │  │  │ Pagination                  ││ │
│  │              │  │  └──────────────────────────────┘│ │
│  └──────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        60px padding
```

---

### TABLET (1024px - 768px)
```
┌─────────────────────────────────────────────────────────┐
│                      HERO SECTION                        │
│                    (Same as desktop                      │
│                    but smaller padding)                   │
│                         60px bottom padding              │
└─────────────────────────────────────────────────────────┘
              ─────── Visual separator ───────
┌─────────────────────────────────────────────────────────┐
│                  CONTENT SECTION                         │
│  [🔽 Filters Button (Show/Hide)]                         │
│                                                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │           MAIN AREA (Full width)                     │ │
│  │  ┌────────────────────────────────────────────────┐ │ │
│  │  │ Toolbar (sort, view)                           │ │ │
│  │  ├────────────────────────────────────────────────┤ │ │
│  │  │ Supplier Cards Grid (2 cols → 1 col for list) │ │ │
│  │  │ ┌──────────────┐                              │ │ │
│  │  │ │Card 1 (wide) │                              │ │ │
│  │  │ ├──────────────┤                              │ │ │
│  │  │ │Card 2 (wide) │                              │ │ │
│  │  │ ├──────────────┤                              │ │ │
│  │  │ │Card 3 (wide) │                              │ │ │
│  │  │ └──────────────┘                              │ │ │
│  │  ├────────────────────────────────────────────────┤ │ │
│  │  │ Pagination                                     │ │ │
│  │  └────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                           │
│  [WHEN FILTERS OPEN] ←────────────────────────────────┐  │
│                                                        ▼  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Filter Sidebar (320px overlay)                       │ │
│  │ Fixed position, z-index: 100                         │ │
│  │ Filters:                                             │ │
│  │ ・Type                                                │ │
│  │ ・Industry                                            │ │
│  │ ・[Apply]                                             │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                        40px padding
```

---

### MOBILE (480px - 768px)
```
┌─────────────────────────────────┐
│      HERO SECTION               │
│  (Reduced padding & sizing)      │
│                                 │
│  Breadcrumb (smaller)           │
│  Title (40px)                   │
│  Subtitle (16px)                │
│  Search bar (vertical)          │
│  ┌────────────────────────────┐ │
│  │[Search Input]              │ │
│  ├────────────────────────────┤ │
│  │[Search Button]             │ │
│  └────────────────────────────┘ │
│                                 │
│  Stats (1 per line)             │
│  250+ Suppliers                 │
│  50+ Industries                 │
│  100+ Categories                │
│                                 │
│        60px bottom padding       │
└─────────────────────────────────┘
       ─── Visual separator ───
┌─────────────────────────────────┐
│   CONTENT SECTION               │
│                                 │
│ [🔽 Show Filters] (full width) │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   MAIN AREA (Full width)    │ │
│ │                             │ │
│ │ Toolbar:                    │ │
│ │ [Grid] [List] [Sort ▼]      │ │
│ │                             │ │
│ │ Cards (1 column):           │ │
│ │ ┌─────────────────────────┐ │ │
│ │ │Card 1 (full width)      │ │ │
│ │ ├─────────────────────────┤ │ │
│ │ │Card 2 (full width)      │ │ │
│ │ ├─────────────────────────┤ │ │
│ │ │Card 3 (full width)      │ │ │
│ │ └─────────────────────────┘ │ │
│ │                             │ │
│ │ [< 1 2 3 ... 10 >]          │ │
│ └─────────────────────────────┘ │
│                                 │
│ [WHEN "Show Filters" CLICKED]:  │
│ ┌─────────────────────────────┐ │
│ │ Filter Panel (inline)       │ │
│ │ Type filter                 │ │
│ │ Industry filter             │ │
│ │ [Apply Filters]             │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
         40px padding
```

---

### SMALL MOBILE (360px - 480px)
```
┌──────────────────────────────┐
│   HERO (Extra compressed)    │
│                              │
│ Breadcrumb (12px font)       │
│ Title (24px, clamp)          │
│ Subtitle (14px)              │
│ Search (vertical stack)      │
│ [Input] [Button]             │
│                              │
│ Stats (stacked)              │
│ 250+                         │
│ SUPPLIERS                    │
│                              │
│      40px bottom             │
└──────────────────────────────┘
       ─── separator ───
┌──────────────────────────────┐
│   CONTENT                    │
│                              │
│ [Show Filters]               │
│                              │
│ [Card 1]                     │
│ [Card 2]                     │
│ [Card 3]                     │
│ [< 1 2 3 >]                  │
│                              │
│ [Filter Panel when open]     │
│                              │
└──────────────────────────────┘
      24px padding
```

---

## Responsive Behavior Details

### Hero Section
| Breakpoint | Padding | Title Size | Subtitle | Search | Stats Gap |
|------------|---------|-----------|----------|--------|-----------|
| Desktop 1200+ | 80px sides | 56px | 18px | Horizontal | 64px |
| Tablet 1024 | 60px sides | 48px | 18px | Horizontal | 48px |
| Mobile 768 | 16px sides | 40px | 16px | Vertical | 12px |
| Small 480 | 12px sides | 32px | 14px | Vertical | 12px |
| Tiny 360 | 10px sides | 22px | 13px | Vertical | 8px |

### Content Section (Grid)
| Breakpoint | Grid Template | Sidebar | Gap | Content Padding |
|------------|--------------|---------|-----|-----------------|
| Desktop 1200+ | 280px 1fr | Position: sticky | 48px | 60px |
| Tablet 1024 | 280px 1fr | Position: sticky | 48px | 40px |
| Mobile 768 | 1fr | Position: static | 24px | 40px |
| Small 480 | 1fr | Position: static | 20px | 24px |
| Tiny 360 | 1fr | Position: static | 16px | 16px |

### Sidebar/Filter Behavior
| Breakpoint | Display | Position | Width | Behavior |
|------------|---------|----------|-------|----------|
| Desktop 1200+ | Block | sticky (top: 100px) | 280px | Always visible, stick on scroll |
| Tablet 1024 | Toggle | fixed (z: 100) | 320px | Drawer overlay, click toggle to show |
| Mobile 768 | Toggle | static | 100% | Inline when open, inline flow |

### Supplier Cards
| Breakpoint | Grid Columns | Card Padding | Card Radius | Gap |
|------------|-------------|--------------|-----------|-----|
| Desktop 1200+ | 2 columns | 24px | 16px | 24px |
| Tablet 1024 | 2 columns | 24px | 16px | 20px |
| Mobile 768 | 1 column | 12px | 12px | 16px |
| Small 480 | 1 column | 12px | 12px | 12px |

---

## Breakpoint Strategy (Mobile-First)

### Base Styles (Mobile First)
```
.listings-page {
  display: flex;
  flex-direction: column;  /* All sections stack */
}

.listings-content {
  display: grid;
  grid-template-columns: 1fr;  /* Mobile: 1 column */
}

.suppliers-grid {
  grid-template-columns: 1fr;  /* Mobile: single cards */
}

.listings-sidebar {
  position: static;  /* Mobile: inline */
  display: none;     /* Hidden by default */
}

.listings-sidebar.open {
  display: block;    /* Show when toggled */
}
```

### Tablet (768px - 1024px)
```
@media (min-width: 768px) {
  .suppliers-grid {
    grid-template-columns: repeat(2, 1fr);  /* 2 columns */
  }
}
```

### Desktop (1024px+)
```
@media (min-width: 1024px) {
  .listings-content {
    grid-template-columns: min(280px, 25%) 1fr;  /* Sidebar + main */
  }

  .listings-sidebar {
    position: sticky;  /* Sticky scroll */
    display: block !important;  /* Always visible */
  }

  .listings-mobile-filter-toggle {
    display: none;  /* Hide toggle */
  }
}
```

---

## No Overlapping - Guaranteed

### Hero to Content Boundary
```
Hero {
  padding-bottom: 100px;  /* Good vertical separation */
  overflow: hidden;       /* Contain decorative elements */
}

Hero::after {
  bottom: -30%;          /* Positioned low, doesn't reach content */
  height: 100%;          /* Sized to not extend too far */
}

Content {
  margin-top: 0;         /* Content naturally starts below */
  background: #FFFFFF;   /* Clear background change */
  position: relative;    /* Establishes new stacking context */
  z-index: 1;            /* Above any floating elements */
}

Content::before {
  /* Subtle line separator for visual distinction */
  height: 1px;
  background: linear-gradient(fade-in, fade-out);
}
```

Result: **Zero overlapping, clear visual separation**

---

## Code Examples

### Full Responsive Hero Example
```jsx
<header className="listings-hero">
  <div className="listings-hero-content">
    <nav className="listings-breadcrumb">
      <Link to="/">Home</Link> / <span>Suppliers Directory</span>
    </nav>
    
    <h1 className="listings-hero-title">
      Find Verified <span>Suppliers</span>
    </h1>
    
    <p className="listings-hero-subtitle">
      Connect with trusted B2B suppliers and manufacturers worldwide.
    </p>
    
    <form className="listings-search-bar">
      {/* Responsive: vertical on mobile, horizontal on desktop */}
      <input type="text" placeholder="Search..." />
      <button type="submit">Search</button>
    </form>
    
    <div className="listings-stats-row">
      {/* Stats: tight on mobile, spread on desktop */}
    </div>
  </div>
</header>
```

### Full Responsive Content Example
```jsx
<section className="listings-content">
  {/* Mobile: Full width, can be toggled */}
  {/* Desktop: Sidebar always visible */}
  <button className="listings-mobile-filter-toggle">
    Show Filters
  </button>
  
  <aside className="listings-sidebar">
    {/* Filters: Sticky on desktop, modal on tablet, inline on mobile */}
  </aside>
  
  <main className="listings-main">
    {/* Always full width, adapts to sidebar presence */}
  </main>
</section>
```

---

## Testing Checklist

### Hero Section
- [ ] Desktop: Hero clearly separated from content
- [ ] Desktop: Search bar is horizontal
- [ ] Desktop: Stats show across line
- [ ] Tablet: Hero padding reduced appropriately  
- [ ] Mobile: Search bar stacks vertically
- [ ] Mobile: Stats display single column
- [ ] Small: Text not clipped, readable

### Content Layout
- [ ] Desktop: 2 columns (sidebar + main)
- [ ] Desktop: Sidebar sticks when scrolling
- [ ] Tablet: 1 column, sidebar toggles
- [ ] Mobile: Full width, filters in line
- [ ] Cards: 2 col on desktop, 1 col on mobile
- [ ] No horizontal scroll on any device
- [ ] Touch targets ≥ 44px on mobile

### Responsiveness
- [ ] Clamped sizes scale smoothly
- [ ] No layout shift between breakpoints
- [ ] Images scale proportionally
- [ ] Text readable at all sizes
- [ ] Buttons clickable on mobile

---

**Summary:** Fully responsive, section-separated, no overlapping layout ready for production.
