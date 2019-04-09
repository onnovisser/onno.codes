function loadImage(src) {
  return new Promise((yay, nay) => {
    const img = new Image();
    img.onload = () => {
      yay(img);
      img.onload = null;
      img.onerror = null;
    };
    img.onerror = nay;
    img.src = src;
  });
}

export default loadImage;
