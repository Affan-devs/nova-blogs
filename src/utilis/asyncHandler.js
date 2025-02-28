const asyncHandler = (requestHandler) => {
    return (next, req, res) =>{
        try {
            requestHandler(next, req, res)
        } catch (error) {
            next(error)
        }
    }
}
export {asyncHandler}