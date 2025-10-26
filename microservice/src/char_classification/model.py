import numpy as np
from keras import optimizers
from keras.layers import Dense, Conv2D, MaxPooling2D, Dropout, Flatten
from keras.callbacks import ReduceLROnPlateau, ModelCheckpoint
from keras.models import Sequential
import tensorflow as tf
from keras.utils import get_custom_objects
from keras.layers import Activation
from sklearn.metrics import confusion_matrix, classification_report

class Character_Detection(object):
    def __init__(self, trainable=True,img_width = 28,img_height = 28):
        self.batch_size = 128
        self.trainable = trainable
        self.img_width = img_width
        self.img_height = img_height
        self.input_shape = (self.img_height, self.img_width, 1)  
        self._build_model()
        self.model.compile(loss="categorical_crossentropy", optimizer=optimizers.Adam(1e-3), metrics=['acc'])
        if trainable:
            self.model.summary()

        
    def _build_model(self):
        def mish(x):
            return x * tf.math.tanh(tf.math.softplus(x))
        get_custom_objects().update({'mish': Activation(mish)})
        self.model = Sequential()
        self.model.add(Conv2D(32, (3, 3), padding='same', activation='relu', input_shape=self.input_shape ))
        self.model.add(Conv2D(32, (3, 3), activation='relu'))
        self.model.add(MaxPooling2D(pool_size=(2, 2)))
        self.model.add(Dropout(0.25))

        self.model.add(Conv2D(64, (3, 3), padding='same', activation='mish'))
        self.model.add(Conv2D(64, (3, 3), activation='mish'))
        self.model.add(MaxPooling2D(pool_size=(2, 2)))
        self.model.add(Dropout(0.25))

        self.model.add(Flatten())
        self.model.add(Dense(512, activation='relu'))
        self.model.add(Dropout(0.5))
        self.model.add(Dense(35, activation='softmax'))
    
               
    def train(self):
        reduce_lr = ReduceLROnPlateau(monitor='val_acc', factor=0.2, patience=5, verbose=1)
        cpt_save = ModelCheckpoint('src/weights/weightsec.keras', save_best_only=True, monitor='val_acc', mode='max')
        print("Training......")
        train_loader = tf.keras.preprocessing.image_dataset_from_directory(
                        "outputi/train/",
                        seed=123,
                        image_size=(self.img_height, self.img_width),
                        batch_size=self.batch_size,
                        color_mode="grayscale"  
        )

        validation_loader = tf.keras.preprocessing.image_dataset_from_directory(
                        "outputi/val/",
                        seed=123,
                        image_size=(self.img_height, self.img_width),
                        batch_size=self.batch_size,
                        color_mode="grayscale"  
        )
        train_loader = train_loader.map(lambda x, y: (x, tf.one_hot(y, depth=35)))
        validation_loader = validation_loader.map(lambda x, y: (x, tf.one_hot(y, depth=35)))

        AUTOTUNE = tf.data.AUTOTUNE

        train_dataset = train_loader.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
        val_dataset = validation_loader.cache().prefetch(buffer_size=AUTOTUNE)
      
        self.model.fit(train_dataset,validation_data=val_dataset, callbacks=[cpt_save, reduce_lr],
                       epochs=10)
        
        test_loader = tf.keras.preprocessing.image_dataset_from_directory(
                        "outputi/test/",
                        seed=123,
                        image_size=(self.img_height, self.img_width),
                        batch_size=self.batch_size,
                        color_mode="grayscale"  
        )
        test_loader = test_loader.map(lambda x, y: (x, tf.one_hot(y, depth=35)))
        test_dataset = test_loader.cache().prefetch(buffer_size=AUTOTUNE)

       
        loss, accuracy = self.model.evaluate(test_dataset)
        print(f'Test accuracy: {accuracy:.4f}')
        print(f'Loss: {loss:.4f}')
        
        y_true = np.concatenate([y.numpy() for x, y in test_dataset], axis=0)
        y_true = np.argmax(y_true, axis=1)
        y_pred = np.argmax(self.model.predict(test_dataset), axis=1)

        cm = confusion_matrix(y_true, y_pred)

        class_accuracy = cm.diagonal() / cm.sum(axis=1)
        for i, acc in enumerate(class_accuracy):
            print(f'Class {i} accuracy: {acc:.4f}')

        print(classification_report(y_true, y_pred, target_names=[f'Class {i}' for i in range(35)]))

