import prisma from '../prisma.js'

export const createBooking = async (req, res) => {
  try {
    const { venueId, date, hours, totalPrice } = req.body;
    const userId  = req.user.id

    next();

    const newBooking = await prisma.booking.create({
      data: {
        userId: Number(userId),
        venueId: Number(venueId),
        date: date,
        hours: hours,
        totalPrice: totalPrice
      }
    });

    res.status(201).json({
      success: true,
      message: "booking berhasil dibuat",
      data: newBooking
    });

  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "gagal booking venue",
        error: error.message
    })
  }
};


export const getAllBooking = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: true,
                venue: true
            }
        })
        res.status(200).json({
            success: true,
            message: "berhasil menampilkan semua data booking",
            data: bookings
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "gagal menampilkan semua data booking",
        });
    }
}

export const updateBookingStatus = async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { status } = req.body

        await prisma.booking.update({
            where: {
                id: id
            },
            data: {
                status: status
            }
        }
        )
        res.status(200).json({
            success: true, 
            message: "berhasil update venue"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "gagal update venue",
        });
    }
}