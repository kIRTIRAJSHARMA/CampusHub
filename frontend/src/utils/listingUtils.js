export const placeholderImage =
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80";

export const normalizeProduct = (item) => ({
  ...item,
  id: item._id || item.id,
  image: item.images?.[0]?.url || item.image || placeholderImage,
  seller: item.seller?.name || item.seller || "CampusHub Seller",
  sellerId: item.seller?._id || item.seller?.id || item.sellerId,
  sellerProfile: item.seller,
  rating: item.averageRating || item.rating || 0,
  reviewCount: item.reviewCount || 0,
});

export const normalizeRoom = (item) => ({
  ...item,
  id: item._id || item.id,
  image: item.images?.[0]?.url || item.image || placeholderImage,
  available: item.availability || item.available || "Available soon",
  owner: item.owner?.name || item.owner || "CampusHub Owner",
  ownerId: item.owner?._id || item.owner?.id || item.ownerId,
  ownerProfile: item.owner,
  rating: item.averageRating || item.rating || 0,
  reviewCount: item.reviewCount || 0,
});

export const readImageFiles = (files, limit = 6) =>
  Promise.all(
    Array.from(files)
      .slice(0, limit)
      .map(
        (file) =>
          new Promise((resolve, reject) => {
            if (!file.type.startsWith("image/")) {
              reject(new Error("Only image files are allowed"));
              return;
            }

            if (file.size > 2 * 1024 * 1024) {
              reject(new Error("Each image must be under 2 MB"));
              return;
            }

            const reader = new FileReader();
            reader.onload = () => resolve({ url: reader.result, publicId: file.name });
            reader.onerror = () => reject(new Error("Could not read image"));
            reader.readAsDataURL(file);
          })
      )
  );
