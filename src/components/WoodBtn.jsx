import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import React from "react";

import WoodBg from "../../assets/wodden-btn.png";
const WoodBtn = ({ onClick, children, active }) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <ImageBackground
        style={{
          minWidth: 80,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          opacity: active ? 1 : 0.7,
          elevation: active ? 8 : 0,
        }}
        source={WoodBg}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textTransform: "uppercase",
            padding: 4,
            verticalAlign: "middle",
            color: active ? "white" : "#713f12",
          }}
        >
          {children}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default WoodBtn;
