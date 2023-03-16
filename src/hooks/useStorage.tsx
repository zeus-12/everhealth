import AsyncStorage from "@react-native-async-storage/async-storage";

const useStorage = (storageName: string) => {
  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem(storageName);
      return data;
    } catch (err) {
      console.log("Error:", err.message);
      return "";
    }
  };

  const setData = async (data: any) => {
    try {
      await AsyncStorage.setItem(storageName, JSON.stringify(data));
    } catch (err) {
      console.log("Error:", err.message);
    }
  };

  return {
    getData,
    setData,
  };
};

export default useStorage;
