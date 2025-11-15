// src/pages/api/book.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from "resend";
import { getUserEmailTemplate, getAdminEmailTemplate } from "@/utils/email";

const resendKey = process.env.RESEND_EMAIL_SECRET_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

interface BookingBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  date: string;
  timeSlot?: string;
  vehicles?: {
    make: string;
    model: string;
    year: string;
    color: string;
    size?: string;
    vehicleType?: string;
    selectedPackages: string[];
  }[];
  additionalServices?: string[];
  notes?: string;
  totalPrice?: number;
  promoCode?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const body: BookingBody = req.body;

      // ✅ Validate required fields
      if (!body.email || !body.firstName || !body.lastName || !body.date) {
        return res.status(400).json({
          success: false,
          error: "Missing required booking details."
        });
      }

      // ✅ Ensure consistent date format
      const bookingDate = new Date(body.date);
      if (isNaN(bookingDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: "Invalid booking date format."
        });
      }
      if (bookingDate < new Date()) {
        return res.status(400).json({
          success: false,
          error: "Booking date must be in the future."
        });
      }
      body.date = bookingDate.toISOString();

      // ✅ Load env vars safely
      const from = (process.env.FROM_EMAIL ?? "onboarding@resend.dev").trim();
      const admin = (process.env.ADMIN_EMAIL ?? "nomanirshad0324@gmail.com").trim();

      // Validate vehicles array if present
      if (!body.vehicles || !Array.isArray(body.vehicles) || body.vehicles.length === 0) {
        return res.status(400).json({
          success: false,
          error: "At least one vehicle must be provided."
        });
      }

      // Validate each vehicle's required fields
      for (const vehicle of body.vehicles) {
        if (!vehicle.make || !vehicle.model || !vehicle.year || !vehicle.color || !vehicle.selectedPackages) {
          return res.status(400).json({
            success: false,
            error: "Missing required vehicle details."
          });
        }
      }

      // Map body to Booking schema format
      const vehicleBookings = body.vehicles.map((vehicle, index) => ({
        id: `vehicle-${index + 1}`,
        serviceType: "car-detailing",
        variant: vehicle.vehicleType || "standard",
        mainService: "Exterior & Interior Detailing",
        package: vehicle.selectedPackages[0] || "Basic",
        additionalServices: body.additionalServices || [],
        vehicleType: vehicle.vehicleType || "car",
        vehicleMake: vehicle.make,
        vehicleModel: vehicle.model,
        vehicleYear: vehicle.year,
        vehicleColor: vehicle.color,
        vehicleLength: vehicle.size || "",
      }));

      const bookingData = {
        bookingId: `booking-${Date.now()}`,
        webName: "Imperial Auto Detailing",
        formData: {
          vehicleBookings,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone || "",
          address: body.address || "",
          city: body.city || "",
          state: body.state || "",
          zip: body.zip || "",
          date: body.date,
          timeSlot: body.timeSlot || "",
          notes: body.notes || "",
        },
        totalPrice: body.totalPrice || 0,
        discountedPrice: body.totalPrice || 0,
        discountApplied: !!body.promoCode,
        discountPercent: body.promoCode ? 10 : 0,
        promoCode: body.promoCode || "",
        submittedAt: new Date().toISOString(),
        vehicleCount: body.vehicles.length,
        status: "pending",
      };

      // Make API call to external service
      const externalResponse = await fetch("https://car-detailling-dashboard.vercel.app/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!externalResponse.ok) {
        throw new Error(`External API error: ${externalResponse.statusText}`);
      }

      const externalData = await externalResponse.json();

      // ✅ Send emails with proper type handling
      let emailResults = {
        user: null as any,
        admin: null as any,
        emailsSent: false
      };

      if (resend) {
        try {
          const [userResult, adminResult] = await Promise.all([
            resend.emails.send({
              from,
              to: body.email.trim(),
              subject: "✅ Booking Confirmation - Imperial Auto Detailing",
              html: getUserEmailTemplate(body),
            }),
            resend.emails.send({
              from,
              to: admin,
              subject: `📩 New Booking - ${body.firstName} ${body.lastName}`,
              html: getAdminEmailTemplate(body),
            })
          ]);

          emailResults = {
            user: userResult,
            admin: adminResult,
            emailsSent: true
          };

          console.log("✅ Emails sent successfully");
          
        } catch (emailError) {
          console.error("❌ Email sending failed:", emailError);
          emailResults.emailsSent = false;
        }
      } else {
        console.warn("⚠️ No Resend key, skipping emails");
      }

      return res.status(200).json({
        success: true,
        message: emailResults.emailsSent 
          ? "Booking processed and emails sent successfully." 
          : "Booking processed successfully (emails not sent).",
        externalResponse: externalData,
        results: {
          user: emailResults.user,
          admin: emailResults.admin
        },
      });
      
    } catch (error: any) {
      console.error("❌ Booking creation error:", error);
      return res.status(500).json({
        success: false,
        error: error.message ?? "Failed to create booking."
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`
    });
  }
}