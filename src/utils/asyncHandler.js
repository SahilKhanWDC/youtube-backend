const asyncHandler = (fn) => async (req,res,next) => {
    try {
        return await fn(req,res,next)
    } catch (error) {
        res.status(500).json({success:false, message: error.message})
    }
}

export { asyncHandler }