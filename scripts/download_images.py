import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import sys
import re

# Configuration
BASE_DIR = os.path.join("public", "images", "kentik-new")
MIN_WIDTH = 400

# Product Map: Name -> URL
PRODUCTS = {
    # Group 1: Core
    "npm": "https://www.kentik.com/solutions/network-performance-monitoring/",
    "nms": "https://www.kentik.com/product/network-monitoring-system/",
    "synthetic": "https://www.kentik.com/product/synthetic-monitoring/", # Updated URL guess
    "ai-advisor": "https://www.kentik.com/product/ai-advisor/",
    
    # Group 2: ISP (Used)
    "edge": "https://www.kentik.com/product/peering-and-interconnection/",
    "sp-analytics": "https://www.kentik.com/product/service-provider/",
    
    # Group 3: Gap (Missing)
    "protect": "https://www.kentik.com/product/network-security-and-compliance/",
    "kmi": "https://www.kentik.com/resources/kentik-market-intelligence/",
    "multi-cloud": "https://www.kentik.com/product/multi-cloud-observability/",
    "firehose": "https://www.kentik.com/resources/kentik-firehose/",
}

def clean_filename(url, count, slug):
    parsed = urlparse(url)
    basename = os.path.basename(parsed.path)
    if not basename or '.' not in basename:
        ext = ".png" # default
        if "jpg" in url: ext = ".jpg"
        basename = f"image{ext}"
    
    # Remove query string rubbish
    basename = basename.split('?')[0]
    # Ensure simplified name
    return f"{slug}_{count}_{basename}"

def download_file(url, folder, filename):
    if not url or url.startswith("data:"):
        return False
        
    try:
        response = requests.get(url, stream=True, timeout=10)
        if response.status_code != 200:
            return False
            
        filepath = os.path.join(folder, filename)
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"  [OK] Saved: {filename}")
        return True
    except Exception as e:
        # Silently fail for individual images to keep console clean
        return False

def get_high_res_url(img_tag):
    """Parse srcset or data-src to find the biggest image."""
    candidates = []
    
    # Check src
    src = img_tag.get('src')
    if src and not src.startswith('data:'):
        candidates.append((src, 0)) # Priority 0
        
    # Check data-src (lazy load)
    data_src = img_tag.get('data-src')
    if data_src and not data_src.startswith('data:'):
        candidates.append((data_src, 1))
        
    # Check srcset
    srcset = img_tag.get('srcset') or img_tag.get('data-srcset')
    if srcset:
        # Format: "url 100w, url 200w" or "url 1x, url 2x"
        parts = srcset.split(',')
        for part in parts:
            part = part.strip()
            if not part: continue
            
            bits = part.split(' ')
            url = bits[0]
            if url.startswith('data:'): continue
            
            width = 0
            if len(bits) > 1:
                w_str = bits[1]
                if 'w' in w_str:
                    try: width = int(w_str.replace('w', ''))
                    except: pass
                elif 'x' in w_str:
                    try: width = float(w_str.replace('x', '')) * 1000 # Artificial weight for density
                    except: pass
            
            candidates.append((url, width))
            
    # Sort by width descending
    candidates.sort(key=lambda x: x[1], reverse=True)
    
    if candidates:
        return candidates[0][0]
    return None

def scrape_images(product_slug, url):
    print(f"\nProcessing {product_slug}...")
    output_folder = os.path.join(BASE_DIR, product_slug)
    os.makedirs(output_folder, exist_ok=True)
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        r = requests.get(url, headers=headers)
        if r.status_code == 404:
            print(f"  [Warn] 404 Not Found: {url}")
            return
        r.raise_for_status()
        
        soup = BeautifulSoup(r.text, 'html.parser')
        
        count = 0
        seen_urls = set()
        
        # 1. Try OG:Image (HERO) - Usually the best quality summary image
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            full_url = og_image["content"]
            if full_url not in seen_urls:
                filename = f"{product_slug}_hero_og.jpg" # Normalize name for predictability
                if download_file(full_url, output_folder, filename):
                    seen_urls.add(full_url)
                    count += 1
        
        # 2. Find High Res Content Images
        # Look for images inside specific content containers if possible, or just all images
        images = soup.find_all('img')
        
        for img in images:
            if count >= 6: break
            
            # Get best url from srcset/src
            best_url = get_high_res_url(img)
            if not best_url: continue
            
            full_url = urljoin(url, best_url)
            
            if full_url in seen_urls: continue
            
            # Filters
            if full_url.endswith('.svg'): continue
            if 'logo' in full_url.lower() or 'icon' in full_url.lower(): continue
            if 'pixel' in full_url.lower(): continue
            
            # Try to filter by size checking header? Too slow.
            # Just download and overwrite if needed.
            
            filename = clean_filename(full_url, count, product_slug)
            
            if download_file(full_url, output_folder, filename):
                seen_urls.add(full_url)
                count += 1
                    
    except Exception as e:
        print(f"  [Err] Failed to scrape {url}: {e}")

def main():
    print("Starting High-Quality Image Download...")
    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)
        
    for slug, url in PRODUCTS.items():
        scrape_images(slug, url)
        
    print("\nDone! Images saved to:", BASE_DIR)

if __name__ == "__main__":
    main()
