import os
import numpy as np
from backend.services.preprocessor import decode_image_bytes, resize_for_inference
from backend.services.detector import detector_service

# Actual visible ground truth person counts for the downloaded sample images
GROUND_TRUTH = {
    "frame1.jpg": 1,
    "frame2.jpg": 9,
    "frame3.jpg": 5,
    "frame4.jpg": 1,
    "frame5.jpg": 3,
    "frame6.jpg": 6,
    "frame7.jpg": 5,
    "frame8.jpg": 10,
    "frame9.jpg": 3,
    "frame10.jpg": 8
}

def run_evaluation():
    samples_dir = "backend/samples"
    image_files = sorted([f for f in os.listdir(samples_dir) if f.endswith(".jpg")])

    if not image_files:
        print("No test images found in backend/samples!")
        return

    print(f"Running evaluation benchmark on {len(image_files)} sample test images...\n")

    total_gt_persons = 0
    total_correct_detections = 0
    total_false_positives = 0
    inference_times = []
    confidence_scores = []
    successful_runs = 0

    print(f"{'Image':<14} | {'GT Count':<8} | {'Detected':<8} | {'Avg Conf':<8} | {'Time (ms)':<9} | {'Status'}")
    print("-" * 68)

    for img_name in image_files:
        gt = GROUND_TRUTH.get(img_name, 1)
        total_gt_persons += gt
        img_path = os.path.join(samples_dir, img_name)

        try:
            with open(img_path, "rb") as f:
                img_bytes = f.read()

            img_bgr = decode_image_bytes(img_bytes)
            img_resized = resize_for_inference(img_bgr)

            detections, count, avg_conf, inf_time = detector_service.detect(img_resized)

            successful_runs += 1
            inference_times.append(inf_time)
            if avg_conf > 0:
                confidence_scores.append(avg_conf)

            correct = min(count, gt)
            fp = max(0, count - gt)

            total_correct_detections += correct
            total_false_positives += fp

            print(f"{img_name:<14} | {gt:<8} | {count:<8} | {avg_conf:<8.2f} | {inf_time:<9.1f} | PASSED")
        except Exception as e:
            print(f"{img_name:<14} | {gt:<8} | ERROR    | 0.00     | 0.0       | FAILED ({str(e)})")

    detection_accuracy = (total_correct_detections / total_gt_persons * 100) if total_gt_persons > 0 else 0
    false_positive_pct = (total_false_positives / total_gt_persons * 100) if total_gt_persons > 0 else 0
    avg_inference_sec = (np.mean(inference_times) / 1000.0) if inference_times else 0.0
    mean_confidence = np.mean(confidence_scores) if confidence_scores else 0.0
    reliability_pct = (successful_runs / len(image_files) * 100) if image_files else 0.0

    print("-" * 68)
    print("\n--- BENCHMARK EVALUATION SUMMARY METRICS ---")
    print(f"Total Test Images       : {len(image_files)}")
    print(f"Detection Accuracy      : {detection_accuracy:.2f}% (Target: >= 85%)")
    print(f"False Positives Rate    : {false_positive_pct:.2f}% (Target: <= 10%)")
    print(f"Average Inference Time  : {avg_inference_sec:.4f} seconds (Target: <= 1.5s)")
    print(f"Average Confidence      : {mean_confidence:.4f} (Target: >= 0.70)")
    print(f"System Reliability      : {reliability_pct:.2f}% (Target: 100%)")

    return {
        "accuracy": round(detection_accuracy, 2),
        "fp": round(false_positive_pct, 2),
        "avg_time_sec": round(avg_inference_sec, 4),
        "avg_conf": round(mean_confidence, 4),
        "reliability": round(reliability_pct, 2)
    }

if __name__ == "__main__":
    run_evaluation()
