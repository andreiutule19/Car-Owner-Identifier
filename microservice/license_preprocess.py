import cv2
import numpy as np
from src.char_classification.model import Character_Detection
import math

CHARACTERS = {0: '0',  1 : '1', 2 : '2' , 3: '3', 4: '4', 5: '5',  6:'6',  7:'7',  8:'8', 
              9:'9' , 10:'A',  11 : 'B',  12: 'C',  13: 'D',  14 : 'E',  15 : 'F',  16 : 'G', 
              17: 'H', 18 : 'I', 19 : 'J',  20 : 'K', 21 : 'L',  22 : 'M', 23 : 'N', 24 :'P',  25 : 'Q', 26 : 'R', 27 : 'S', 
              28 : 'T', 29 : 'U' ,  30 : 'V',  31 : 'W', 32 : 'X' , 33 :  'Y',  34 : 'Z',35: "Background"}

CHAR_CLASSIFICATION_WEIGHTS = './src/weights/weightsec.keras'
MODEL = Character_Detection(trainable=False).model
MODEL.load_weights(CHAR_CLASSIFICATION_WEIGHTS)

GAUSSIAN_BLUR_SIZE = (3, 3)
THRESHOLD_BLOCK_SIZE = 13
THRESHOLD_CONSTANT = 30

def process_image(input_image):
    img_hsv = cv2.cvtColor(input_image, cv2.COLOR_BGR2HSV)
    _, _, value = cv2.split(img_hsv)
    struct_elem = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))

    top_hat = cv2.morphologyEx(value, cv2.MORPH_TOPHAT, struct_elem, iterations=10)
    black_hat = cv2.morphologyEx(value, cv2.MORPH_BLACKHAT, struct_elem, iterations=10)

    enhanced_img = cv2.add(value, top_hat)
    enhanced_img = cv2.subtract(enhanced_img, black_hat)
    blurred_image = cv2.GaussianBlur(enhanced_img, GAUSSIAN_BLUR_SIZE, 0)
    
    threshold_image = cv2.adaptiveThreshold(
        blurred_image, 
        255.0, 
        cv2.ADAPTIVE_THRESH_MEAN_C, 
        cv2.THRESH_BINARY_INV, 
        THRESHOLD_BLOCK_SIZE, 
        THRESHOLD_CONSTANT
    )
    return threshold_image


def apply_rotation(image,lines):
    angles_list = []

    for i in range(0, len(lines)):
        l = lines[i][0].astype(int)
        doi = (l[1] - l[3])
        ke = abs(l[0] - l[2])
        if ke != 0:
            angle = math.degrees(math.atan2(doi, ke))
            if angle < -45:
                angle += 90
            elif angle > 45:
                angle -= 90
            angles_list.append(angle)

    if not angles_list:
        angle = 0
    else:
        angle = np.mean(angles_list)
    
    img_height, img_width = image.shape[:2]
    center_point = (img_width // 2, img_height // 2)
    rotation_matrix = cv2.getRotationMatrix2D(center_point, -angle, 1.0)
    
    rotated_image = cv2.warpAffine(image, rotation_matrix, (img_width, img_height), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return rotated_image

def detect_lines_using_hough(thresh_image):
    img_height, img_width = thresh_image.shape[:2]
    detected_lines = cv2.HoughLinesP(thresh_image, 1, np.pi / 180, 50, None, 50, 10)
    
    if detected_lines is not None:
        distances = []

        for line in detected_lines:
            x1, y1, x2, y2 = line[0]
            line_length = math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

            if line_length < 0.5 * max(img_height, img_width):
                line_length = 0

            distances.append(line_length)

        distances = np.array(distances).reshape(-1, 1, 1)
        lines_with_distances = np.concatenate([detected_lines, distances], axis=2)
        lines_with_distances = sorted(lines_with_distances, key=lambda x: x[0][-1], reverse=True)[:6]

        return lines_with_distances
    else:
        return []

def recognize_character(image):
    resized_image = cv2.resize(image, (28, 28), interpolation=cv2.INTER_AREA)
    prepared_image = resized_image.reshape((28, 28, 1))
    prepared_image = np.asarray(prepared_image)
    batched_image = np.expand_dims(prepared_image, axis=0)
    prediction = MODEL.predict(batched_image)
    predicted_index = np.argmax(prediction, axis=1)
    return CHARACTERS[predicted_index[0]]

def is_contour_inside(cont,my_x,my_y,my_w,my_h):
    
    for ind, _ in enumerate(cont):
        (x, y, w, h) = cv2.boundingRect(cont[ind])
        if x == my_x and y == my_y and w == my_w and h == my_h:
            continue
        cond1 = my_x >= x and my_y >= y and w >= my_w and h >= my_h
        cond2 = (abs(x - my_x) <= my_w * 0.1 and abs(y - my_y) <= my_y * 0.1)
        cond3 = ((abs(abs(x - my_x) - abs(y - my_y)) <= abs(my_x - my_y)) and abs(x - my_x) <= my_x * 0.2 and abs(y - my_y) <= my_y * 0.2)
        center_dist = ((x + w / 2) - (my_x + my_w / 2)) ** 2 + ((y + h / 2) - (my_y + my_h / 2)) ** 2  
        min_center_dist = min(my_w, my_h) * 0.5  

        if cond1 and (cond2 or cond3) and center_dist < min_center_dist ** 2:
            return True  
    return               
                      

def extract_binarized_license_plate(image, x1, y1, x2, y2):
    width = int(x2 - x1)
    height = int(y2 - y1)
    aspect_ratio = width / height
    width_error_margin = round(0.075 * width)
    height_error_margin = round(0.05 * height)

    if 0.8 <= aspect_ratio <= 6.5:
        cropped_lp = image[y1 + height_error_margin:y1 + height - height_error_margin, 
                           x1 + round(1.25 * width_error_margin):x1 + width - round(0.5 * width_error_margin)]
   
        cropped_lp_copy = cropped_lp.copy()
        binary_image = process_image(cropped_lp)
        
        morph_kernel = np.ones((2, 2), np.uint8)
        opened_image = cv2.morphologyEx(binary_image, cv2.MORPH_OPEN, morph_kernel)
        dilated_image = cv2.dilate(opened_image, morph_kernel, iterations=1)
        
        lines = detect_lines_using_hough(opened_image)
        
        for i in range(0,len(lines)):
            square= lines[i][0].astype(int)
            cv2.line(cropped_lp_copy, (square[0],square[1]), (square[2],square[3]), (0, 0, 255), 3, cv2.LINE_AA)

        
        rotated_thresh_image = apply_rotation(dilated_image, lines)
        rotated_lp_image = apply_rotation(cropped_lp, lines)

    else:
        rotated_thresh_image, rotated_lp_image = None, None

    return rotated_thresh_image, rotated_lp_image



