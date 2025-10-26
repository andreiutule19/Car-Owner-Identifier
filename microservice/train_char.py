from src.char_classification.model import Character_Detection

model_char = Character_Detection(trainable=True)

model_char.train()
