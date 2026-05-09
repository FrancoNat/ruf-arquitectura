export const siteConfig = {
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "rufarquitectura@gmail.com",
    location: process.env.NEXT_PUBLIC_CONTACT_LOCATION || "Buenos Aires, Argentina",
    modality: process.env.NEXT_PUBLIC_CONTACT_MODALITY || "atención online",
    phoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || "+54 9 1176619112",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491176619112",
  },
};

export function getWhatsappUrl(message = "") {
  const baseUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}
