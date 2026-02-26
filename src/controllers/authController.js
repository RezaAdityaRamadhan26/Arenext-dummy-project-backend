import prisma from '../prisma.js';
import bcrypt from 'bcrypt';

export const userRegist = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const regist = await prisma.user.findUnique({
            where : {
                email: email
            }
        })

        if (regist) {
            return res.status(400).json({
                success: false,
                message: "Email sudah ada, tolong ganti email",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        })

        res.status(201).json({
            success: true,
            message: "berhasil register",
            data: { 
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}