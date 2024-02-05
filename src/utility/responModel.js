module.exports = {
    error (code, message) {
        return {
            code,
            message
        }
    },
    success (code, data) {
        return {
            code,
            data
        }
    }
}