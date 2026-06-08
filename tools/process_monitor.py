import os
from PIL import Image

def process_monitor():
    # Source image path
    brain_dir = r"C:\Users\Matvey\.gemini\antigravity-ide\brain\35375256-bf92-4eb5-a5ad-8548cabfdbd3"
    src_path = os.path.join(brain_dir, "media__1780923586982.png")
    
    # Destination paths
    dest_path1 = r"assets/img/ecp-banner-monitor.png"
    dest_path2 = r"assets/img/ecp/banner-monitor.png"
    
    if not os.path.exists(src_path):
        print(f"Source file not found: {src_path}")
        return
        
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    pixels = img.load()
    
    visited = set()
    queue = []
    
    # Initialize BFS queue with all border pixels
    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h-1))
        visited.add((x, 0))
        visited.add((x, h-1))
    for y in range(1, h-1):
        queue.append((0, y))
        queue.append((w-1, y))
        visited.add((0, y))
        visited.add((w-1, y))
        
    print(f"BFS starting on {w}x{h} image to remove background...")
    
    count = 0
    while queue:
        cx, cy = queue.pop(0)
        
        # Make background/shadow pixel transparent
        pixels[cx, cy] = (0, 0, 0, 0)
        count += 1
        
        # Check 4-connected neighbors
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                r, g, b, a = pixels[nx, ny]
                
                # Check if it is a background or shadow pixel
                # Background is pure white, shadow is very light grey/blue.
                # Since the stand has saturated blue/dark colors (R < 200),
                # any pixel where R > 220, G > 225, B > 225 is background or shadow.
                is_bg = (r > 220 and g > 225 and b > 225)
                
                if is_bg:
                    visited.add((nx, ny))
                    queue.append((nx, ny))
                    
    print(f"Cleared {count} background/shadow pixels.")
    
    # Crop to bounding box of remaining non-transparent pixels
    min_x, min_y = w, h
    max_x, max_y = 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a > 0:
                if x < min_x: min_x = x
                if y < min_y: min_y = y
                if x > max_x: max_x = x
                if y > max_y: max_y = y
                
    if max_x >= min_x and max_y >= min_y:
        cropped = img.crop((min_x, min_y, max_x + 1, max_y + 1))
        # Ensure parent directories exist
        os.makedirs(os.path.dirname(dest_path2), exist_ok=True)
        cropped.save(dest_path1)
        cropped.save(dest_path2)
        print(f"Successfully saved transparent cropped monitor to {dest_path2} ({cropped.size})")
    else:
        print("Error: Bounding box not found.")

if __name__ == "__main__":
    process_monitor()
