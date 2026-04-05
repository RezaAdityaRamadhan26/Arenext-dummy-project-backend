import jwt  from 'jsonwebtoken';
import prisma from '../prisma.js';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

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

        // Generate token verifikasi email
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // expired 24 jam

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                verificationToken: verificationToken,
                verificationTokenExpiry: verificationTokenExpiry,
            }
        })

        // Kirim email verifikasi via Resend
        const verificationUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`;

        await resend.emails.send({
            from: 'Arenext <onboarding@resend.dev>',
            to: email,
            subject: 'Verifikasi Email Kamu - Arenext',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h1 style="color: #1a1a2e; text-align: center; margin-bottom: 10px;">Selamat Datang, ${name}! 🎉</h1>
                        <p style="color: #555; text-align: center; font-size: 16px;">Terima kasih sudah mendaftar di <strong>Arenext</strong>.</p>
                        <p style="color: #555; text-align: center; font-size: 15px;">Klik tombol di bawah untuk memverifikasi email kamu:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" 
                               style="background-color: #6c63ff; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                                Verifikasi Email
                            </a>
                        </div>
                        <p style="color: #999; text-align: center; font-size: 13px;">Link ini akan kedaluwarsa dalam <strong>24 jam</strong>.</p>
                        <p style="color: #999; text-align: center; font-size: 13px;">Jika kamu tidak merasa mendaftar, abaikan email ini.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                        <p style="color: #bbb; text-align: center; font-size: 12px;">© 2024 Arenext. All rights reserved.</p>
                    </div>
                </div>
            `
        });

        res.status(201).json({
            success: true,
            message: "Registrasi berhasil! Silakan cek email kamu untuk verifikasi akun.",
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

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
        return res.status(404).json({
            success: false,
            message: "email tidak terdaftar",
        });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Password salah!",
            });
        }

        // Cek apakah email sudah diverifikasi
        if (!user.emailVerified) {
            return res.status(403).json({
                success: false,
                message: "Email belum diverifikasi. Silakan cek email kamu dan klik link verifikasi.",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: email,
                role: user.role
            },
            process.env.JWT_SECRET, 
            { expiresIn: "2h" }, // 2 jam token nya
        );
        res.status(200).json({
            success: true,
            message: "Login berhasil!",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal login",
            error: error.message,
        });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        if (!token) {
            // Redirect ke frontend dengan pesan error
            return res.redirect(`${frontendUrl}?verified=false&error=token_not_found`);
        }

        // Cari user dengan token yang cocok dan belum expired
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpiry: {
                    gt: new Date() // token masih berlaku (belum expired)
                }
            }
        });

        if (!user) {
            // Token tidak valid atau sudah expired
            return res.redirect(`${frontendUrl}?verified=false&error=token_invalid_or_expired`);
        }

        // Tandai email sebagai sudah diverifikasi & hapus token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                verificationTokenExpiry: null,
            }
        });

        // Redirect ke halaman utama frontend dengan notif sukses
        return res.redirect(`${frontendUrl}?verified=true`);

    } catch (error) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}?verified=false&error=server_error`);
    }
}