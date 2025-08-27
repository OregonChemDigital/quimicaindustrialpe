# CSS Architecture - Química Industrial

## 🏗️ Architecture Overview

This project follows **ITCSS (Inverted Triangle CSS)** methodology, a scalable and maintainable CSS architecture used by industry leaders.

## 📁 Directory Structure

```
src/styles/
├── main.css                 # Main entry point with imports
├── base/                    # Foundation styles
│   ├── variables.css        # CSS Custom Properties
│   ├── typography.css       # Typography system
│   ├── mixins.css          # Reusable CSS patterns
│   ├── reset.css           # CSS reset/normalize
│   └── elements.css        # Base HTML element styles
├── layout/                  # Layout systems
│   ├── grid.css            # CSS Grid system
│   └── containers.css      # Container layouts
├── components/              # Reusable UI components
│   ├── buttons.css         # Button styles
│   ├── cards.css           # Card components
│   ├── forms.css           # Form elements
│   ├── navigation.css      # Navigation components
│   ├── modals.css          # Modal dialogs
│   ├── carousels.css       # Carousel components
│   ├── loading.css         # Loading states
│   └── messages.css        # Message components
├── pages/                   # Page-specific styles
│   ├── home.css            # Homepage styles
│   ├── products.css        # Products page
│   ├── contact.css         # Contact page
│   ├── quote.css           # Quote page
│   └── single-product.css  # Single product page
└── utilities/               # Helper classes
    ├── spacing.css         # Spacing utilities
    ├── typography.css      # Typography utilities
    ├── layout.css          # Layout utilities
    └── colors.css          # Color utilities
```

## 🎯 Design Principles

### 1. **ITCSS Methodology**
- **Settings**: Variables and configuration
- **Tools**: Mixins and functions
- **Generic**: Reset and normalize
- **Elements**: Base HTML elements
- **Objects**: Layout and grid systems
- **Components**: Reusable UI components
- **Pages**: Page-specific styles
- **Utilities**: Helper classes

### 2. **BEM Naming Convention**
```css
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

### 3. **CSS Custom Properties**
- Centralized design tokens
- Easy theming and customization
- Consistent spacing, colors, and typography

### 4. **Utility-First Approach**
- Comprehensive utility classes
- Rapid prototyping capabilities
- Consistent spacing and layout

## 🚀 Usage Guidelines

### Adding New Components
1. Create component CSS file in `components/` directory
2. Follow BEM naming convention
3. Use existing CSS variables and mixins
4. Import in `main.css` under appropriate section

### Adding New Pages
1. Create page CSS file in `pages/` directory
2. Use page-specific classes (e.g., `.page-home`, `.page-products`)
3. Import in `main.css` under Pages section

### Modifying Global Styles
1. **Variables**: Edit `base/variables.css`
2. **Typography**: Edit `base/typography.css`
3. **Layout**: Edit `layout/` files
4. **Utilities**: Edit `utilities/` files

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### Mobile-First Approach
- Start with mobile styles
- Use `min-width` media queries
- Progressive enhancement

## 🎨 CSS Variables

### Colors
```css
--color-primary-500: #16792f;    /* Main brand color */
--color-secondary-500: #64748b;  /* Secondary color */
--color-success: #10b981;        /* Success state */
--color-error: #ef4444;          /* Error state */
```

### Spacing
```css
--space-1: 0.25rem;   /* 4px */
--space-4: 1rem;      /* 16px */
--space-8: 2rem;      /* 32px */
--space-16: 4rem;     /* 64px */
```

### Typography
```css
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

## 🔧 Build Process

### Development
- CSS files are imported via `main.css`
- Hot Module Replacement (HMR) enabled
- Source maps for debugging

### Production
- CSS is bundled and optimized
- Unused CSS is purged
- Minified for performance

## 📚 Best Practices

1. **Use CSS Variables**: Always use design tokens from `variables.css`
2. **Follow BEM**: Maintain consistent naming conventions
3. **Mobile-First**: Write responsive CSS with mobile-first approach
4. **Utility Classes**: Leverage utility classes for rapid development
5. **Component Isolation**: Keep component styles self-contained
6. **Performance**: Avoid deep nesting and complex selectors

## 🐛 Troubleshooting

### CSS Not Loading
1. Check `main.css` imports
2. Verify file paths
3. Check browser console for errors

### Styles Not Applying
1. Check CSS specificity
2. Verify class names match HTML
3. Check for CSS conflicts

### Responsive Issues
1. Verify breakpoint values
2. Check media query syntax
3. Test on actual devices

## 📖 Resources

- [ITCSS Methodology](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
- [BEM Naming Convention](http://getbem.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
