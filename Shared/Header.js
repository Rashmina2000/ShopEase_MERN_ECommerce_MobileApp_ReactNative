import React from "react";
import { StyleSheet, Image, SafeAreaView, View, Text } from "react-native";

const Header = () => {
  return (
    <SafeAreaView style={style.header}>
      <Image
        source={require("../assets/Logo.png")}
        resizeMode="contain"
        style={{ height: 100 }}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 190,
  },
});

export default Header;
