import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(400).json({
            message: "token gagal atau tidak ada"
        })
    }
        
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

    } catch (error) {
        res.status(500).json({
            message: "jwt gagal",
            error: error.message
        })
    }
    next();

}

export const authorizeAdmin = (req, res, next) => {
    if (!req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "fitur ini khusus admin, tidak bisa"
        })
    }

    next();

}