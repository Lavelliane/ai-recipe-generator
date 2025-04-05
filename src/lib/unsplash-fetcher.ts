'use server'

export async function fetchUnsplashImages(query: string) {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}`, {
        headers: {
            'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
    });
    const data = await response.json();
    return data.results;
}