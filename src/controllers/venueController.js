import { Prisma } from "@prisma/client";
import { success } from "zod";

export const createVenue = (req, res) => {
    const {name, description, pricePerHour} = req.body; // logika untuk membuat venue baru
    const newVenue = {
      name: name,
      description: description,
      pricePerHour: pricePerHour,
    };
    try {
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

export const getVenueById = async (req, res) => {
    try {
        const venue = await prisma.venue.findUnique({
            where : {
                id: userId
            }
        });
        const id = req.params.id
        const userId = Number(id);
        if (!venue) {
            res.status(404).json({
                success: false,
                message: "Venue not found"
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
        const { name, description, pricePerHour, image } = req.body;
        const updateVenue = await prisma.venue.update({
            where: {
                id: id
            },
            data: {
                name: name,
                description: description,
                pricePerHour: pricePerHour,
                image: image
                
            }
        });
        res.status(200).json({
            success:true,
            message:"berhasil mengupdate venue",
            data:updatedVenue
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
        const id = req.params.id
            const updateVenue = await prisma.venue.delete({
                where: {
                    id: id,
                },
                data: {
                    name: name,
                    description: description,
                    pricePerHour: pricePerHour,
                    image: image,
                },
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

