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

const RESIZE_DIMENSIONS = [10, 10] // x px, y px

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(403).json({error: "method was not POST"})
    }

    const form = new IncomingForm();
    form.parse(req, async function(err, fields, files) {
      if (err) {
        return res.status(400).json(err)
      }
        
      const base = process.env.NODE_ENV === 'production' ? '/tmp' : process.cwd()

      const file = Array.isArray(files.file) ? files.file[0] : files.file

      const fileData = fs.readFileSync(file.filepath)
      const writePath = path.join(base, file.originalFilename ?? 'filename')
      fs.writeFileSync(writePath, fileData)


      const resizedPath = path.join(base, `resized-${file.originalFilename}`)
      
      await sharp(writePath).resize(
        RESIZE_DIMENSIONS[0], 
        RESIZE_DIMENSIONS[1], 
        { fit: 'contain' } 
      ).toFile(resizedPath)
      
      const resizedImageBinary = fs.readFileSync(resizedPath)
      const resizedImageb64 = resizedImageBinary.toString('base64')
      
      return res.status(200).json({
        resizedImage: `data:${file.mimetype};base64,${resizedImageb64}`,
        dimensions: RESIZE_DIMENSIONS,
      })
    })
}