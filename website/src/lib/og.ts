/** Social preview image (1200×630) generated at build time for a page image. */
export const ogPath = (image?: string | null) =>
  image ? `og/${image.split("/").pop()!.replace(/\.(jpe?g|png)$/i, "")}.jpg` : "og/default.jpg";
