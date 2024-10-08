/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(45deg, #f57c00, #ff9800)',
        'gradient-2': 'linear-gradient(45deg, #ff5722, #ffc107)',
        'gradient-3': 'linear-gradient(45deg, #ff7043, #ffb74d)',
        'gradient-4': 'linear-gradient(45deg, #ff6f00, #ffca28)',
      },
      lineHeight: {
        'default': '1.6'
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: 1 },
          "70%": { opacity: 1 },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: 0,
          },
        },
        pulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 var(--pulse-color)" },
          "50%": { boxShadow: "0 0 0 8px var(--pulse-color)" },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        'pulse-red': {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 82, 82, 1)' },
          '70%': { boxShadow: '0 0 0 10px rgba(255, 82, 82, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255, 82, 82, 0)' },
        },
        'pulse-green': {
          '0%': { boxShadow: '0 0 0 0 rgba(0, 255, 0, 1)' },
          '70%': { boxShadow: '0 0 0 10px rgba(0, 255, 0, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0, 255, 0, 0)' },
        },
        'waterFlow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        meteor: "meteor 5s linear infinite",
        pulse: "pulse var(--duration) ease-out infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        'pulse-red': 'pulse-red 2s infinite',
        'pulse-green': 'pulse-green 2s infinite',
        'waterFlow': 'waterFlow 2s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}