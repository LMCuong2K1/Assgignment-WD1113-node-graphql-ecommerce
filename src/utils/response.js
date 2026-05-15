module.exports = {
    success: (res, { data, message, statusCode = 200, count, ...extra }) => {
        const body = { success: true, ...extra };
        if (message) body.message = message;
        if (data !== undefined) body.data = data;
        if (count !== undefined) body.count = count;
        return res.status(statusCode).json(body);
    }
}