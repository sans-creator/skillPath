import { useState, useEffect, useMemo, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
import "./Skillpath.css"

// TypeScript interfaces based on the Course API shape
export interface Course {
  courseName: string
  courseCode: string
  description: string
  mainCategory: string
  shortCourse: string
  courseType: string
  pricePaise: number
  priceUsdCents: number
  mangoId: string
  refundable: boolean
}

export interface SkillpathProps {
  accentColor?: string
  showRefundableBadge?: boolean
  courseApiUrl?: string
  countryApiUrl?: string
}

function isValidCourse(item: unknown): item is Course {
  if (typeof item !== "object" || item === null) return false
  const c = item as Record<string, unknown>
  return (
    typeof c.courseName === "string" &&
    typeof c.description === "string" &&
    typeof c.mainCategory === "string" &&
    typeof c.pricePaise === "number" &&
    typeof c.priceUsdCents === "number" &&
    typeof c.mangoId === "string" &&
    typeof c.refundable === "boolean"
  )
}

// Cohesive, editorial photography mapped to category names
const CATEGORY_VISUAL_MAP: Record<string, string> = {
  "productivity": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=85",
  "business": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=85",
  "social media": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=85",
  "audio": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=85",
  "content creation": "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=85",
  "video editing": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=85",
  "branding": "https://images.unsplash.com/photo-1542744094-3a3172720449?auto=format&fit=crop&w=800&q=85",
  "design": "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=85",
  "development": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=85",
  "marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=85",
  "product": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=85",
  "finance": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=85",
}

const FALLBACK_VISUAL_URL = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=85"

function getCategoryVisual(category: string): string {
  if (!category) return FALLBACK_VISUAL_URL
  const key = category.trim().toLowerCase()
  return CATEGORY_VISUAL_MAP[key] || FALLBACK_VISUAL_URL
}

type FetchStatus = "idle" | "loading" | "success" | "error"

export function Skillpath({
  accentColor = "#E8B94A",
  showRefundableBadge = true,
  courseApiUrl = "https://syncsphere-hiv6.onrender.com/assignment/course-data",
  countryApiUrl = "https://syncsphere-hiv6.onrender.com/assignment/country-code",
}: SkillpathProps) {
  // Course State
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesStatus, setCoursesStatus] = useState<FetchStatus>("idle")
  const [coursesRetryTrigger, setCoursesRetryTrigger] = useState<number>(0)

  // Country State
  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [countryStatus, setCountryStatus] = useState<FetchStatus>("idle")
  const [countryRetryTrigger, setCountryRetryTrigger] = useState<number>(0)

  // Interactive controls state
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("featured")

  // Grid container ref for IntersectionObserver scroll reveal
  const gridRef = useRef<HTMLDivElement>(null)

  // 1. Fetch Course Data independently
  useEffect(() => {
    const controller = new AbortController()
    
    async function fetchCourses() {
      setCoursesStatus("loading")
      try {
        const response = await fetch(courseApiUrl, { signal: controller.signal })
        if (controller.signal.aborted) return
        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`)
        }
        const data = await response.json()
        if (controller.signal.aborted) return
        if (!Array.isArray(data) || !data.every(isValidCourse)) {
          throw new Error("Invalid course data payload")
        }
        setCourses(data)
        setCoursesStatus("success")
      } catch (err: unknown) {
        if (controller.signal.aborted || (err instanceof Error && err.name === "AbortError")) {
          return
        }
        setCoursesStatus("error")
      }
    }

    fetchCourses()

    return () => {
      controller.abort()
    }
  }, [courseApiUrl, coursesRetryTrigger])

  // 2. Fetch Country Code independently
  useEffect(() => {
    const controller = new AbortController()

    async function fetchCountry() {
      setCountryStatus("loading")
      setCountryCode(null) // Reset country code to ensure no stale cached currency state
      try {
        const response = await fetch(countryApiUrl, { signal: controller.signal })
        if (controller.signal.aborted) return
        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`)
        }
        const data = await response.json()
        if (controller.signal.aborted) return
        if (!data || typeof data.country_code !== "string") {
          throw new Error("Invalid response schema: country_code not found")
        }
        
        const code = data.country_code.toUpperCase()
        if (code !== "IN" && code !== "US") {
          // Unexpected country_code (not IN or US); treat as unavailable currency fallback
          throw new Error(`Unsupported country code: ${code}`)
        }

        setCountryCode(code)
        setCountryStatus("success")
      } catch (err: unknown) {
        if (controller.signal.aborted || (err instanceof Error && err.name === "AbortError")) {
          return
        }
        setCountryStatus("error")
        setCountryCode(null) // Reset code to indicate currency is unavailable
      }
    }

    fetchCountry()

    return () => {
      controller.abort()
    }
  }, [countryApiUrl, countryRetryTrigger])

  // IntersectionObserver for course card scroll reveal
  useEffect(() => {
    if (!gridRef.current) return

    const cards = gridRef.current.querySelectorAll(".skillpath-card")
    if (cards.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    )

    cards.forEach((card) => observer.observe(card))

    return () => {
      observer.disconnect()
    }
  }, [coursesStatus, searchQuery, sortBy, courses])

  // Retry triggers (guarded against rapid multiple clicks while loading)
  const handleCoursesRetry = () => {
    if (coursesStatus === "loading") return
    setCoursesRetryTrigger((prev) => prev + 1)
  }

  const handleCountryRetry = () => {
    if (countryStatus === "loading") return
    setCountryRetryTrigger((prev) => prev + 1)
  }

  // Smooth scroll helper for the Hero CTA
  const handleScrollToCourses = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const target = document.getElementById("courses-section")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Currency Formatter
  const formatPrice = (course: Course) => {
    if (countryStatus === "success" && countryCode === "IN") {
      const rupees = course.pricePaise / 100
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
        maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
      }).format(rupees)
    }
    if (countryStatus === "success" && countryCode === "US") {
      const dollars = course.priceUsdCents / 100
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(dollars)
    }
    return "Price unavailable"
  }

  // 3. Search filter logic
  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return courses
    return courses.filter((course) => {
      return (
        course.courseName.toLowerCase().includes(query) ||
        course.mainCategory.toLowerCase().includes(query)
      )
    })
  }, [courses, searchQuery])

  const isPriceSortAvailable = countryStatus === "success" && (countryCode === "IN" || countryCode === "US")

  // 4. Sort logic (Featured, Low to High, High to Low)
  const sortedCourses = useMemo(() => {
    const list = [...filteredCourses]
    if (isPriceSortAvailable) {
      if (sortBy === "price-asc") {
        list.sort((a, b) => {
          const priceA = countryCode === "IN" ? a.pricePaise : a.priceUsdCents
          const priceB = countryCode === "IN" ? b.pricePaise : b.priceUsdCents
          return priceA - priceB
        })
      } else if (sortBy === "price-desc") {
        list.sort((a, b) => {
          const priceA = countryCode === "IN" ? a.pricePaise : a.priceUsdCents
          const priceB = countryCode === "IN" ? b.pricePaise : b.priceUsdCents
          return priceB - priceA
        })
      }
    }
    return list
  }, [filteredCourses, sortBy, countryCode, isPriceSortAvailable])

  return (
    <div className="skillpath-container" style={{ "--skillpath-accent": accentColor } as React.CSSProperties}>
      {/* Catalog Header */}
      <header className="skillpath-header">
        <a href="#" className="skillpath-logo">
          <span className="skillpath-logo-stamp">ARCHIVE</span>
          Skillpath Catalog
        </a>
        <nav className="skillpath-nav-links">
          <a href="#courses-section" className="skillpath-nav-link active">Courses</a>
          <a href="#about-section" className="skillpath-nav-link">About</a>
          <a href="#contact-section" className="skillpath-nav-link">Contact</a>
        </nav>
      </header>

      {/* Archival Hero Section */}
      <section className="skillpath-hero">
        <div className="skillpath-hero-content">
          <div className="skillpath-hero-tagline">CATALOG NO. 2026 // SYLLABUS ARCHIVE</div>
          <h1 className="skillpath-hero-title">Master real-world craft.</h1>
          <p className="skillpath-hero-subtitle">
            Browse practical, project-based course syllabi taught by industry practitioners. Real-world execution.
          </p>
          <button className="skillpath-hero-cta" onClick={handleScrollToCourses}>
            Explore Catalog <span className="skillpath-hero-cta-stub">STUB #01</span>
          </button>
        </div>
      </section>

      {/* Courses Catalog Main Section */}
      <main id="courses-section" className="skillpath-courses-section">
        
        {/* Section Header & Controls */}
        <div className="skillpath-courses-header">
          <div className="skillpath-courses-title-area">
            <div className="skillpath-courses-title-group">
              <h2 className="skillpath-courses-title">Index Directory</h2>
              <p className="skillpath-courses-subtitle">Curated course index cards available for study.</p>
            </div>
            {coursesStatus === "success" && courses.length > 0 && (
              <span className="skillpath-courses-count" key={sortedCourses.length}>
                INDEX: {sortedCourses.length} OF {courses.length} RECORDS
              </span>
            )}
          </div>

          {/* Controls UI (Search & Sort) */}
          <div className="skillpath-controls">
            <div className="skillpath-search-wrapper">
              <svg className="skillpath-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="skillpath-search-input"
                placeholder="Search catalog index..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search catalog index"
              />
            </div>
            <select
              className="skillpath-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort catalog index"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc" disabled={!isPriceSortAvailable}>
                Price: Low to High
              </option>
              <option value="price-desc" disabled={!isPriceSortAvailable}>
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        {/* Independent Currency Warning Banner */}
        {countryStatus === "error" && (
          <div className="skillpath-currency-alert">
            <div className="skillpath-alert-left">
              <svg className="skillpath-alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>CURRENCY WARNING: Regional rates unverified. Price display unavailable.</span>
            </div>
            <button
              className="skillpath-alert-retry-btn"
              onClick={handleCountryRetry}
            >
              Retry Currency
            </button>
          </div>
        )}

        {/* Content States Grid */}
        {coursesStatus === "loading" && (
          <div className="skillpath-course-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="skillpath-skeleton-card" key={index}>
                <div className="skillpath-card-punch-hole" aria-hidden="true" />
                <div className="skillpath-skeleton-header">
                  <div className="skillpath-skeleton-shimmer skillpath-skeleton-code" />
                  <div className="skillpath-skeleton-shimmer skillpath-skeleton-category" />
                </div>
                <div className="skillpath-skeleton-shimmer skillpath-skeleton-media" />
                <div className="skillpath-skeleton-body">
                  <div className="skillpath-skeleton-shimmer skillpath-skeleton-title" />
                  <div className="skillpath-skeleton-shimmer skillpath-skeleton-description-1" />
                  <div className="skillpath-skeleton-shimmer skillpath-skeleton-description-2" />
                  <div className="skillpath-skeleton-footer">
                    <div className="skillpath-skeleton-shimmer skillpath-skeleton-price" />
                    <div className="skillpath-skeleton-shimmer skillpath-skeleton-badge" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {coursesStatus === "error" && (
          <div className="skillpath-error-container">
            <div className="skillpath-error-stamp">RECORD ERROR</div>
            <h3 className="skillpath-error-title">Unable to Retrieve Index Records</h3>
            <p className="skillpath-error-message">
              Connection failure while loading catalog cards. Please re-trigger index query.
            </p>
            <button
              className="skillpath-primary-btn"
              onClick={handleCoursesRetry}
            >
              Retry Catalog Index
            </button>
          </div>
        )}

        {coursesStatus === "success" && courses.length === 0 && (
          <div className="skillpath-empty-container">
            <div className="skillpath-empty-stamp">NO RECORDS FOUND — ARCHIVE EMPTY</div>
            <h3 className="skillpath-empty-title">Catalog Register Empty</h3>
            <p className="skillpath-empty-message">No course records available in current catalog register.</p>
          </div>
        )}

        {coursesStatus === "success" && courses.length > 0 && (
          <>
            {sortedCourses.length === 0 ? (
              <div className="skillpath-empty-container">
                <div className="skillpath-empty-stamp">NO MATCHING INDEX RECORDS</div>
                <h3 className="skillpath-empty-title">No Search Matches</h3>
                <p className="skillpath-empty-message">
                  {searchQuery.trim()
                    ? `No catalog records found matching "${searchQuery.trim()}"`
                    : "No course index cards match filter criteria."}
                </p>
              </div>
            ) : (
              <div className="skillpath-course-grid" ref={gridRef}>
                {sortedCourses.map((course, index) => {
                  const formattedPrice = formatPrice(course)
                  const showBadge = showRefundableBadge && course.refundable
                  const visualUrl = getCategoryVisual(course.mainCategory)

                  return (
                    <article
                      className="skillpath-card"
                      key={course.mangoId}
                      style={{ transitionDelay: `${(index % 6) * 40}ms` }}
                    >
                      {/* Signature Punch Hole (Library Index Card element) */}
                      <div className="skillpath-card-punch-hole" aria-hidden="true" />

                      {/* Header Stamp with Code & Category Tag */}
                      <div className="skillpath-card-header-stamp">
                        <span className="skillpath-card-code-stamp">{course.courseCode}</span>
                        <span className="skillpath-card-category-tag">{course.mainCategory}</span>
                      </div>

                      {/* Visual Cover */}
                      <div className="skillpath-card-media">
                        <img
                          src={visualUrl}
                          alt={course.courseName}
                          className="skillpath-card-img"
                          loading="lazy"
                        />
                      </div>

                      {/* Card Content Body */}
                      <div className="skillpath-card-body">
                        <h3 className="skillpath-card-title">{course.courseName}</h3>
                        <p className="skillpath-card-description">{course.description}</p>
                        
                        <div className="skillpath-card-footer">
                          <span className={`skillpath-card-price ${formattedPrice === "Price unavailable" ? "unavailable" : ""}`}>
                            {formattedPrice}
                          </span>
                          {showBadge && (
                            <span className="skillpath-badge">REFUNDABLE</span>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* About Section (Archival Manifesto) */}
      <section id="about-section" className="skillpath-archival-section">
        <div className="skillpath-section-header">
          <div className="skillpath-section-stamp">ARCHIVAL MANIFESTO // RECORD #001</div>
          <h2 className="skillpath-section-title">Built for real-world execution.</h2>
          <p className="skillpath-section-subtitle">
            Skillpath is a physical-curriculum index designed to bridge the gap between abstract theory and production execution. Every course syllabus is authored by active industry practitioners.
          </p>
        </div>

        <div className="skillpath-about-grid">
          <div className="skillpath-about-card">
            <span className="skillpath-about-card-stamp">PRINCIPLE #01</span>
            <h3 className="skillpath-about-card-title">Project-Based Syllabi</h3>
            <p className="skillpath-about-card-text">
              Learn through real systems, concrete code artifacts, design tokens, and production workflows.
            </p>
          </div>

          <div className="skillpath-about-card">
            <span className="skillpath-about-card-stamp">PRINCIPLE #02</span>
            <h3 className="skillpath-about-card-title">Practitioner Led</h3>
            <p className="skillpath-about-card-text">
              Authored exclusively by engineers, founders, and product designers actively operating in industry.
            </p>
          </div>

          <div className="skillpath-about-card">
            <span className="skillpath-about-card-stamp">PRINCIPLE #03</span>
            <h3 className="skillpath-about-card-title">Transparent Pricing</h3>
            <p className="skillpath-about-card-text">
              Independent regional currency detection ensuring clear, upfront pricing with zero hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section (Inquiry Desk Ticket Form) */}
      <section id="contact-section" className="skillpath-archival-section">
        <div className="skillpath-section-header">
          <div className="skillpath-section-stamp">INQUIRY DESK // TICKET OFFICE #04</div>
          <h2 className="skillpath-section-title">Get in touch with the registrar.</h2>
          <p className="skillpath-section-subtitle">
            Have questions regarding course syllabi, regional pricing, or curriculum customization? Submit an inquiry ticket below.
          </p>
        </div>

        <div className="skillpath-contact-container">
          <form className="skillpath-contact-form" onSubmit={(e) => { e.preventDefault(); alert("Inquiry Ticket #2026-INQ submitted successfully!"); }}>
            <div className="skillpath-form-row">
              <div className="skillpath-form-group">
                <label className="skillpath-form-label" htmlFor="contact-name">FULL NAME</label>
                <input id="contact-name" type="text" className="skillpath-form-input" placeholder="e.g. Alex Morgan" required />
              </div>
              <div className="skillpath-form-group">
                <label className="skillpath-form-label" htmlFor="contact-email">EMAIL ADDRESS</label>
                <input id="contact-email" type="email" className="skillpath-form-input" placeholder="alex@example.com" required />
              </div>
            </div>

            <div className="skillpath-form-group">
              <label className="skillpath-form-label" htmlFor="contact-subject">INQUIRY TOPIC</label>
              <select id="contact-subject" className="skillpath-form-select">
                <option value="curriculum">Course Curriculum Guidance</option>
                <option value="pricing">Regional Pricing & Payment</option>
                <option value="enterprise">Enterprise Team Access</option>
                <option value="other">General Archival Inquiry</option>
              </select>
            </div>

            <div className="skillpath-form-group">
              <label className="skillpath-form-label" htmlFor="contact-message">INQUIRY DETAILS</label>
              <textarea id="contact-message" className="skillpath-form-textarea" rows={4} placeholder="Write your question or request here..." required />
            </div>

            <button type="submit" className="skillpath-form-submit-btn">
              Submit Inquiry Ticket <span className="skillpath-form-btn-stub">TICKET #2026</span>
            </button>
          </form>
        </div>
      </section>

      {/* Archival Closing Footer */}
      <footer className="skillpath-footer">
        <div className="skillpath-footer-stub-card">
          {/* Top closing stamp bar */}
          <div className="skillpath-footer-header-stamp">
            <span className="skillpath-footer-closing-stamp">
              END OF INDEX // RECORD COUNT: {courses.length} ENTRIES
            </span>
            <span className="skillpath-footer-ref-code">REF: SP-2026-ARCHIVE</span>
          </div>

          {/* 3-Column Content Grid */}
          <div className="skillpath-footer-grid">
            {/* Column 1: Brand & Tagline */}
            <div className="skillpath-footer-col">
              <span className="skillpath-footer-col-title">CURRICULUM ARCHIVE</span>
              <p className="skillpath-footer-tagline">
                Physical curriculum index for practical craft, real-world strategy, and hands-on execution.
              </p>
            </div>

            {/* Column 2: Index Navigation */}
            <div className="skillpath-footer-col">
              <span className="skillpath-footer-col-title">INDEX DIRECTORY</span>
              <nav className="skillpath-footer-nav" aria-label="Footer navigation">
                <a href="#courses-section" className="skillpath-footer-link">
                  <span className="skillpath-footer-link-prefix">→</span> Courses
                </a>
                <a href="#about-section" className="skillpath-footer-link">
                  <span className="skillpath-footer-link-prefix">→</span> About
                </a>
                <a href="#contact-section" className="skillpath-footer-link">
                  <span className="skillpath-footer-link-prefix">→</span> Contact
                </a>
              </nav>
            </div>

            {/* Column 3: Archive Metadata Info */}
            <div className="skillpath-footer-col">
              <span className="skillpath-footer-col-title">SYSTEM INFO</span>
              <p className="skillpath-footer-info-text">
                Register updated daily. Maintained by industry practitioners for real-world execution.
              </p>
            </div>
          </div>
        </div>

        {/* Hairline Divider & Copyright Line */}
        <div className="skillpath-footer-bottom">
          <div className="skillpath-footer-copy">
            &copy; {new Date().getFullYear()} SKILLPATH ARCHIVE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  )
}

// Register Framer property controls (accentColor, showRefundableBadge)
addPropertyControls(Skillpath, {
  accentColor: {
    type: ControlType.Color,
    title: "Accent Color",
    defaultValue: "#0070F3",
  },
  showRefundableBadge: {
    type: ControlType.Boolean,
    title: "Refundable Badge",
    defaultValue: true,
  },
})
