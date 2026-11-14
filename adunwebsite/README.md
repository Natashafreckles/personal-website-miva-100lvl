# Website Project Report

## Project overview

This project is a responsive portfolio website for Natasha Okocha, a customer experience specialist. It introduces her professional background, presents customer experience and service-operations work, and gives visitors ways to make contact. An academic planner adds a small interactive task-management feature.

The site is implemented as a collection of static pages. The planner stores tasks in the visitor's browser; the contact form validates and confirms entries in the browser and does not send them to a server.

## Pages

| Page | Purpose |
| --- | --- |
| Home (`index.html`) | Introduces Natasha and her customer experience expertise, highlights selected projects, and links visitors to the rest of the site. |
| About (`about.html`) | Presents education, skills, technology tools, career aspirations, and customer-first approach. |
| Projects (`projects.html`) | Describes three customer experience concepts: a user onboarding guide, CX metrics, and a CX ticket dashboard. |
| Planner (`planner.html`) | Lets visitors add, complete, and delete tasks, clear completed tasks, and see their remaining task count. Tasks are saved in that browser on that device. |
| Contact (`contact.html`) | Displays contact details and provides a form with required-field, email, and phone-number checks. Form submission is a browser-only demo confirmation. |

## Technology used

- **HTML5** for page content, navigation, forms, and semantic structure.
- **CSS3** for the shared visual theme, layouts, and responsive styling.
- **Vanilla JavaScript** for the mobile navigation, dynamic copyright year, planner interactions and storage, and contact-form validation.
- **Web Storage API (`localStorage`)** to keep planner tasks in the current browser.
- **Google Fonts** for DM Sans and Manrope typography.
- **Netlify** for hosting.
- **GitHub** for source-code repository hosting.

The project is a static front-end site; no application framework, build process, or server-side form handler is part of the current implementation.

## Foundation requirements

The implementation is designed around the following foundations:

- **Clear purpose:** communicate the owner's professional profile and showcase relevant work.
- **Straightforward navigation:** provide consistent links across all five pages and clear calls to action.
- **Responsive presentation:** adapt layouts for desktop and smaller screens, including a collapsible mobile navigation.
- **Accessible interaction:** use semantic page landmarks, a keyboard skip link, descriptive labels, and ARIA state/status attributes where appropriate.
- **Useful feedback:** show planner task counts and empty states, and display inline contact-form validation messages.
- **Maintainable structure:** keep page markup, shared styling, and interactive behavior in separate HTML, CSS, and JavaScript files.
- **Privacy-aware behavior:** planner data stays in browser storage on the visitor's device; the contact form does not transmit submissions.

### Test cases and results

The following smoke tests were run against the local website in the integrated browser. The mobile navigation test used a 390 × 844 viewport.

| ID | Test case | Expected result | Actual result |
| --- | --- | --- | --- |
| TC-01 | Open Home, About, Projects, Planner, and Contact. | Each page loads and displays its expected main heading. | **Pass** — all five pages loaded and showed the expected heading. |
| TC-02 | Add a planner task, mark it complete, reload the page, then delete it. | The task appears, its completed state persists after reload, and it can be deleted. | **Pass** — all steps succeeded. |
| TC-03 | Submit the contact form empty, then with an invalid email and phone, then with valid values. | Required fields and invalid formats are rejected; valid values show the confirmation. | **Pass** — required-field, email, and phone checks worked; valid input showed the demo confirmation. No message is sent to a server. |
| TC-04 | Open the mobile navigation and select Projects at a 390 × 844 viewport. | The menu is available, its expanded state updates, and the link navigates to Projects. | **Pass** — the menu opened, `aria-expanded` updated, and navigation succeeded. |


### Code validation

The source is organized into five HTML pages, one shared stylesheet (`styles.css`), and one shared script (`script.js`). The implementation includes:

- Responsive CSS breakpoints for tablet and mobile widths.
- Semantic navigation and main-content landmarks, page titles and descriptions, and a skip-to-content link.
- Client-side required-field, email-format, and digits-only phone checks on the contact form.
- Planner task checks, saved browser storage, and recovery from malformed saved task data.

#### Validation results

Browser-based structural checks were run on the five local HTML pages.

| Validation check | Result |
| --- | --- |
| Page title, English language declaration, one main landmark, and one main heading on each page | **Pass** — all five pages. |
| Unique element IDs and alternative text attributes on images | **Pass** — all five pages. |
| Labels associated with form fields | **Pass** — all form fields checked. |
| Local page links and in-page anchor targets | **Pass** — no broken local destinations found. |
| Stylesheet and JavaScript references present | **Pass** — shared CSS and JS are referenced by all pages. |
| JavaScript runtime page errors during page checks | **Pass** — none observed. |


## Hosting and repository

- **Hosting:** Netlify
- **Source repository:** GitHub