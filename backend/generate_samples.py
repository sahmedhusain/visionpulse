import os
import cv2
import numpy as np

def draw_person_silhouette(img, x, y, scale=1.0, shirt_color=(200, 100, 50), pants_color=(50, 50, 150)):
    h, w, _ = img.shape
    head_r = int(18 * scale)
    torso_h = int(60 * scale)
    torso_w = int(32 * scale)
    leg_h = int(70 * scale)
    leg_w = int(12 * scale)

    # Head
    head_center = (x, y - torso_h // 2 - head_r)
    cv2.circle(img, head_center, head_r, (230, 200, 180), -1)

    # Torso (Shirt)
    top_left = (x - torso_w // 2, y - torso_h // 2)
    bottom_right = (x + torso_w // 2, y + torso_h // 2)
    cv2.rectangle(img, top_left, bottom_right, shirt_color, -1)

    # Legs (Pants)
    cv2.rectangle(img, (x - torso_w // 2 + 2, y + torso_h // 2), (x - 2, y + torso_h // 2 + leg_h), pants_color, -1)
    cv2.rectangle(img, (x + 2, y + torso_h // 2), (x + torso_w // 2 - 2, y + torso_h // 2 + leg_h), pants_color, -1)

def generate_sample_images():
    dirs = ["backend/samples", "frontend/public/samples"]
    for d in dirs:
        os.makedirs(d, exist_ok=True)

    configs = [
        {"name": "frame1.jpg", "bg": (240, 240, 245), "count": 1, "label": "Single Person at Entrance"},
        {"name": "frame2.jpg", "bg": (230, 235, 240), "count": 2, "label": "Two People Walking"},
        {"name": "frame3.jpg", "bg": (220, 225, 230), "count": 3, "label": "Small Group Discussion"},
        {"name": "frame4.jpg", "bg": (210, 215, 220), "count": 4, "label": "Office Lobby Crowd"},
        {"name": "frame5.jpg", "bg": (200, 205, 210), "count": 5, "label": "Store Queue"},
        {"name": "frame6.jpg", "bg": (190, 195, 200), "count": 6, "label": "Warehouse Inspection"},
        {"name": "frame7.jpg", "bg": (180, 185, 190), "count": 7, "label": "Classroom Gathering"},
        {"name": "frame8.jpg", "bg": (170, 175, 180), "count": 8, "label": "Conference Hall"},
        {"name": "frame9.jpg", "bg": (160, 165, 170), "count": 9, "label": "Restricted Zone Entry"},
        {"name": "frame10.jpg", "bg": (150, 155, 160), "count": 10, "label": "High Density Hallway"}
    ]

    colors = [
        ((180, 60, 50), (40, 40, 120)),
        ((40, 140, 60), (30, 30, 80)),
        ((50, 80, 180), (50, 50, 50)),
        ((160, 50, 140), (60, 60, 100)),
        ((30, 140, 160), (40, 80, 40)),
        ((140, 140, 40), (80, 40, 80))
    ]

    for cfg in configs:
        img = np.full((600, 800, 3), cfg["bg"], dtype=np.uint8)

        # Draw grid background lines
        for gx in range(0, 800, 100):
            cv2.line(img, (gx, 0), (gx, 600), (220, 220, 220), 1)
        for gy in range(0, 600, 100):
            cv2.line(img, (0, gy), (800, gy), (220, 220, 220), 1)

        # Title Banner
        cv2.rectangle(img, (0, 0), (800, 50), (40, 45, 60), -1)
        cv2.putText(img, f"Detecto Sample - {cfg['label']}", (20, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        # People positioning
        num_people = cfg["count"]
        cols = min(num_people, 5)
        for i in range(num_people):
            col = i % 5
            row = i // 5
            x = 120 + col * 140 + (row * 30)
            y = 220 + row * 180
            shirt, pants = colors[i % len(colors)]
            draw_person_silhouette(img, x, y, scale=1.1, shirt_color=shirt, pants_color=pants)

        for d in dirs:
            file_path = os.path.join(d, cfg["name"])
            cv2.imwrite(file_path, img)

    print("Successfully generated 10 sample images!")

if __name__ == "__main__":
    generate_sample_images()
