import mdx from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'tsx', 'md', 'mdx', 'ts'],
  swcMinify: true
}

const withMDX = mdx({
  extension: /\.mdx?$/,
})

export default withMDX(nextConfig)
