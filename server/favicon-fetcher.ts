export async function fetchFaviconUrl(websiteUrl: string): Promise<string | undefined> {
  try {
    const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
    const baseUrl = `${url.protocol}//${url.hostname}`;
    
    // Try to fetch the actual HTML and find the favicon
    try {
      const response = await fetch(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        const html = await response.text();
        
        // Look for various favicon link tags
        const faviconPatterns = [
          /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/i,
          /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["']/i,
        ];
        
        for (const pattern of faviconPatterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            let faviconUrl = match[1];
            // Make absolute URL if relative
            if (faviconUrl.startsWith('//')) {
              faviconUrl = url.protocol + faviconUrl;
            } else if (faviconUrl.startsWith('/')) {
              faviconUrl = baseUrl + faviconUrl;
            } else if (!faviconUrl.startsWith('http')) {
              faviconUrl = baseUrl + '/' + faviconUrl;
            }
            return faviconUrl;
          }
        }
      }
    } catch (fetchError) {
      console.log(`Could not fetch HTML from ${websiteUrl}:`, fetchError);
    }
    
    // Try common favicon paths
    const commonPaths = [
      `${baseUrl}/favicon.ico`,
      `${baseUrl}/favicon.png`,
      `${baseUrl}/apple-touch-icon.png`,
    ];
    
    for (const faviconPath of commonPaths) {
      try {
        const headResponse = await fetch(faviconPath, {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000)
        });
        if (headResponse.ok) {
          return faviconPath;
        }
      } catch {
        // Continue to next path
      }
    }
    
    // Fall back to DuckDuckGo's service (better coverage than Google)
    return `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`;
  } catch (error) {
    console.error("Error generating favicon URL:", error);
    return undefined;
  }
}
