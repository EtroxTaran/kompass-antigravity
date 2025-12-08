/** @type {import('tailwindcss').Config} */

function alpha(variable) {
    return ({ opacityValue }) => {
        if (opacityValue === undefined) {
            return `var(${variable})`
        }
        return `color-mix(in srgb, var(${variable}) calc(${opacityValue} * 100%), transparent)`
    }
}

export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                background: alpha('--background'),
                foreground: alpha('--foreground'),
                card: {
                    DEFAULT: alpha('--card'),
                    foreground: alpha('--card-foreground')
                },
                popover: {
                    DEFAULT: alpha('--popover'),
                    foreground: alpha('--popover-foreground')
                },
                primary: {
                    DEFAULT: alpha('--primary'),
                    foreground: alpha('--primary-foreground')
                },
                secondary: {
                    DEFAULT: alpha('--secondary'),
                    foreground: alpha('--secondary-foreground')
                },
                muted: {
                    DEFAULT: alpha('--muted'),
                    foreground: alpha('--muted-foreground')
                },
                accent: {
                    DEFAULT: alpha('--accent'),
                    foreground: alpha('--accent-foreground')
                },
                destructive: {
                    DEFAULT: alpha('--destructive'),
                    foreground: alpha('--destructive-foreground')
                },
                border: alpha('--border'),
                input: alpha('--input'),
                ring: alpha('--ring'),
                chart: {
                    '1': alpha('--chart-1'),
                    '2': alpha('--chart-2'),
                    '3': alpha('--chart-3'),
                    '4': alpha('--chart-4'),
                    '5': alpha('--chart-5')
                },
                sidebar: {
                    DEFAULT: alpha('--sidebar'),
                    foreground: alpha('--sidebar-foreground'),
                    primary: alpha('--sidebar-primary'),
                    'primary-foreground': alpha('--sidebar-primary-foreground'),
                    accent: alpha('--sidebar-accent'),
                    'accent-foreground': alpha('--sidebar-accent-foreground'),
                    border: alpha('--sidebar-border'),
                    ring: alpha('--sidebar-ring')
                }
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
}
