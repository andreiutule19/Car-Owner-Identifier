import time

import cv2
import torch
from numpy import random


from models.experimental import attempt_load
from utils.datasets import transform_img
from utils.general import non_max_suppression, scale_coords
from utils.plots import plot_one_box

def detect(image):
    
    device = torch.device("cpu")
    model = attempt_load('LP_detect_yolov7_500img.pt', map_location=device)
    use_half_precision = device.type != 'cpu'  
  
    
    preprocessed_img, original_img = transform_img(image)  
    class_names = model.module.names if hasattr(model, 'module') else model.names
    box_colors = [[255, 0, 0] for _ in class_names]  
    
    preprocessed_img_tensor = torch.from_numpy(preprocessed_img).to(device)  
    preprocessed_img_tensor = preprocessed_img_tensor.half() if use_half_precision else preprocessed_img_tensor.float()  # Convert to float precision
    preprocessed_img_tensor /= 255.0  
    if preprocessed_img_tensor.ndimension() == 3:
        preprocessed_img_tensor = preprocessed_img_tensor.unsqueeze(0)  

    predictions = model(preprocessed_img_tensor, augment=False)[0]  
    predictions = non_max_suppression(predictions, 0.25, 0.45, classes=0, agnostic=False)  # Apply NMS

    final_detections = []
    for detection in predictions:
        if len(detection):
            detection[:, :4] = scale_coords(preprocessed_img_tensor.shape[2:], detection[:, :4], original_img.shape).round()  # Rescale boxes
            final_detections.append(detection)
            for *box_coordinates, confidence, class_idx in reversed(detection):
                label = f'{class_names[int(class_idx)]} {confidence:.2f}'
                plot_one_box(box_coordinates, original_img, label=label, color=box_colors[int(class_idx)], line_thickness=4)  # Plot boxes

    if not final_detections:
        return final_detections

    return final_detections[0].cpu().detach().numpy() 
