import upload from '../utils/multer/index';

export const uploadImage = upload.array('images', 10);
