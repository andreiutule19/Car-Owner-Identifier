import cv2
import numpy as np
import os
from detect import detect
from license_preprocess import recognize_character, extract_binarized_license_plate,is_contour_inside

import shutil


global count 
count = 0

Min_char = 0.015
Max_char = 0.095

image_path = 'test_images/ane_rotit.jpg'

for filename in os.listdir("./debug"):
    file_path = os.path.join("./debug", filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path) 
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path) 
    except Exception as e:
        print(f"Failed to delete {file_path}. Reason: {e}")


def test_image(image_path = image_path):
    global count
    source_img = cv2.imread(image_path)
    pred = detect(source_img)
    
    license_plate = ""
    for *xyxy, _, _ in reversed(pred):
        
        os.makedirs("debug/"+str(count), exist_ok=True)
        
        image_path = "debug/"+str(count)+"/temp_image_1.jpg"
        cv2.imwrite(image_path, source_img)
        
        x1, y1, x2, y2 = int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])
        rotate_thresh, LP_rotated = extract_binarized_license_plate(source_img, x1, y1, x2, y2)
        
        image_path = "debug/"+str(count)+"/temp_image_2.jpg"
        cv2.imwrite(image_path, rotate_thresh)
        
        if (rotate_thresh is None) or (LP_rotated is None):
            continue
        
        LP_rotated_copy = LP_rotated.copy()
        LP_rotated_copy2 = LP_rotated.copy()
    
        
        cont, hier = cv2.findContours(rotate_thresh,cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
        outer_contours = []
        for i in range(len(cont)):
            if hier[0][i][3] == -1:  
                outer_contours.append(cont[i])
        cont = sorted(outer_contours, key=cv2.contourArea, reverse=True)[:15]

        
        
        for i, contour in enumerate(cont):
            color = (0, 255, 0) if i == 0 else (255, 0, 0) 
            cv2.drawContours(LP_rotated_copy, [contour], -1, color, 2) 
  
        
        image_path = "debug/"+str(count)+"/temp_image_3.jpg"
        cv2.imwrite(image_path, LP_rotated_copy)
        
        char_x = []
        height, width, _ = LP_rotated.shape
        roiarea = height * width
        new_cont =[]
        last_cont = []
        for ind, cnt in enumerate(cont):
            (x, y, w, h) = cv2.boundingRect(cont[ind])
            ratiochar = w / h
            char_area = w * h
           
            cond = (Min_char * roiarea < char_area < Max_char * roiarea)
            if cond and (0.255 < ratiochar < 1.35):
                new_cont.append(cnt)

        for ind, cnt in enumerate(new_cont):
            (x, y, w, h) = cv2.boundingRect(new_cont[ind])
            if is_contour_inside(new_cont,x,y,w,h):
                    continue
            char_x.append([x, y, w, h])
            last_cont.append(cnt)
        if not char_x:
            continue
        
        
        for i, contour in enumerate(last_cont):
            color = (0, 255, 0) if i == 0 else (255, 0, 0)  
            cv2.drawContours(LP_rotated_copy2, [contour], -1, color, 2) 
            
        image_path = "debug/"+str(count)+"/temp_image_4.jpg"
        cv2.imwrite(image_path, LP_rotated_copy2)
        
        
        char_x = np.array(char_x)    
        char_x = sorted(char_x, key=lambda x: x[0], reverse=False)
        first_line = ""
        gray_image = cv2.cvtColor(LP_rotated, cv2.COLOR_BGR2GRAY)
    
        for i, char in enumerate(char_x):
            x, y, w, h = char
            cv2.rectangle(LP_rotated, (x, y), (x + w, y + h), (0, 255, 0), 2)
            imgROI = gray_image[y-3:y + h+1, x-3:x + w+1]
            text = recognize_character(imgROI)
            image_path = "debug/" + str(count)+ "/roi_" + str(i) + ".jpg"
            cv2.imwrite(image_path, imgROI)
            if text == 'Background':
                text = ''

            first_line += text
        license_plate = first_line
        
        count+=1
        print(count)
    return license_plate

if __name__ == "__main__":
    print(test_image())