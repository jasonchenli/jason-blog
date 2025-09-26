# Jason's Health Blog

A personal health and wellness tracking platform built with modern web technologies.

## 🏥 About

This is my personal health blog where I track wellness metrics, share insights from my health journey, and provide resources for optimal health. The platform combines data visualization, blogging, and resource sharing to document and share evidence-based health optimization strategies.

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Deployment**: Vercel + Cloudflare

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/jason-blog.git
cd jason-blog
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
jason-blog/
├── public/
│   └── favicon.svg          # Health-themed favicon
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Responsive navigation
│   │   └── Footer.jsx      # Site footer
│   ├── pages/              # Route components
│   │   ├── Home.jsx        # Landing page
│   │   ├── About.jsx       # Personal introduction
│   │   ├── Blog.jsx        # Blog posts listing
│   │   ├── Metrics.jsx     # Health metrics dashboard
│   │   ├── Resources.jsx   # Health tools & resources
│   │   └── Contact.jsx     # Contact form
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles with Tailwind
├── index.html              # HTML template with SEO meta
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite build configuration
└── README.md              # This file
```

## 🌐 Deployment Guide

### Deploy to Vercel

1. **Connect Repository to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project" and import your Git repository
   - Vercel will auto-detect it's a Vite project

2. **Build Configuration**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Deploy**:
   - Click "Deploy" - Vercel will build and deploy automatically
   - Your site will be available at `your-project.vercel.app`

### Custom Domain with Cloudflare

1. **Vercel Domain Setup**:
   - In Vercel project settings, go to "Domains"
   - Add your custom domain: `jasonchen.ai`
   - Vercel will provide a CNAME target (usually `cname.vercel-dns.com`)

2. **Cloudflare DNS Configuration**:
   - Log into Cloudflare dashboard
   - Go to DNS settings for your domain
   - Add a CNAME record:
     - **Name**: `@` (for root domain) or `www`
     - **Target**: `cname.vercel-dns.com`
     - **Proxy Status**: ✅ Proxied (orange cloud)

3. **SSL Configuration**:
   - In Cloudflare, go to SSL/TLS settings
   - Set SSL mode to **"Full"** (not "Flexible")
   - This ensures proper HTTPS between Cloudflare and Vercel

4. **Verification**:
   - DNS propagation may take 24-48 hours
   - Test your domain and check SSL certificate validity

### Environment Variables (Optional)

For future integrations, add environment variables in Vercel:

```bash
# Health data APIs
VITE_OURA_API_KEY=your_oura_key
VITE_APPLE_HEALTH_KEY=your_apple_key
VITE_ANALYTICS_ID=your_analytics_id
```

## 📊 Features

- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🧭 Navigation**: Clean navigation with active state indicators
- **📝 Blog System**: Ready for content with category filtering
- **📊 Metrics Dashboard**: Health data visualization placeholders
- **📚 Resources**: Curated health and wellness tools
- **📧 Contact Form**: Functional contact form (backend integration needed)
- **🔍 SEO Optimized**: Complete meta tags, Open Graph, Twitter Cards

## 🎯 Roadmap

### Phase 1 - MVP (Current)
- ✅ Basic site structure and navigation
- ✅ Placeholder content and responsive design
- ✅ Deployment setup

### Phase 2 - Content & Integrations
- [ ] MDX integration for rich blog posts
- [ ] Health data API integrations (Oura, Apple Health)
- [ ] Contact form backend (Netlify Forms/Formspree)
- [ ] RSS feed generation

### Phase 3 - Advanced Features
- [ ] Interactive health charts (Chart.js/D3)
- [ ] Site search functionality
- [ ] Newsletter signup
- [ ] Dark mode toggle
- [ ] Performance optimizations

### Phase 4 - Analytics & Growth
- [ ] Google Analytics integration
- [ ] Sitemap generation
- [ ] Social media integrations
- [ ] Comment system for blog posts

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome! Feel free to:

- Open issues for bugs or feature requests
- Submit pull requests for improvements
- Share ideas via the contact form

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Website**: [jasonchen.ai](https://jasonchen.ai)
- **Email**: jason@jasonchen.ai
- **Twitter**: [@jasonchen_health](https://twitter.com/jasonchen_health)

---

*Built with ❤️ and data-driven health optimization*