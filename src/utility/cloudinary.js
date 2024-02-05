const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: "politeknik-negeri-manado",
    api_key: "393677344445273",
    api_secret: "SdHWIzBVa6BkyB_qm5xFdS9PzYI"
});

const CloudinaryUpload = async (file, opts) => {

    const data = {
        folder: opts.folder,
    }

    if (opts.type) {
        data.resource_type = opts.type,
        data.eager_async= true,
        data.eager= {quality: 50}
    }

    const cloudinaryUpload = await cloudinary.uploader.upload(file, data)

    return cloudinaryUpload
}


const CloudinaryDelete = async (file) => {
    const cloudinaryDelete = await cloudinary.uploader.destroy(file, {
        resource_type: "image"
    })

    return cloudinaryDelete
}


module.exports = {
    CloudinaryUpload,
    CloudinaryDelete
}