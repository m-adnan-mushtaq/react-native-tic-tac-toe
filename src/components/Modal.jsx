import {
  Text,
  Modal,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import modalBg from "../../assets/modal.png";
import btnBg from "../../assets/action.png";
const UiModal = ({ show, onClose, message, handleReset }) => {
  return (
    <Modal
      transparent
      onRequestClose={onClose}
      visible={show}
      animationType="slide"
      style={{
        flex: 1,
      }}
    >
      <Pressable
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        onPress={onClose}
      >
        <ImageBackground
          source={modalBg}
          resizeMode="cover"
          style={{
            width: 250,
            height: 400,
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
            paddingHorizontal: 16,
            gap: 16,
          }}
        >
          <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            {message}
          </Text>
          <TouchableOpacity onPress={handleReset}>
            <ImageBackground
              source={btnBg}
              style={{
                width: 80,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>Reset</Text>
            </ImageBackground>
          </TouchableOpacity>
        </ImageBackground>
      </Pressable>
    </Modal>
  );
};

export default UiModal;
