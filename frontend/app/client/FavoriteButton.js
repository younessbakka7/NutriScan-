import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";

const FavoriteButton = ({ foodId, token, initialFavorite = false, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const toggleFavorite = async () => {
    if (!token) {
      console.log("Token missing, cannot toggle favorite");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/client/favorite/toggle",
        { food_id: foodId },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setIsFavorite(res.data.favorite);
      if (onToggle) onToggle(res.data.favorite); 
    } catch (error) {
      console.error("Error toggling favorite:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={toggleFavorite} style={{ padding: 8 }} disabled={loading}>
      <MaterialIcons
        name={isFavorite ? "favorite" : "favorite-border"}
        size={24}
        color="#e74c3c"
      />
    </TouchableOpacity>
  );
};

export default FavoriteButton;
