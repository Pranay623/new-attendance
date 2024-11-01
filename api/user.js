import express from 'express';

const router = express.Router();
import us from '../models/Model.js';
import bcrypt from 'bcrypt';
import User from '../models/Model.js';
import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Path to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Name the file with timestamp
  }
});
const upload = multer({ storage: storage }).single('file');
// Signup route
router.post('/signup', upload, async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    
    // Validation checks
    if (name === "" || email === "" || password === "") {
        return res.json({
            status: "Failed",
            message: "Empty fields, including image",
        });
    }

    if (!req.file) {
        return res.json({
            status: "Failed",
            message: "Image is required"
        });
    }

    if (!/^[a-zA-Z ]*$/.test(name)) {
        return res.json({
            status: "Failed",
            message: "Invalid name",
        });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.json({
            status: "Failed",
            message: "Invalid e-mail",
        });
    }

    if (password.length < 8) {
        return res.json({
            status: "Failed",
            message: "Password is too short",
        });
    }

    try {
        const existingUser = await User.find({ email });

        if (existingUser.length) {
            return res.json({
                status: "Failed",
                message: "User with this email already exists",
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            image: req.file.filename // Save the uploaded image filename
        });

        const result = await newUser.save();
        res.json({
            status: "SUCCESS",
            message: "Signup successful",
            data: result,
        });

    } catch (err) {
        console.error(err);
        res.json({
            status: "Failed",
            message: "An error occurred while processing your request",
        });
    }
});

// Signin route
router.post('/signin', async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            status: "Failed",
            message: "Empty credentials",
        });
    }

    email = email.trim();
    password = password.trim();

    try {
        const user = await User.find({ email });

        if (user.length > 0) {
            const hashedPassword = user[0].password;

            const isMatch = await bcrypt.compare(password, hashedPassword);

            if (isMatch) {
                return res.json({
                    status: "SUCCESS",
                    message: "Sign in successful",
                    data: user[0]
                });
            } else {
                return res.json({
                    status: "Failed",
                    message: "Invalid password",
                });
            }
        } else {
            return res.json({
                status: "Failed",
                message: "Invalid credentials entered",
            });
        }

    } catch (err) {
        console.error(err);
        return res.json({
            status: "Failed",
            message: "An error occurred while checking credentials",
        });
    }
});

export default router;