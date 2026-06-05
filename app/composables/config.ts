export const useConfig = () => {
  const config = useLocalStorage("config", {
    mature: false,
    providers: [
      { id: "bl", enabled: true },
      { id: "bw", enabled: true },
      // { id: "bw-p", enabled: false },
      { id: "bw-g", enabled: true },
      // { id: "az", enabled: false },
      // { id: "az-j", enabled: false },
      // { id: "ebj", enabled: true },
      { id: "rb", enabled: true },
      { id: "mb", enabled: true },
    ],
  });

  return { config };
};
