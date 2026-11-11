# Muhammad Ibrahim Butt — Engineering Portfolio

[Visit the portfolio](https://muhammad-ibrahim-butt.github.io/) · [Backend résumé](https://muhammad-ibrahim-butt.github.io/assets/resume.pdf) · [AI evaluation résumé](https://muhammad-ibrahim-butt.github.io/assets/resume-ai-evaluation.pdf)

A static portfolio covering backend platforms, business automation, and AI agent evaluation. Built with HTML, shared CSS, and a small JavaScript navigation enhancement; hosted on GitHub Pages.

## What is here

- Seven case studies describing my role, engineering decisions, and outcomes, including QBSalesStar, WEPROCESS, and AI agent evaluation.
- Employment history with full-time, part-time, and contract roles labeled.
- Two downloadable résumés for backend engineering and AI evaluation roles.
- Responsive images, keyboard navigation, reduced-motion support, and a mobile menu that works without JavaScript.

## Preview locally

Clone the repository, then serve its root with a static HTTP server. For example, with Python 3 installed:

```sh
git clone https://github.com/muhammad-ibrahim-butt/muhammad-ibrahim-butt.github.io.git
cd muhammad-ibrahim-butt.github.io
python -m http.server 8000
```

Open http://localhost:8000. There is no frontend build step or runtime package installation.

## Checks

With Node.js 18 or later:

```sh
npm test
```

The checks cover local links and assets, fragment targets, page metadata, structured data, sitemap coverage, and the removal of customer-data screenshots. They do not replace browser or accessibility testing.

## Editing

- `index.html`: homepage, selected work, experience, and contact information.
- Root case-study HTML files: individual project narratives.
- `assets/css/style.css` and `assets/js/script.js`: shared presentation and navigation behavior.
- `assets/images/` and `assets/projects/`: profile images, icons, and project media.
- `assets/resume.pdf` and `assets/resume-ai-evaluation.pdf`: published résumé PDFs.
- [Résumé sources and export notes](resume/README.md): editable HTML and print styling.
- `_config.yml`: excludes development notes, tests, and résumé source files from the published site.

Keep claims consistent across the portfolio, résumé sources, exported PDFs, and [GitHub profile](https://github.com/muhammad-ibrahim-butt). Use synthetic data for examples and remove customer information from screenshots before publishing.
