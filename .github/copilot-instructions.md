# Copilot Instructions for my-blog

## Repository Overview

This is a personal blog built with **Gatsby v5** (static site generator for React). The blog contains articles about web and mobile development. The project uses **Node.js v20** and is deployed to AWS S3 via Serverless Framework.

**Project Type**: Gatsby static site  
**Languages**: JavaScript (React), CSS, Markdown  
**Framework**: Gatsby v5.13.7  
**Runtime**: Node.js v20  
**Package Manager**: npm  
**Deployment**: AWS S3 (via serverless-finch plugin)

## Build & Development Commands

### Critical Command Sequence

**ALWAYS run commands in this exact order:**

1. **Install dependencies** (always run first after clone or when package.json changes):

   ```bash
   npm install
   ```

2. **Clean build artifacts** (recommended before building):

   ```bash
   npm run clean
   ```

3. **Build the site**:

   ```bash
   npm run build
   ```

   - Generates static files to `public/` directory
   - Takes ~30-60 seconds typically
   - Creates optimized production bundle

4. **Development server**:

   ```bash
   npm run develop
   ```

   - Runs on http://localhost:8000
   - Hot-reloading enabled
   - GraphQL explorer at http://localhost:8000/\_\_\_graphql

5. **Serve production build locally**:
   ```bash
   npm run serve
   ```

   - **Requires `npm run build` first**
   - Serves from `public/` directory on http://localhost:9000
   - Use to test production build locally

### Additional Commands

- **Format code**: `npm run format` (runs Prettier)
- **Deploy to dev**: `npm run deploy:dev` (deploys to AWS S3 dev bucket)
- **Deploy to prod**: `npm run deploy:prod` (deploys to AWS S3 prod bucket)

### Validated Command Behaviors

- `npm run serve` **will fail** if you haven't run `npm run build` first
- `npm run clean` removes `.cache/` and `public/` directories - safe to run anytime
- Development and serve can run on different ports simultaneously (8000 vs 9000)

## Project Architecture

### Directory Structure

```
/
├── content/blog/           # Markdown blog posts (each in own folder)
├── src/
│   ├── components/         # React components (bio.js, layout.js, seo.js)
│   ├── images/            # Source images for processing
│   ├── pages/             # Gatsby pages (index.js, 404.js)
│   ├── templates/         # Page templates (blog-post.js)
│   ├── normalize.css      # CSS reset
│   └── style.css          # Global styles
├── static/                # Static assets copied as-is to public/
├── public/                # Generated site output (gitignored)
├── .cache/                # Gatsby cache (gitignored)
├── gatsby-config.js       # Gatsby configuration & plugins
├── gatsby-node.js         # Build-time page creation logic
├── gatsby-browser.js      # Browser APIs
├── gatsby-ssr.js          # Server-side rendering APIs
└── serverless.yml         # AWS deployment configuration
```

### Key Configuration Files

- **gatsby-config.js**: Site metadata, plugin configuration (Google Analytics, RSS feed, PWA manifest, image optimization)
- **gatsby-node.js**: Creates blog post pages from markdown, handles slugs and pagination
- **.prettierrc**: Code formatting (no semicolons, avoid arrow parens)
- **.editorconfig**: Editor settings (LF, UTF-8, 2-space indent)
- **serverless.yml**: AWS S3 bucket config and caching headers for deployment

### Content Architecture

- Blog posts live in `content/blog/{post-slug}/index.md`
- Each post is a folder containing `index.md` and optional images
- Frontmatter required: `title`, `date`, `description`
- GraphQL queries in templates fetch post data
- Blog post URLs: `/{post-slug}/`

### Build Process

1. Gatsby reads `gatsby-config.js` for plugins and site metadata
2. `gatsby-node.js` creates pages from markdown files in `content/blog/`
3. GraphQL layer indexes all content
4. React components in `src/` render pages using templates
5. Static HTML/CSS/JS generated to `public/`
6. Images optimized and responsive versions created

## Code Style & Formatting

- **Prettier** is configured (`.prettierrc`)
- No semicolons (`"semi": false`)
- Avoid arrow parens where possible (`"arrowParens": "avoid"`)
- 2-space indentation
- LF line endings
- Always run `npm run format` before committing

## Deployment & CI/CD

**No GitHub Actions or CI/CD pipelines currently configured.**

Manual deployment process:

1. Build locally: `npm run build`
2. Deploy to dev: `npm run deploy:dev`
3. Deploy to prod: `npm run deploy:prod`

Deployment uses `serverless-finch` plugin to sync `public/` to S3 buckets:

- Dev bucket: `shooksweb-blog-dev`
- Prod bucket: `shooksweb-blog-prod`

Cache headers are configured in `serverless.yml`:

- HTML files: no cache
- Static assets (JS/CSS): immutable, 1-year cache
- Service worker: no cache

## Common Pitfalls & Workarounds

1. **Cannot serve without building first**
   - Error: Running `npm run serve` without prior `npm run build` will fail
   - Solution: Always run `npm run build` before `npm run serve`

2. **Stale cache issues**
   - If seeing unexpected behavior during development
   - Solution: Run `npm run clean` then restart dev server

3. **Node version compatibility**
   - Project requires Node.js v20
   - Check version with `node --version`

4. **Port conflicts**
   - Dev server (8000) and serve (9000) use different ports
   - Can run simultaneously if needed

## Making Changes

### Adding a New Blog Post

1. Create folder: `content/blog/new-post-slug/`
2. Add `index.md` with required frontmatter
3. Add images to same folder if needed
4. Test locally with `npm run develop`

### Modifying Components

- React components are in `src/components/`
- Page components in `src/pages/`
- Blog template in `src/templates/blog-post.js`
- Always format with `npm run format` before committing

### Updating Dependencies

1. Update `package.json`
2. Run `npm install`
3. Test with `npm run clean && npm run build && npm run serve`
4. Verify site works at http://localhost:9000

## Validation Steps

Before considering any change complete:

1. **Format check**: Run `npm run format`
2. **Build check**: Run `npm run clean && npm run build` (must succeed)
3. **Serve check**: Run `npm run serve` and verify at http://localhost:9000
4. **Manual testing**: Navigate site, check modified pages render correctly

## Trust These Instructions

These instructions have been validated by running actual commands and examining the codebase. Only perform additional searches if:

- Instructions are incomplete for your specific task
- Instructions appear outdated (file structure changed)
- Commands fail unexpectedly with errors

Otherwise, trust and follow these instructions to minimize exploration time.
