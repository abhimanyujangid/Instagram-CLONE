export const formData = (data: Record<string, unknown>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof FileList) {
      Array.from(value).forEach((file) => formData.append(`${key}[]`, file));
    } else if (value instanceof Array) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, value as string);
    }
  });
  return formData;
};
