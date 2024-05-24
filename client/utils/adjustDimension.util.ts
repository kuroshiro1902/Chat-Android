const _maxWidth = 300;
const _maxHeight = 500;
interface IDimension {
  width: number;
  height: number;
}
export const adjustDimension = (dimension: IDimension, maxSize?: IDimension): IDimension => {
  const maxWidth = maxSize?.width ?? _maxWidth;
  const maxHeight = maxSize?.height ?? _maxHeight;
  const { width, height } = dimension;
  let newWidth = width;
  let newHeight = height;

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (newHeight / height) * width;
  }

  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = (newWidth / width) * height;
  }

  return {
    width: newWidth,
    height: newHeight,
  };
};
