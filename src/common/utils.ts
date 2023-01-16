import { Base64 } from "js-base64";

export const isEmpty = (value: any) =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === "object" && Object.keys(value).length === 0);

export const getTruncatedAddress = (
  address: string | undefined,
  name: string | undefined,
  owner: string | undefined
) => {
  return (
    address &&
    (address === owner
      ? "ME"
      : isEmpty(name)
      ? address.slice(0, 6) + "..." + address.slice(-4)
      : name)
  );
};

export const decToHex = (num: number) => {
  return ("00" + num.toString(16)).slice(-2);
};

export const encodeDataUri = (uri: string) => {
  return JSON.parse(Base64.fromBase64(uri.slice(29)));
};

export const getColorsFromURI = (uri: string) => {
  return new Promise<string[]>((resolve, reject) => {
    const metadata = encodeDataUri(uri);
    const image = new Image();
    image.src = metadata.image;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx?.drawImage(image, 0, 0);

      const colors: string[] = [];
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const data = ctx?.getImageData(i, j, 1, 1);
          colors[j * 10 + i] = `#${decToHex(data?.data[0] ?? 0)}${decToHex(
            data?.data[1] ?? 0
          )}${decToHex(data?.data[2] ?? 0)}`;
        }
      }
      resolve(colors);
    };
  });
};

export const getBlankImageURI = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 10;
  canvas.height = 10;
  let ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 10, 10);
  }
  return canvas.toDataURL();
};

export const getAbbrAddress = (address: string) => {
  return address.slice(0, 4) + "..." + address.slice(-4);
};

export const getPinchDistance = (touches: TouchList) => {
  if (touches.length === 2) {
    return Math.sqrt(
      Math.pow(touches[0].pageX - touches[1].pageX, 2) +
        Math.pow(touches[0].pageY - touches[1].pageY, 2)
    );
  }
  return 0;
};
