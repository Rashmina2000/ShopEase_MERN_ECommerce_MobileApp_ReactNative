import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
} from "react-native";

import ProductList from "./ProductList";

const data = require("../../assets/data/products.json");

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(data);

    return () => {
      setProducts([]);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Product Container</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={products}
          numColumns={2}
          renderItem={({ item }) => <ProductList key={item.id} item={item} />}
          keyExtractor={(item) => item.name}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  listContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

export default ProductContainer;
