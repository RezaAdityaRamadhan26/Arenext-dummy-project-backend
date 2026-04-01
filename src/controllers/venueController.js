import prisma from '../prisma.js'
import { v2 as cloudinary } from 'cloudinary'; 

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const createVenue = async (req, res) => {
    try {
        const {name, description, pricePerHour} = req.body; 
        let imageUrl = null; 

        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            
            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: "arenext_venues", 
            });
            
            imageUrl = uploadResult.secure_url; 
        }

        const newVenue = await prisma.venue.create({
            data: {
                name: name,
                description: description,
                pricePerHour: Number(pricePerHour),
                image: imageUrl 
            }
        });

        res.status(201).json({
            message: "venue berhasil dibuat",
            status: 201,
            data: newVenue
        });
    } catch (error) {
        res.status(500).json({
            message: "gagal membuat venue",
            status: 500,
            error: error.message
        })
    }
};

export const getAllVenue = async (req, res) => {
    try {
        const venue = await prisma.venue.findMany();
        res.status(200).json({
            success: true,
            data: venue
        })
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: "gagal menampilkan seluruh venue",
            error: error.message
        })
    }
}

export const getVenueById = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = Number(id);

        const venue = await prisma.venue.findUnique({
            where : {
                id: userId
            }
        });
        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "venue tidak ditemukan"
            });
        } else {
            res.status(200).json({
                success: true,
                data: venue
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateVenue = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { name, description, pricePerHour } = req.body;
        const updatedVenue = await prisma.venue.update({
            where: {
                id: id
            },
            data: {
                name: name,
                description: description,
                pricePerHour: Number(pricePerHour)                
            }
        });
        res.status(200).json({
            success:true,
            message:"berhasil mengupdate venue",
            data: updatedVenue
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "gagal mengupdate venue",
            error: error.message
        })
    }
}

export const deleteVenue = async(req, res) => {
    try {
        const id = Number(req.params.id)
            await prisma.venue.delete({
                where: {
                    id: id,
                }
            });
                res.status(200).json({
                    success: true, 
                    message: "venue berhasil dihapus"
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "data gagal dihapus, ada error nih"
        })
    }
}

