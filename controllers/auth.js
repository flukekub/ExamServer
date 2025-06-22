import User from '../models/User.js';

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if(!email || !password) {
        return res.status(400).json({success: false, msg:"Please provide an email and password"});
    }
    try {
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({success: false, msg:"Please provide an email and password"});
    }
    try {
        const user = await User.findOne({ email }).select('+password'); 
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        const token = user.getSignedJwtToken();
        res.status(200).json({
            success: true,
            token
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}
export const logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        
    });
    res.status(200).json({
        success: true,
        data: {}
    });
}
