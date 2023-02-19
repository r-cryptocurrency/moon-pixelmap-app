import { FC, useState } from "react"


const ImageUpload : FC = () => {
    const [image, setImage] = useState<string | Blob | null>(null);
    const [createObjectURL, setCreateObjectURL] = useState<ReturnType<typeof URL.createObjectURL> | null>(null);   
    const [respImage, setRespImage] = useState<string | undefined>(undefined)


    console.log("image is %o", image)
    console.log("Createobj is %o", createObjectURL)
    
    const uploadToClient = (event: any) => {
        if (event.target.files && event.target.files[0]) {
          const i = event.target.files[0];
    
          setImage(i);
          setCreateObjectURL(URL.createObjectURL(i));
        }
      };
    
      const uploadToServer = async (event: any) => {
        const body = new FormData();
        image && body.append("file", image);
        const response = await fetch("/api/pixelate-image", {
          method: "POST",
          body
        });
        const b = await response.json()
        console.log("image upload: response is %o", b)
        setRespImage(b.resizedImage)
      };
    return (<>
        <p>asdf</p>
        <input type='file' name='image-attachment' onChange={uploadToClient} />
        <button type='submit' onClick={uploadToServer}>
            submit
        </button>
        { respImage && <img src={respImage} alt='asdf' />}
    </>)
}
export default ImageUpload