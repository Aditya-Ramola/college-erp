# Setting Up a Custom Domain in Vercel

This guide will walk you through the process of setting up a custom domain for your SGRRU-ERP application deployed on Vercel.

## Prerequisites

1. A Vercel account with your project deployed
2. A registered domain name from a domain registrar (like Namecheap, GoDaddy, Google Domains, etc.)
3. Access to your domain's DNS settings

## Steps to Add a Custom Domain

### 1. Log in to Vercel Dashboard

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Sign in with your account credentials

### 2. Select Your Project

- Find and click on your "SGRRU-ERP" project from the dashboard

### 3. Navigate to Project Settings

- Click on the "Settings" tab in the top navigation
- From the left sidebar, select "Domains"

### 4. Add Your Domain

- In the "Domains" section, enter your domain name (e.g., `sgrru-erp.com`) in the input field
- Click "Add" button

### 5. Configure DNS Settings

After adding your domain, Vercel will provide you with DNS configuration instructions. You have two options:

#### Option A: Using Vercel as Your DNS Provider (Recommended)

1. In your domain registrar's dashboard, update your domain's nameservers to Vercel's nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

2. Wait for DNS propagation (can take up to 48 hours, but usually much faster)

#### Option B: Configuring DNS Records with Your Current Provider

1. Create an A record pointing your domain's root (@) to Vercel's IP: `76.76.21.21`
2. Create a CNAME record for the `www` subdomain pointing to `cname.vercel-dns.com`

### 6. Verify Your Domain

- Vercel will automatically verify your domain once DNS propagation is complete
- A green checkmark will appear next to your domain when it's successfully configured

### 7. Configure HTTPS (Optional)

Vercel automatically provisions SSL certificates for all domains, but you can:

- Go to "Settings" > "Domains"
- Click on your domain and review the SSL certificate settings
- You can choose to redirect all traffic to HTTPS (recommended)

## Troubleshooting

If your domain is not working properly:

1. **DNS Propagation**: Sometimes DNS changes take time to propagate. Wait at least 1-2 hours.

2. **Verification Issues**: If Vercel cannot verify your domain:
   - Check that your DNS settings match Vercel's recommendations exactly
   - Ensure there are no conflicting DNS records

3. **SSL Certificate Issues**: If your site shows security warnings:
   - Wait a bit longer as SSL certificates might need time to provision
   - Check if your domain registrar offers DNSSEC and disable it temporarily if needed

4. **Contact Support**: If problems persist, contact Vercel support from your dashboard

## Benefits of a Custom Domain

- Professional branding for your SGRRU-ERP system
- Easier access for users without remembering a Vercel subdomain
- Ability to create subdomains for different environments (e.g., test.sgrru-erp.com)
- Better SEO performance

For additional help, refer to [Vercel's official documentation on custom domains](https://vercel.com/docs/concepts/projects/domains).