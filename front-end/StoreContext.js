const fetchFoods = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/foods/all', {
      withCredentials: true // Include credentials in requests
    });
    setFoods(response.data.foods);
  } catch (err) {
    setError(err.message);
    console.error('Error fetching foods:', err);
  }
};