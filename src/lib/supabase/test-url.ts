const url = 'https://jatcfxuomofecojlvnag.supabase.co'

try {
  const parsedUrl = new URL(url)
  console.log('URL is valid:', {
    href: parsedUrl.href,
    origin: parsedUrl.origin,
    hostname: parsedUrl.hostname,
  })
} catch (error) {
  console.error('URL parsing failed:', error)
}

export {} 