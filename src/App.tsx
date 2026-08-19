import { useState, useEffect, useRef } from "react"
import { Skillpath } from "./Skillpath"

// Custom mock data for testing
const mockCourses = (count: number) => {
  const base = [
    {
      "courseName": "How To YouTube",
      "courseCode": "how-to-youtube",
      "description": "From concept to creation, learn how to build, grow, and monetize a YouTube channel using practical systems and real-world execution.",
      "mainCategory": "Content Creation",
      "shortCourse": "YouTube",
      "courseType": "Original",
      "pricePaise": 199900,
      "priceUsdCents": 3999,
      "mangoId": "a1b2c3d4e5f6789012345678",
      "refundable": true
    },
    {
      "courseName": "Figma Masterclass",
      "courseCode": "figma-masterclass",
      "description": "Learn advanced Figma techniques, design systems, auto-layout, and components to design modern web interfaces like a professional product designer.",
      "mainCategory": "Design",
      "shortCourse": "Figma",
      "courseType": "Original",
      "pricePaise": 249900,
      "priceUsdCents": 4999,
      "mangoId": "a1b2c3d4e5f6789012345679",
      "refundable": false
    },
    {
      "courseName": "Next.js Production Blueprint",
      "courseCode": "nextjs-blueprint",
      "description": "Build high-performance web applications with Next.js App Router, React Server Components, server actions, and deploy to Vercel.",
      "mainCategory": "Development",
      "shortCourse": "Next.js",
      "courseType": "Advanced",
      "pricePaise": 299900,
      "priceUsdCents": 5999,
      "mangoId": "a1b2c3d4e5f6789012345680",
      "refundable": true
    },
    {
      "courseName": "Copywriting That Converts",
      "courseCode": "copywriting",
      "description": "Master the psychology of persuasion and learn how to write clear, compelling sales copy, landing pages, and email sequences that convert visitors to customers.",
      "mainCategory": "Marketing",
      "shortCourse": "Copywriting",
      "courseType": "Original",
      "pricePaise": 149900,
      "priceUsdCents": 2999,
      "mangoId": "a1b2c3d4e5f6789012345681",
      "refundable": false
    },
    {
      "courseName": "Product Management Fundamentals",
      "courseCode": "pm-fundamentals",
      "description": "Learn to define product strategy, run user research, write spec docs, and collaborate with engineers to launch successful digital products from scratch.",
      "mainCategory": "Product",
      "shortCourse": "Product",
      "courseType": "Original",
      "pricePaise": 199900,
      "priceUsdCents": 3999,
      "mangoId": "a1b2c3d4e5f6789012345682",
      "refundable": true
    },
    {
      "courseName": "AI-Assisted Programming",
      "courseCode": "ai-programming",
      "description": "Learn how to accelerate your coding workflow, design architectures, and debug issues using state-of-the-art AI coding assistants responsibly.",
      "mainCategory": "Development",
      "shortCourse": "AI Coding",
      "courseType": "Original",
      "pricePaise": 99000,
      "priceUsdCents": 1999,
      "mangoId": "a1b2c3d4e5f6789012345683",
      "refundable": false
    },
    {
      "courseName": "SEO Fundamentals for Startups",
      "courseCode": "seo-startup",
      "description": "Rank your pages on Google. Understand search intent, keyword research, on-page optimization, and how to build high-quality backlinks.",
      "mainCategory": "Marketing",
      "shortCourse": "SEO",
      "courseType": "Original",
      "pricePaise": 129900,
      "priceUsdCents": 2499,
      "mangoId": "a1b2c3d4e5f6789012345684",
      "refundable": true
    },
    {
      "courseName": "Advanced UI Design Systems",
      "courseCode": "design-systems",
      "description": "Design massive UI systems from scratch. Tokens, layout grids, components, variants, accessibility guidelines, and developer handoff practices.",
      "mainCategory": "Design",
      "shortCourse": "Design Systems",
      "courseType": "Advanced",
      "pricePaise": 349900,
      "priceUsdCents": 6999,
      "mangoId": "a1b2c3d4e5f6789012345685",
      "refundable": true
    },
    {
      "courseName": "Financial Modeling for Founders",
      "courseCode": "financial-modeling",
      "description": "Build clean Excel/Sheets models for raising capital, planning runways, forecasting revenues, and analyzing unit economics for SaaS products.",
      "mainCategory": "Finance",
      "shortCourse": "Finance",
      "courseType": "Original",
      "pricePaise": 179900,
      "priceUsdCents": 3499,
      "mangoId": "a1b2c3d4e5f6789012345686",
      "refundable": false
    },
    {
      "courseName": "Brand Strategy Workshop",
      "courseCode": "brand-strategy",
      "description": "Discover your brand core, audience personas, positioning statement, and visual guidelines to build a memorable brand identity that stands out.",
      "mainCategory": "Marketing",
      "shortCourse": "Brand Strategy",
      "courseType": "Original",
      "pricePaise": 159900,
      "priceUsdCents": 2999,
      "mangoId": "a1b2c3d4e5f6789012345687",
      "refundable": true
    }
  ];
  return base.slice(0, count);
};

export default function App() {
  // Test Harness States
  const [courseMode, setCourseMode] = useState<string>("real")
  const [courseCount, setCourseCount] = useState<number>(8)
  const [countryMode, setCountryMode] = useState<string>("real")

  // Framer Property States
  const [accentColor, setAccentColor] = useState<string>("#0070F3")
  const [showRefundableBadge, setShowRefundableBadge] = useState<boolean>(true)

  // Use refs to make sure fetch interceptor always reads the absolute latest states
  const configRef = useRef({ courseMode, courseCount, countryMode })
  useEffect(() => {
    configRef.current = { courseMode, courseCount, countryMode }
  }, [courseMode, courseCount, countryMode])

  useEffect(() => {
    const originalFetch = window.fetch;

    // Override fetch to intercept API calls for testing
    window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const urlStr = input.toString();

      if (urlStr.includes("/assignment/course-data")) {
        const mode = configRef.current.courseMode;
        const count = configRef.current.courseCount;

        if (mode === "error-500") {
          return new Response("Internal Server Error", { status: 500 });
        }
        if (mode === "error-404") {
          return new Response("Not Found", { status: 404 });
        }
        if (mode === "mock-empty") {
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        if (mode.startsWith("mock-success")) {
          return new Response(JSON.stringify(mockCourses(count)), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      }

      if (urlStr.includes("/assignment/country-code")) {
        const mode = configRef.current.countryMode;

        if (mode === "error-500") {
          return new Response("Internal Server Error", { status: 500 });
        }
        if (mode === "error-404") {
          return new Response("Not Found", { status: 404 });
        }
        if (mode === "error-invalid-json") {
          return new Response("This is not JSON", {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        if (mode === "mock-in") {
          return new Response(JSON.stringify({ country_code: "IN" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        if (mode === "mock-us") {
          return new Response(JSON.stringify({ country_code: "US" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        if (mode === "mock-uk") {
          return new Response(JSON.stringify({ country_code: "UK" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <>
      {/* Test Harness Panel (Development Infrastructure Only) */}
      {import.meta.env.DEV && (
        <div className="skillpath-dev-harness">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem 2rem", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#1b2a4a" }}>
                Skillpath Testing Harness
              </h2>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                Control API and Property outputs below to evaluate state isolation.
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem 1.5rem", alignItems: "center" }}>
              {/* Courses API Select */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "#475569" }}>Course API State</label>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <select
                    value={courseMode}
                    onChange={(e) => setCourseMode(e.target.value)}
                    style={{ padding: "0.3rem 0.6rem", borderRadius: "0.25rem", border: "1px solid #cbd5e1", fontSize: "0.8rem" }}
                  >
                    <option value="real">Real API (Flaky 1 in 3)</option>
                    <option value="mock-success">Force Mock Success</option>
                    <option value="mock-empty">Force Success: Empty []</option>
                    <option value="error-500">Force Error 500</option>
                    <option value="error-404">Force Error 404</option>
                  </select>
                  {courseMode === "mock-success" && (
                    <select
                      value={courseCount}
                      onChange={(e) => setCourseCount(Number(e.target.value))}
                      style={{ padding: "0.3rem 0.5rem", borderRadius: "0.25rem", border: "1px solid #cbd5e1", fontSize: "0.8rem" }}
                    >
                      <option value={5}>5 Courses</option>
                      <option value={6}>6 Courses</option>
                      <option value={7}>7 Courses</option>
                      <option value={8}>8 Courses</option>
                      <option value={10}>10 Courses</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Country API Select */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "#475569" }}>Country API State</label>
                <select
                  value={countryMode}
                  onChange={(e) => setCountryMode(e.target.value)}
                  style={{ padding: "0.3rem 0.6rem", borderRadius: "0.25rem", border: "1px solid #cbd5e1", fontSize: "0.8rem" }}
                >
                  <option value="real">Real API (Flaky 1 in 3)</option>
                  <option value="mock-in">Force Success: IN (Rupees)</option>
                  <option value="mock-us">Force Success: US (Dollars)</option>
                  <option value="mock-uk">Force Success: UK (Unexpected)</option>
                  <option value="error-500">Force Error 500</option>
                  <option value="error-404">Force Error 404</option>
                  <option value="error-invalid-json">Force Invalid JSON</option>
                </select>
              </div>

              {/* Accent Color Picker */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "#475569" }}>Accent Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: "1.75rem", height: "1.75rem", border: 0, padding: 0, cursor: "pointer", background: "none" }}
                  />
                  <span style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>{accentColor}</span>
                </div>
              </div>

              {/* Refundable Badge Checkbox */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <input
                  type="checkbox"
                  id="showRefundable"
                  checked={showRefundableBadge}
                  onChange={(e) => setShowRefundableBadge(e.target.checked)}
                  style={{ width: "0.9rem", height: "0.9rem", cursor: "pointer" }}
                />
                <label htmlFor="showRefundable" style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", cursor: "pointer" }}>
                  Show Refundable Badges
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render Production Component */}
      <Skillpath
        key={`${courseMode}-${courseCount}-${countryMode}`}
        accentColor={accentColor}
        showRefundableBadge={showRefundableBadge}
      />
    </>
  )
}
