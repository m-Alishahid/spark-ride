
// utils/email.ts
import { format } from "date-fns";
import { service, serviceTypes, additionalServices, vehicleTypes, extraServices } from "@/utils/services";

export const getVehicleTypeName = (vehicleTypeId: string) => {
  const vehicleType = vehicleTypes.find((v) => v.id === vehicleTypeId);
  return vehicleType?.name || vehicleTypeId;
};

const site = process.env.NEXT_PUBLIC_SITE_URL || "";
const adminEmail = process.env.ADMIN_EMAIL || "imperialautodetailing@gmail.com";

// ✅ Base template wrapper
const baseTemplate = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />


  <title>Imperial Auto Detailing - ${title}</title>
  <style>



    body { font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif; background: #000; margin:0; padding:20px; color:#fff; }
    .container { max-width:700px; margin:0 auto; background:#1a1a1a; border-radius:20px; overflow:hidden; box-shadow:0 20px 40px rgba(255,0,0,0.1); }
    .header { background: linear-gradient(135deg, #000 0%, #ff0000 100%); text-align:center; padding:60px 30px; color:#fff; position:relative; border-bottom:5px solid #ff0000; }
    .logo { width:120px; height:60px; object-fit:cover; border-radius:15px; position:absolute; left:30px; top:50%; transform:translateY(-50%); box-shadow:0 4px 8px rgba(255,0,0,0.5); border:3px solid #ff0000; }
    .heading { color:#fff; font-size:28px; font-weight:900; margin:0; text-transform:uppercase; letter-spacing:2px; text-shadow:2px 2px 4px rgba(255,0,0,0.5); }
    .content { padding:40px; line-height:1.8; background:#2a2a2a; }
    .content h2 { color:#ff0000; font-size:24px; margin-bottom:15px; font-weight:700; border-left:5px solid #ff0000; padding-left:15px; }
    .content p { font-size:16px; margin-bottom:20px; color:#ccc; }
    .card { background: #333; border:1px solid #555; border-radius:15px; padding:25px; margin-bottom:25px; box-shadow:0 5px 15px rgba(0,0,0,0.3); }
    .card h3 { color:#ff0000; margin-bottom:15px; font-size:18px; border-bottom:3px solid #ff0000; display:inline-block; padding-bottom:8px; font-weight:600; }
    .card p { margin:10px 0; font-size:15px; color:#eee; }
    .footer { background: #000; text-align:center; padding:30px; color:#fff; font-size:14px; border-top:5px solid #ff0000; }
    .footer a { color:#ff0000; text-decoration:none; font-weight:600; }
    .footer a:hover { text-decoration:underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
<img src="${site}/logo.png"
     alt="Imperial Auto Detailing  Logo"
     style="width: 150px; height: auto;" />
      <h1 class="heading">${title}</h1>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <p>If you have any questions, contact us at
      <a href="mailto:info@imperialautodetailing.com">info@imperialautodetailing.com</a>.</p>
      <p>&copy; ${new Date().getFullYear()} Imperial Auto Detailing . All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// ✅ Helper: format selected packages
const formatSelectedPackages = (selectedPackages: string[], vehicleType: string, vehicleSize?: number) =>
  (selectedPackages || [])
    .map((packageId) => {
      if (Object.keys(extraServices.windowtinting).includes(packageId)) {
        const pkg = extraServices.windowtinting[packageId];
        if (pkg) {
          return `<span style="color:#ff0000;">${pkg.name}</span> ($${pkg.price})`;
        }
      } else if (Object.keys(extraServices.ceramiccoating).includes(packageId)) {
        const pkg = extraServices.ceramiccoating[packageId];
        if (pkg) {
          return `<span style="color:#ff0000;">${pkg.name}</span> ($${pkg.price})`;
        }
      } else if (packageId === "ceramic_coating") {
        return `<span style="color:#ff0000;">Ceramic Coating Package</span> ($500)`;
      } else if (packageId.includes("-")) {
        // Car type: "interior-basic"
        const [serviceCategory, packageKey] = packageId.split("-");
        const pkg = service[vehicleType]?.[serviceCategory]?.[packageKey];
        if (pkg) {
          return `<span style="color:#ff0000;">${pkg.name}</span> ($${pkg.price})`;
        }
      } else {
        // Boat/RV type: "interior"
        const pkg = service[vehicleType]?.[packageId];
        if (pkg) {
          const price = pkg.pricePerFt ? pkg.pricePerFt * (vehicleSize || 0) : pkg.price || 0;
          return `<span style="color:#ff0000;">${pkg.name}</span> ($${price})`;
        }
      }
      return "";
    })
    .filter(Boolean)
    .join("<br>");

// ✅ Helper: format add-ons
const formatAddons = (addons: string[]) =>
  (addons || [])
    .map((serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId);
      return service ? `${service.name} ($${service.price})` : "";
    })
    .filter(Boolean)
    .join("<br>");

// ✅ Admin template
export const getAdminEmailTemplate = (formData: any) => {
  const addonsList = formatAddons(formData.additionalServices);
  const formattedDate = formData.date ? format(new Date(formData.date), "MMMM d, yyyy") : "";

  // Format vehicles info for multiple vehicles
  const vehiclesInfo = (formData.vehicles || [])
    .map((vehicle: any, index: number) => {
      const vehicleTypeInfo = getVehicleTypeName(vehicle.vehicleType || "");
      const vehicleDetails = `${vehicle.year || ""} ${vehicle.make || ""} ${vehicle.model || ""} (${vehicle.color || "N/A"})`;
      const selectedPackagesInfo = formatSelectedPackages(vehicle.selectedPackages, vehicle.vehicleType || "", Number(vehicle.size));
      return `
        <div class="card">
          <h3>🚗 Vehicle ${index + 1}</h3>
          <p><strong>Type:</strong> ${vehicleTypeInfo}</p>
          <p><strong>Details:</strong> ${vehicleDetails}</p>
          ${vehicle.size ? `<p><strong>Size:</strong> ${vehicle.size} feet</p>` : ""}
          ${selectedPackagesInfo ? `<h4>🛠 Selected Services</h4><p>${selectedPackagesInfo}</p>` : ""}
        </div>
      `;
    })
    .join("");

  const content = `
    <h2>New Booking Received</h2>

    <div class="card">
      <h3>👤 Customer Info</h3>
      <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Address:</strong> ${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}</p>
    </div>

    ${vehiclesInfo}

    ${addonsList ? `<div class="card"><h3>➕ Add-ons</h3><p>${addonsList}</p></div>` : ""}

    <div class="card">
      <h3>📅 Appointment</h3>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${formData.timeSlot}</p>
    </div>

    ${formData.notes ? `<div class="card"><h3>📝 Notes</h3><p>${formData.notes}</p></div>` : ""}

    <div class="card">
      <h3>💲 Pricing</h3>
      <p><strong>Total:</strong> $${formData.totalPrice}</p>
      ${formData.promoCode ? `<p><strong>Promo Applied:</strong> ${formData.promoCode} ✅</p>` : ""}
    </div>
  `;

  return baseTemplate("New Booking Notification", content);
};

// ✅ User template
export const getUserEmailTemplate = (formData: any) => {
  const addonsList = formatAddons(formData.additionalServices);
  const formattedDate = formData.date ? format(new Date(formData.date), "MMMM d, yyyy") : "";

  // Format vehicles info for multiple vehicles
  const vehiclesInfo = (formData.vehicles || [])
    .map((vehicle: any, index: number) => {
      const vehicleTypeInfo = getVehicleTypeName(vehicle.vehicleType || "");
      const vehicleDetails = `${vehicle.year || ""} ${vehicle.make || ""} ${vehicle.model || ""} (${vehicle.color || "N/A"})`;
      const selectedPackagesInfo = formatSelectedPackages(vehicle.selectedPackages, vehicle.vehicleType || "", Number(vehicle.size));
      return `
        <div class="card">
          <h3>🚗 Vehicle ${index + 1}</h3>
          <p><strong>Type:</strong> ${vehicleTypeInfo}</p>
          <p><strong>Details:</strong> ${vehicleDetails}</p>
          ${vehicle.size ? `<p><strong>Size:</strong> ${vehicle.size} feet</p>` : ""}
          ${selectedPackagesInfo ? `<h4>🛠 Selected Services</h4><p>${selectedPackagesInfo}</p>` : ""}
        </div>
      `;
    })
    .join("");

  const content = `
    <h2>Thank you for your booking!</h2>
    <p>Hi <strong>${formData.firstName}</strong>,</p>
    <p>We’ve <span style="color:#ff0000; font-weight:bold;">successfully received</span> your booking. Here are your details:</p>

    <div class="card">
      <h3>🛠 Service Details</h3>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${formData.timeSlot}</p>
    </div>

    ${vehiclesInfo}

    ${addonsList ? `<div class="card"><h3>➕ Add-ons</h3><p>${addonsList}</p></div>` : ""}

    <div class="card">
      <h3>📍 Location</h3>
      <p>${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}</p>
    </div>

    ${formData.notes ? `<div class="card"><h3>📝 Notes</h3><p>${formData.notes}</p></div>` : ""}

    <p>We look forward to serving you! If you need changes, contact us at <b style="color:#ff0000;">info@imperialautodetailing.com</b>.</p>
  `;

  return baseTemplate("Booking Confirmation", content);
};