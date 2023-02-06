import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import sharp from 'sharp'
import fs, { write } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false
  }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(403).json({error: "method was not POST"})
    }

    const form = new IncomingForm();
    form.parse(req, async function(err, fields, files) {
        console.log("fields are %o", fields)
        console.log("files are", files.file)
        console.log("cwd is ", process.cwd())
        
        const file = Array.isArray(files.file) ? files.file[0] : files.file
        const fileData = fs.readFileSync(file.filepath)
        const writePath = path.join(process.cwd(), file.originalFilename!)
        fs.writeFileSync(writePath, fileData)
        console.log("wrote a file")
        const resizedPath = path.join(process.cwd(), `resized-${file.originalFilename}`)
        await sharp(writePath).resize(128, 128, { fit: 'contain' } ).toFile(resizedPath)
        const resizedImageBinary = fs.readFileSync(resizedPath)
        const resizedImageb64 = resizedImageBinary.toString('base64')
        return res.status(200).json({'img': `data:${file.mimetype};base64,${resizedImageb64}`})
    })
    //console.log("pixelate -- body is %o", req.body)
}