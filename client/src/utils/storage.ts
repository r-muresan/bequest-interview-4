// Store data and signature in localStorage
export const storeBackup = (data: string, signature: string) => {
  localStorage.setItem("backupData", JSON.stringify({ data, signature }));
};

// Retrieve data and signature from localStorage
export const getBackup = () => {
  const backup = localStorage.getItem("backupData");
  if (backup) {
    return JSON.parse(backup);
  }
  return null;
};
