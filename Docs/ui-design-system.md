# UI/UX Design System

## Typography

- **Font**: [Inter](https://fonts.google.com/specimen/Inter) (weights: 400, 500, 600, 700, 800)
- Loaded via Google Fonts CDN in `index.css`

## Color Palette

### Primary (Healthcare Teal/Emerald)
| Token | Value | Usage |
|-------|-------|-------|
| `--primary-400` | `#34d399` | Active nav icon |
| `--primary-500` | `#10b981` | Focus rings |
| `--primary-600` | `#059669` | Buttons, gradients |
| `--primary-700` | `#047857` | Button hover, header bg |
| `--primary-900` | `#064e3b` | Sidebar bg gradient |

### Neutrals (Slate)
| Token | Value | Usage |
|-------|-------|-------|
| `--gray-50` | `#f8fafc` | Table hover, input bg |
| `--gray-200` | `#e2e8f0` | Borders |
| `--gray-500` | `#64748b` | Muted text |
| `--gray-900` | `#0f172a` | Sidebar background |

### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| `--success` | `#22c55e` | Status badges |
| `--warning` | `#f59e0b` | Alerts |
| `--danger` | `#ef4444` | Errors, delete buttons |

## Components

### Login Page
- Full-screen gradient background (dark teal)
- Glassmorphic card (`backdrop-filter: blur(24px)`)
- Heartbeat SVG brand icon
- Background ambient animation

### Sidebar Navigation
- Dark sidebar (`--gray-900`)
- SVG icons for each module (inline, no external deps)
- Active indicator bar (left edge)
- Gradient tenant logo badge

### Metric Cards
- Top gradient accent bar (color variants: blue, amber, rose, violet)
- SVG icons in colored container
- Hover lift effect (`translateY(-2px)`)

### Forms & Tables
- Focus rings with primary color glow
- Uppercase table headers with bottom border
- Row hover highlighting
- Submit buttons with gradient and shadow

### Chatbot Widget
- Floating action button with pulse animation
- Slide-up chat panel
- User/bot message bubbles
- Gradient header matching primary theme

## Responsive Breakpoints

- `≤ 1024px`: Sidebar collapses to horizontal nav bar
- `≤ 480px`: Chat panel goes full-width
