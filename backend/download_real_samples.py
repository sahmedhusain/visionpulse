import os
import urllib.request
import cv2
import numpy as np

# Direct public domain image URLs of real people in various environments (1 to 10 people)
SAMPLE_URLS = [
    ("frame1.jpg", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"), # 1 Person
    ("frame2.jpg", "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80"), # 2 People
    ("frame3.jpg", "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"), # 3 People
    ("frame4.jpg", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80"), # 4 People
    ("frame5.jpg", "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80"), # 5 People
    ("frame6.jpg", "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80"), # 6 People
    ("frame7.jpg", "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800&auto=format&fit=crop&q=80"), # 7 People
    ("frame8.jpg", "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80"), # 8 People
    ("frame9.jpg", "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80"), # 9 People
    ("frame10.jpg", "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80") # 10 People
]

def download_samples():
    dirs = ["backend/samples", "frontend/public/samples"]
    for d in dirs:
        os.makedirs(d, exist_ok=True)

    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

    for name, url in SAMPLE_URLS:
        print(f"Downloading sample {name}...")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                img_array = np.asarray(bytearray(response.read()), dtype=np.uint8)
                img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

                if img is not None:
                    # Resize to standard 800x600 resolution
                    img = cv2.resize(img, (800, 600))
                    for d in dirs:
                        cv2.imwrite(os.path.join(d, name), img)
                    print(f"Successfully saved {name}")
                else:
                    print(f"Failed to decode {name}")
        except Exception as e:
            print(f"Error downloading {name}: {e}")

if __name__ == "__main__":
    download_samples()
