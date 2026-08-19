import { useState, useEffect, useMemo, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
import "./Skillpath.css"

const FRAMER_CSS_STYLES = `
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..900&family=Inter:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

.skillpath-container {
  --paper-bg: #F6F7F2;
  --card-bg: #FAFAF7;
  --ink-primary: #1B2A4A;
  --accent-gold: var(--skillpath-accent, #E8B94A);
  --secondary-red: #C4443A;
  --text-muted: #8B93A1;
  --hairline: #D8D5C9;
  
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "Space Mono", monospace;

  font-family: var(--font-body);
  background-color: var(--paper-bg);
  color: var(--ink-primary);
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.skillpath-container * {
  box-sizing: border-box;
}

.skillpath-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--hairline);
}

.skillpath-logo {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skillpath-logo-stamp {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--ink-primary);
  background-color: var(--accent-gold);
  padding: 0.15rem 0.4rem;
  border: 1px solid var(--ink-primary);
  border-radius: 2px;
  letter-spacing: 0.08em;
  transform: rotate(-2deg);
  transition: background-color 0.2s ease;
}

.skillpath-nav-links {
  display: flex;
  gap: 2rem;
}

.skillpath-nav-link {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-muted);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.15s ease;
}

.skillpath-nav-link:hover,
.skillpath-nav-link.active {
  color: var(--ink-primary);
}

.skillpath-nav-link.active {
  border-bottom: 2px solid var(--ink-primary);
  padding-bottom: 0.25rem;
}

@media (max-width: 640px) {
  .skillpath-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1.25rem 1.25rem 1rem 1.25rem;
  }

  .skillpath-logo {
    font-size: 1.15rem;
    gap: 0.5rem;
  }

  .skillpath-logo-stamp {
    font-size: 0.6rem;
    padding: 0.1rem 0.35rem;
  }

  .skillpath-nav-links {
    gap: 1.25rem;
    width: 100%;
    border-top: 1px dashed var(--hairline);
    padding-top: 0.75rem;
  }

  .skillpath-nav-link {
    font-size: 0.75rem;
  }
}

.skillpath-dev-harness {
  background: #ffffff;
  border-bottom: 1.5px solid var(--hairline);
  padding: 1rem 1.5rem;
  position: relative;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-family: var(--font-mono), system-ui, sans-serif;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 640px) {
  .skillpath-dev-harness {
    padding: 0.75rem 1rem;
  }
}

.skillpath-hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4.5rem 2rem 3.5rem 2rem;
}

.skillpath-hero-content {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.skillpath-hero-tagline {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-primary);
  background-color: color-mix(in srgb, var(--accent-gold) 35%, transparent);
  border: 1px dashed var(--ink-primary);
  padding: 0.3rem 0.75rem;
  margin-bottom: 1.5rem;
  animation: heroFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0s backwards;
  transition: background-color 0.2s ease;
}

.skillpath-hero-title {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.08;
  color: var(--ink-primary);
  margin: 0 0 1.25rem 0;
  animation: heroFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.08s backwards;
}

@media (max-width: 768px) {
  .skillpath-hero-title {
    font-size: 2.5rem;
  }
}

.skillpath-hero-subtitle {
  font-family: var(--font-body);
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--ink-primary);
  opacity: 0.85;
  margin: 0 0 2rem 0;
  max-width: 580px;
  animation: heroFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.16s backwards;
}

.skillpath-hero-cta {
  font-family: var(--font-mono);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--paper-bg);
  background-color: var(--ink-primary);
  border: 1px solid var(--ink-primary);
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
  animation: heroFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.24s backwards;
}

.skillpath-hero-cta-stub {
  background: var(--accent-gold);
  color: var(--ink-primary);
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  transition: background-color 0.2s ease;
}

.skillpath-hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(27, 42, 74, 0.18);
}

.skillpath-hero-cta:active {
  transform: translateY(0);
}

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skillpath-courses-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem 2rem;
  border-top: 1px solid var(--hairline);
}

.skillpath-courses-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

@media (min-width: 768px) {
  .skillpath-courses-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.skillpath-courses-title-group {
  display: flex;
  flex-direction: column;
}

.skillpath-courses-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--ink-primary);
  margin: 0 0 0.25rem 0;
}

.skillpath-courses-subtitle {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--text-muted);
  margin: 0;
}

.skillpath-courses-count {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ink-primary);
  background-color: var(--hairline);
  padding: 0.35rem 0.75rem;
  border-radius: 2px;
  letter-spacing: 0.05em;
}

.skillpath-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.skillpath-search-wrapper {
  position: relative;
  flex: 1;
  min-width: 240px;
}

.skillpath-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.skillpath-search-input {
  font-family: var(--font-mono);
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.25rem;
  background-color: var(--card-bg);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  font-size: 0.8125rem;
  color: var(--ink-primary);
  outline: none;
  transition: border-color 0.15s ease;
}

.skillpath-search-input:focus {
  border-color: var(--ink-primary);
  background-color: #FFFFFF;
}

.skillpath-sort-select {
  font-family: var(--font-mono);
  padding: 0.625rem 2rem 0.625rem 0.875rem;
  background-color: var(--card-bg);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ink-primary);
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231B2A4A' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 14px;
  transition: border-color 0.15s ease;
}

.skillpath-sort-select:focus {
  border-color: var(--ink-primary);
}

.skillpath-currency-alert {
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: color-mix(in srgb, var(--secondary-red) 8%, var(--paper-bg));
  border: 1px dashed var(--secondary-red);
  border-radius: 4px;
  font-size: 0.8125rem;
  color: var(--secondary-red);
  margin-bottom: 2rem;
}

.skillpath-alert-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skillpath-alert-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.skillpath-alert-retry-btn {
  font-family: var(--font-mono);
  background: var(--secondary-red);
  color: #FFFFFF;
  border: none;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: opacity 0.15s ease;
}

.skillpath-alert-retry-btn:hover {
  opacity: 0.9;
}

.skillpath-alert-retry-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.skillpath-course-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
  align-items: stretch;
}

@media (min-width: 768px) {
  .skillpath-course-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .skillpath-course-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.skillpath-card {
  display: flex;
  flex-direction: column;
  background-color: var(--card-bg);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  outline: none;
  opacity: 0;
  transform: translateY(16px) rotate(-2deg);
  transition: opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
}

.skillpath-card.is-visible {
  opacity: 1;
  transform: translateY(0) rotate(0deg);
}

.skillpath-card.is-visible:hover {
  transform: translateY(-4px) rotate(0.5deg);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  border-color: var(--ink-primary);
  box-shadow: 0 8px 20px rgba(27, 42, 74, 0.08);
}

.skillpath-card-punch-hole {
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  z-index: 5;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--hairline);
  border: 1px solid color-mix(in srgb, var(--ink-primary) 20%, transparent);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15);
}

.skillpath-card-header-stamp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem 0.5rem 1.25rem;
  padding-right: 2.25rem;
}

.skillpath-card-code-stamp {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ink-primary);
  background-color: color-mix(in srgb, var(--accent-gold) 35%, transparent);
  border: 1px solid var(--ink-primary);
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  transform: rotate(-1.5deg);
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background-color 0.2s ease;
}

.skillpath-card-category-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.skillpath-card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: var(--hairline);
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
}

.skillpath-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(0.95) saturate(0.9);
}

.skillpath-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.skillpath-card-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin: 0 0 0.625rem 0;
  color: var(--ink-primary);
}

.skillpath-card-description {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--ink-primary);
  opacity: 0.85;
  margin: 0 0 1.25rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 3em;
}

.skillpath-card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.875rem;
  min-height: 2.25rem;
  border-top: 1px dashed var(--hairline);
}

.skillpath-card-price {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink-primary);
  line-height: 1.25;
  min-height: 1.5rem;
  display: inline-flex;
  align-items: center;
}

.skillpath-card-price.unavailable {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
}

.skillpath-badge {
  font-family: var(--font-mono);
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--ink-primary);
  background-color: var(--accent-gold);
  border: 1px solid var(--ink-primary);
  letter-spacing: 0.05em;
  transition: background-color 0.2s ease;
}

.skillpath-skeleton-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--hairline);
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--card-bg);
  position: relative;
}

.skillpath-skeleton-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  padding-right: 2.25rem;
}

.skillpath-skeleton-code {
  width: 70px;
  height: 20px;
}

.skillpath-skeleton-category {
  width: 90px;
  height: 16px;
}

.skillpath-skeleton-media {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.skillpath-skeleton-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
}

.skillpath-skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background-color: #E6E7E0;
  border-radius: 2px;
}

.skillpath-skeleton-shimmer::after {
  content: "";
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(246, 247, 242, 0) 0%,
    rgba(246, 247, 242, 0.5) 50%,
    rgba(246, 247, 242, 0) 100%
  );
  animation: shimmer 1.6s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.skillpath-skeleton-title {
  width: 75%;
  height: 22px;
  margin-bottom: 0.75rem;
}

.skillpath-skeleton-description-1 {
  width: 100%;
  height: 14px;
  margin-bottom: 0.5rem;
}

.skillpath-skeleton-description-2 {
  width: 85%;
  height: 14px;
  margin-bottom: 1.25rem;
}

.skillpath-skeleton-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.875rem;
  border-top: 1px dashed var(--hairline);
}

.skillpath-skeleton-price {
  width: 80px;
  height: 18px;
}

.skillpath-skeleton-badge {
  width: 70px;
  height: 18px;
}

.skillpath-error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3.5rem 2rem;
  border: 1px dashed var(--secondary-red);
  border-radius: 4px;
  background-color: color-mix(in srgb, var(--secondary-red) 4%, var(--card-bg));
}

.skillpath-error-stamp {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--secondary-red);
  border: 1px solid var(--secondary-red);
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  margin-bottom: 1rem;
  letter-spacing: 0.08em;
}

.skillpath-error-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: var(--ink-primary);
}

.skillpath-error-message {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--ink-primary);
  opacity: 0.8;
  margin: 0 0 1.5rem 0;
  max-width: 420px;
}

.skillpath-primary-btn {
  font-family: var(--font-mono);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--paper-bg);
  background-color: var(--ink-primary);
  border: 1px solid var(--ink-primary);
  cursor: pointer;
  outline: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: opacity 0.15s ease;
}

.skillpath-primary-btn:hover {
  opacity: 0.9;
}

.skillpath-primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.skillpath-empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3.5rem 2rem;
  border: 1px dashed var(--hairline);
  border-radius: 4px;
  background-color: var(--card-bg);
}

.skillpath-empty-stamp {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ink-primary);
  background-color: color-mix(in srgb, var(--accent-gold) 35%, transparent);
  border: 1px solid var(--ink-primary);
  padding: 0.25rem 0.6rem;
  border-radius: 2px;
  margin-bottom: 1rem;
  letter-spacing: 0.06em;
  transform: rotate(-1deg);
  transition: background-color 0.2s ease;
}

.skillpath-empty-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--ink-primary);
  margin: 0 0 0.35rem 0;
}

.skillpath-empty-message {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin: 0;
}

.skillpath-footer {
  border-top: 1px solid var(--hairline);
  background-color: var(--paper-bg);
  padding: 2.5rem 2rem 2rem 2rem;
}

.skillpath-footer-stub-card {
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  background-color: var(--card-bg);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  padding: 1.5rem 1.75rem;
}

.skillpath-footer-header-stamp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px dashed var(--hairline);
}

.skillpath-footer-closing-stamp {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ink-primary);
  background-color: color-mix(in srgb, var(--accent-gold) 35%, transparent);
  border: 1px solid var(--ink-primary);
  padding: 0.2rem 0.55rem;
  border-radius: 2px;
  transform: rotate(-1deg);
  display: inline-block;
  letter-spacing: 0.05em;
  transition: background-color 0.2s ease;
}

.skillpath-footer-ref-code {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.06em;
}

.skillpath-footer-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.75rem;
}

@media (min-width: 768px) {
  .skillpath-footer-grid {
    grid-template-columns: 1.2fr 1fr 1.1fr;
    gap: 2.5rem;
  }
}

.skillpath-footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.skillpath-footer-col-title {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.2rem;
}

.skillpath-footer-tagline,
.skillpath-footer-info-text {
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--ink-primary);
  opacity: 0.85;
  margin: 0;
}

.skillpath-footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.skillpath-footer-link {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ink-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: color 0.15s ease;
}

.skillpath-footer-link-prefix {
  color: var(--accent-gold);
  font-weight: 700;
  transition: color 0.2s ease;
}

.skillpath-footer-link:hover {
  color: var(--accent-gold);
}

.skillpath-footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 1.25rem;
  border-top: 1px solid var(--hairline);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skillpath-footer-copy {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.skillpath-archival-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 5rem 2rem;
  border-top: 1px solid var(--hairline);
  scroll-margin-top: 2rem;
}

.skillpath-section-header {
  max-width: 680px;
  margin-bottom: 2.5rem;
}

.skillpath-section-stamp {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-primary);
  background-color: color-mix(in srgb, var(--accent-gold) 35%, transparent);
  border: 1px dashed var(--ink-primary);
  padding: 0.3rem 0.75rem;
  display: inline-block;
  margin-bottom: 1rem;
  transition: background-color 0.2s ease;
}

.skillpath-section-title {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink-primary);
  margin: 0 0 0.75rem 0;
  line-height: 1.15;
}

.skillpath-section-subtitle {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ink-primary);
  opacity: 0.85;
  margin: 0;
}

.skillpath-about-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .skillpath-about-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }
}

.skillpath-about-card {
  background-color: var(--card-bg);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.skillpath-about-card:hover {
  transform: translateY(-3px);
  border-color: var(--ink-primary);
}

.skillpath-about-card-stamp {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--ink-primary);
  background-color: color-mix(in srgb, var(--accent-gold) 35%, transparent);
  border: 1px solid var(--ink-primary);
  padding: 0.15rem 0.45rem;
  border-radius: 2px;
  margin-bottom: 1rem;
  transform: rotate(-1deg);
}

.skillpath-about-card-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ink-primary);
  margin: 0 0 0.5rem 0;
}

.skillpath-about-card-text {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--ink-primary);
  opacity: 0.8;
  margin: 0;
}

.skillpath-contact-container {
  background-color: var(--card-bg);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  padding: 2rem;
  max-width: 760px;
}

.skillpath-contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.skillpath-form-row {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .skillpath-form-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.skillpath-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.skillpath-form-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--ink-primary);
}

.skillpath-form-input,
.skillpath-form-select,
.skillpath-form-textarea {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  padding: 0.625rem 0.875rem;
  background-color: var(--paper-bg);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  color: var(--ink-primary);
  outline: none;
  transition: border-color 0.15s ease;
}

.skillpath-form-input:focus,
.skillpath-form-select:focus,
.skillpath-form-textarea:focus {
  border-color: var(--ink-primary);
  background-color: #FFFFFF;
}

.skillpath-form-submit-btn {
  font-family: var(--font-mono);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--paper-bg);
  background-color: var(--ink-primary);
  border: 1px solid var(--ink-primary);
  cursor: pointer;
  outline: none;
  align-self: flex-start;
  transition: transform 0.15s ease, opacity 0.15s ease;
  margin-top: 0.5rem;
}

.skillpath-form-submit-btn:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

.skillpath-form-btn-stub {
  background: var(--accent-gold);
  color: var(--ink-primary);
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  transition: background-color 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .skillpath-hero-tagline,
  .skillpath-hero-title,
  .skillpath-hero-subtitle,
  .skillpath-hero-cta,
  .skillpath-card,
  .skillpath-card.is-visible:hover,
  .skillpath-skeleton-shimmer::after {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
`

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
  const [currencyOverride, setCurrencyOverride] = useState<"auto" | "INR" | "USD">("auto")

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

  // Currency Formatter (Supports automatic API detection + manual conversion toggle)
  const activeCurrency = useMemo(() => {
    if (currencyOverride !== "auto") return currencyOverride
    if (countryStatus === "success" && (countryCode === "IN" || countryCode === "US")) {
      return countryCode === "IN" ? "INR" : "USD"
    }
    return null
  }, [currencyOverride, countryStatus, countryCode])

  const formatPrice = (course: Course) => {
    if (activeCurrency === "INR") {
      const rupees = course.pricePaise / 100
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
        maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
      }).format(rupees)
    }
    if (activeCurrency === "USD") {
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

  const isPriceSortAvailable = activeCurrency !== null

  // 4. Sort logic (Featured, Low to High, High to Low)
  const sortedCourses = useMemo(() => {
    const list = [...filteredCourses]
    if (isPriceSortAvailable) {
      if (sortBy === "price-asc") {
        list.sort((a, b) => {
          const priceA = activeCurrency === "INR" ? a.pricePaise : a.priceUsdCents
          const priceB = activeCurrency === "INR" ? b.pricePaise : b.priceUsdCents
          return priceA - priceB
        })
      } else if (sortBy === "price-desc") {
        list.sort((a, b) => {
          const priceA = activeCurrency === "INR" ? a.pricePaise : a.priceUsdCents
          const priceB = activeCurrency === "INR" ? b.pricePaise : b.priceUsdCents
          return priceB - priceA
        })
      }
    }
    return list
  }, [filteredCourses, sortBy, isPriceSortAvailable, activeCurrency])

  return (
    <div className="skillpath-container" style={{ "--skillpath-accent": accentColor } as React.CSSProperties}>
      <style>{FRAMER_CSS_STYLES}</style>
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
              value={currencyOverride}
              onChange={(e) => setCurrencyOverride(e.target.value as "auto" | "INR" | "USD")}
              aria-label="Currency conversion selector"
            >
              <option value="auto">
                Currency: Auto ({activeCurrency ? activeCurrency : "Detecting"})
              </option>
              <option value="INR">Currency: ₹ INR (Rupees)</option>
              <option value="USD">Currency: $ USD (Dollars)</option>
            </select>

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
    defaultValue: "#E8B94A",
  },
  showRefundableBadge: {
    type: ControlType.Boolean,
    title: "Refundable Badge",
    defaultValue: true,
  },
})
