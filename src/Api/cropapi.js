import Baseurl from "./Baseurl";

export const uploadCroppedImage = async (blob, contactId) => {
    try {
        const formData = new FormData();
        formData.append("croppedImage", blob, "croppedImage.png");
        formData.append("contactId", contactId);

        const response = await Baseurl.post("/crop", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error.response?.data || { message: "Unknown upload error" };
    }
};
