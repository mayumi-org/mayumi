import mdx from '@next/mdx'
import mdxSlug from 'rehype-slug'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'tsx', 'md', 'mdx', 'ts'],
  swcMinify: true,
}

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [mdxSlug],
    providerImportSource: '@mdx-js/react',
  },
})

export default withMDX(nextConfig)
