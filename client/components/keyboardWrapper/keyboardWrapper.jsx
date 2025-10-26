import React from "react";

import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const TouchWrapKeyboard = ({ children }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {children}
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TouchWrapKeyboard ;
