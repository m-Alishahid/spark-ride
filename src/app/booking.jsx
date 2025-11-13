"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, Check, Car, Package, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  service,
  additionalServices,
  extraServices,
  timeSlots,
  cityStateMap,
  vehicleTypes,
  calculatePrice as baseCalculatePrice,
} from "@/utils/services";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import OrderSummaryAccordion from "@/components/OrderSummary";
import Image from "next/image";

// ✅ Safe wrapper for calculatePrice
const calculatePrice = (
  vehicleType: string,
  packageId: string,
  serviceCategory: string,
  vehicleSize?: number
) => {
  const price = baseCalculatePrice(vehicleType, packageId, serviceCategory, vehicleSize || 0);
  if (!price || isNaN(price)) {
    console.warn("Price not found → defaulting 0", { vehicleType, packageId, serviceCategory, vehicleSize });
    return 0;
  }
  return price;
};

// ---------------- CONFIRMATION MODAL ----------------
const ConfirmationModal = ({ open, onClose, formData, total, subtotal, isPromoValid }: any) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-gray-900 to-black border border-gray-700 text-white">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/lovable-uploads/imperial logo.png" alt="Imperial Auto Detailing Logo - Premium mobile car detailing services - Professional auto detailing company" width={96} height={48} className="w-24 h-12 object-contain" />
          </div>
          <DialogTitle className="text-3xl font-bold text-[#E53935] mb-2 text-center">Booking Confirmed 🎉</DialogTitle>

          <DialogDescription className="text-gray-300 justify-center text-center">
            Thank you <span className="font-semibold text-white">{formData.firstName}</span>!
            Your booking has been successfully scheduled.
            We appreciate your business and look forward to serving you.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 border border-gray-600 rounded-lg bg-gray-800/50 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 text-center text-[#E53935]">Appointment Details</h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <span className="font-medium text-gray-300">Vehicles:</span>
            <span className="text-right text-white">
              {formData.vehicles.map((v: { make: string; model: string; year: string }, i: number) => `${v.make} ${v.model} ${v.year}`).join(", ")}
            </span>
            <span className="font-medium text-gray-300">Date:</span>
            <span className="text-right text-white">
              {formData.date ? new Date(formData.date).toLocaleDateString() : "N/A"}
            </span>
            <span className="font-medium text-gray-300">Time Slot:</span>
            <span className="text-right text-white">{formData.timeSlot || "N/A"}</span>
            <span className="font-medium text-gray-300">Services:</span>
            <span className="text-right text-white">
              {formData.vehicles.some((v: { selectedPackages: string[] }) => v.selectedPackages.length > 0) ? formData.vehicles.flatMap((v: { selectedPackages: string[] }) => v.selectedPackages).join(", ") : "None"}
              {formData.additionalServices.length > 0 && ` + ${formData.additionalServices.join(", ")}`}
            </span>
            <span className="font-medium text-gray-300">Subtotal:</span>
            <span className="text-right text-white">${subtotal.toFixed(2)}</span>
            {isPromoValid && (
              <>
                <span className="font-medium text-green-400">Promo Applied (15% Discount):</span>
                <span className="text-right text-green-400">-${(subtotal - total).toFixed(2)}</span>
              </>
            )}
            <span className="font-medium text-gray-300">Total:</span>
            <span className="font-bold text-[#E53935] text-right">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={onClose} className="w-full bg-[#E53935] text-white hover:bg-[#B22222] transition-all duration-300 font-semibold shadow-lg shadow-[#E53935]/50 hover:shadow-[#E53935]/70 transform hover:scale-105">Close</Button>
        </div>

      </DialogContent>

    </Dialog>

  );

};

// ---------------- MAIN BOOKING COMPONENT ----------------
const Booking = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [date, setDate] = useState<Date | undefined>();
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, "");
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const [formData, setFormData] = useState({
    additionalServices: [] as string[],
    vehicles: [{ make: "", model: "", year: "", color: "", size: "", vehicleType: "", selectedPackages: [] }] as { make: string, model: string, year: string, color: string, size: string, vehicleType: string, selectedPackages: string[] }[],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    date: "",
    timeSlot: "",
    notes: "",
    serviceTypes: [] as string[],
    vehicleType: "",
  });



  // Helpers
  const updateForm = (updates: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...updates }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateForm({ [name]: value } as any);
  };

  const isStep1Valid = () => {
    if (formData.vehicles.length === 0) return false;
    for (const vehicle of formData.vehicles) {
      if (!vehicle.vehicleType) return false;
      if (!vehicle.make.trim() || !vehicle.model.trim() || !vehicle.year.trim() || !vehicle.color.trim()) return false;
      if ((vehicle.vehicleType === "boat" || vehicle.vehicleType === "rv") && !vehicle.size.trim()) return false;
    }
    return true;
  };

  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, { make: "", model: "", year: "", color: "", size: "", vehicleType: "", selectedPackages: [] }]
    }));
  };

  const removeVehicle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index)
    }));
  };

  const updateVehicle = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }));
  };

  const toggleVehiclePackage = (vehicleIndex: number, packageId: string) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map((v, i) => i === vehicleIndex ? {
        ...v,
        selectedPackages: v.selectedPackages.includes(packageId)
          ? v.selectedPackages.filter(p => p !== packageId)
          : [...v.selectedPackages, packageId]
      } : v)
    }));
  };

  const handleCheckboxChange = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(id)
        ? prev.additionalServices.filter((s) => s !== id)
        : [...prev.additionalServices, id],
    }));
  };

  const toggleServiceType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceTypes: [type], // Single selection
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    updateForm({ date: date ? date.toISOString() : "" });
  };



  // ------------------- Booking.tsx -------------------
  const calculateTotalPrice = () => {
    let total = 0;

    // Selected packages per vehicle
    formData.vehicles.forEach((vehicle: any) => {
      vehicle.selectedPackages.forEach((packageId: string) => {
        if (Object.keys(extraServices.ceramiccoating).includes(packageId)) {
          total += extraServices.ceramiccoating[packageId]?.price || 0;
        } else if (Object.keys(extraServices.windowtinting).includes(packageId)) {
          total += extraServices.windowtinting[packageId]?.price || 0;
        } else {
          // Parse serviceCategory from packageId (e.g., "interior-basic" -> "interior")
          const serviceCategory = packageId.split("-")[0];
          total += calculatePrice(
            vehicle.vehicleType || formData.vehicleType,
            packageId,
            serviceCategory,
            Number(vehicle.size)
          );
        }
      });
    });

    // Additional services
    formData.additionalServices.forEach((id: string) => {
      const add = additionalServices.find((a) => a.id === id);
      if (add) total += add.price;
    });

    return total;
  };

  const totalPrice = calculateTotalPrice();
  const discountedPrice = isPromoValid ? totalPrice * 0.85 : totalPrice;

  // Steps validation
  const validateStep = () => {
    if (step === 1) {
      if (formData.vehicles.length === 0) {
        toast({ title: "Missing Vehicle Info ❌", description: "Please add at least one vehicle." });
        return false;
      }
      for (const vehicle of formData.vehicles) {
        if (!vehicle.vehicleType) {
          toast({ title: "Missing Vehicle Info ❌", description: "Please select a vehicle type for each vehicle." });
          return false;
        }
        if (!vehicle.make.trim() || !vehicle.model.trim() || !vehicle.year.trim() || !vehicle.color.trim()) {
          toast({ title: "Missing Vehicle Info ❌", description: "Please fill all required fields for each vehicle." });
          return false;
        }
        if ((vehicle.vehicleType === "boat" || vehicle.vehicleType === "rv") && !vehicle.size.trim()) {
          toast({ title: "Missing Vehicle Info ❌", description: "Please enter size for each vehicle." });
          return false;
        }
      }
    }
    if (step === 2 && !formData.vehicles.some(v => v.selectedPackages.length > 0)) {
      toast({ title: "Missing Service ❌", description: "Please select at least one package for at least one vehicle." });
      return false;
    }
    if (step === 3 && !formData.firstName) {
      toast({ title: "Missing Info ❌", description: "Please enter your first name." });
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setDirection(1);
      setStep(step + 1);
    }
  };
  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, totalPrice: discountedPrice }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Booking failed");
      }

      const result = await response.json();
      setShowConfirmation(true);
      toast({ title: "Booking Successful ✅", description: "Your booking is confirmed." });
    } catch (error: any) {

    } finally {
      setIsSubmitting(false);
    }
  };

  // Animations
  const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const firstVehicle = formData.vehicles[0];
  const firstVehicleComplete = firstVehicle && firstVehicle.vehicleType && firstVehicle.make.trim() && firstVehicle.model.trim() && firstVehicle.year.trim() && firstVehicle.color.trim() && ((firstVehicle.vehicleType === "boat" || firstVehicle.vehicleType === "rv") ? firstVehicle.size.trim() : true);

  return (
    <div className="min-h-screen bg-black text-white font-serif">
      <Navbar />
      <br/>
      <div className="pt-32 pb-16 flex justify-center relative">

        <div className="w-full max-w-6xl px-4 flex flex-col lg:flex-row gap-8 relative z-10">
          {/* 🧭 Mobile Horizontal Progress Bar */}
          <div className="md:hidden flex justify-center mb-6">
            <div className="flex items-center rounded-full p-4 w-full shadow-lg justify-center">
              {[
                { label: "Vehicles", icon: <Car size={16} /> },
                { label: "Package", icon: <Package size={16} /> },
                { label: "Info", icon: <User size={16} /> },
              ].map(({ label, icon }, i) => {
                const isActive = step === i + 1;
                const isCompleted = step > i + 1;

              return (
                <div key={i}>
                  {i > 0 && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 32, opacity: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.15 + 0.1 }}
                      className="h-0.5 rounded-full"
                      style={{
                        backgroundColor: step > i ? "#B22222" : "#555555",
                      }}
                    />
                  )}
                  <div className="flex flex-col items-center space-y-1">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.15 }}
                      className={`flex items-center justify-center rounded-full w-8 h-8 border-2 shadow-md
                        ${isActive
                          ? "border-[#E53935] bg-[#E53935] text-white shadow-[#E53935]/40"
                          : isCompleted
                            ? "border-[#B22222] bg-[#B22222] text-white shadow-[#B22222]/30"
                            : "border-gray-600 text-gray-400 bg-[#111]"
                        }`}
                    >
                      {icon}
                    </motion.div>
                    <span className={`text-xs font-medium ${isActive
                        ? "text-[#E53935]"
                        : isCompleted
                          ? "text-[#B22222]"
                          : "text-gray-400"
                      }`}>
                      {label}
                    </span>
                  </div>
                </div>
              );
              })}
            </div>
          </div>

          {/* 🧭 Vertical Progress Bar with Icons and Animation */}
          <div className="hidden lg:flex lg:w-1/4 flex-col items-start space-y-6 pr-6 border-r border-[#E53935]/30">
            {[
              {
                label: "Vehicles Info",
                icon: <Car size={18} className="inline-block" />,
              },
              {
                label: "Package",
                icon: <Package size={18} className="inline-block" />,
              },
              {
                label: "Customer Info",
                icon: <User size={18} className="inline-block" />,
              },
            ].map(({ label, icon }, i) => {
              const isActive = step === i + 1;
              const isCompleted = step > i + 1;

              return (
                <div key={i} className="relative flex items-center space-x-3 w-full">
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.15 }}
                    className={`flex items-center justify-center rounded-full w-10 h-10 border-2 shadow-md
            ${isActive
                        ? "border-[#E53935] bg-[#E53935] text-white shadow-[#E53935]/40"
                        : isCompleted
                          ? "border-[#B22222] bg-[#B22222] text-white shadow-[#B22222]/30"
                          : "border-gray-600 text-gray-400 bg-[#111]"
                      }`}
                  >
                    {icon}
                  </motion.div>

                  {/* Label */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.15 + 0.1 }}
                    className={`font-semibold text-sm tracking-wide ${isActive
                        ? "text-[#E53935]"
                        : isCompleted
                          ? "text-[#B22222]"
                          : "text-gray-400"
                      }`}
                  >
                    {label}
                  </motion.div>

                  {/* Vertical Connector Line */}
                  {i < 2 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 40, opacity: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.15 + 0.2 }}
                      className="absolute left-[1.25rem] top-[2rem] w-0.5 rounded-full"
                      style={{
                        backgroundColor: isCompleted ? "#B22222" : "#555555",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>


          <Card className="lg:w-3/4 border border-white/30 shadow-2xl bg-white/5 backdrop-blur-md rounded-3xl">
            <CardContent className="p-6 md:p-10">
              <form onSubmit={handleSubmit}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="space-y-6"
                    >
                      <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-4xl font-extrabold text-white flex items-center tracking-wide"
                      >
                        <Sparkles className="mr-3 text-[#E53935]" size={20} />
                        Vehicle Information
                      </motion.h2>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <Select value={formData.vehicleType} onValueChange={(v) => setFormData(prev => ({ ...prev, vehicleType: v, vehicles: prev.vehicles.map((veh, i) => i === 0 ? { ...veh, vehicleType: v } : veh) }))}>
                          <SelectTrigger className="h-10 md:h-12 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-800 border-gray-600 text-white placeholder-gray-400">
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedan">🚗 Sedan</SelectItem>
                            <SelectItem value="suv">🚙 SUV</SelectItem>
                            <SelectItem value="truck">🚛 Truck</SelectItem>
                            <SelectItem value="van">🚐 Van</SelectItem>
                            <SelectItem value="boat">⛵ Boat</SelectItem>
                            <SelectItem value="rv">🏠 RV</SelectItem>
                            <SelectItem value="jetski">🏄 Jet Ski</SelectItem>
                            <SelectItem value="bike">🏍️ Bike</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {formData.vehicleType && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="space-y-4"
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-white">Vehicles</h3>
                            </div>
                            {formData.vehicles.map((vehicle, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="border border-gray-600 rounded-lg p-4 bg-gray-800/50"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-white font-medium">Your Vehicle</h4>
                                  {formData.vehicles.length > 1 && (
                                    <Button onClick={() => removeVehicle(index)} className="bg-red-600 text-white hover:bg-red-700 text-sm">
                                      Remove
                                    </Button>
                                  )}
                                </div>
                                <div className="mb-4">
                                  {vehicle.vehicleType ? (
                                    <div className="text-white font-semibold flex items-center space-x-2">
                                      {(() => {
                                        switch (vehicle.vehicleType) {
                                          case "sedan":
                                            return "🚗 Sedan";
                                          case "suv":
                                            return "🚙 SUV";
                                          case "truck":
                                            return "🚛 Truck";
                                          case "van":
                                            return "🚐 Van";
                                          case "boat":
                                            return "⛵ Boat";
                                          case "rv":
                                            return "🏠 RV";
                                          case "jetski":
                                            return "🏄 Jet Ski";
                                          case "bike":
                                            return "🏍️ Bike";
                                          default:
                                            return vehicle.vehicleType;
                                        }
                                      })()}
                                    </div>
                                  ) : (
                                    <Select value={vehicle.vehicleType} onValueChange={(v) => updateVehicle(index, 'vehicleType', v)}>
                                      <SelectTrigger className="h-10 md:h-12 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-800 border-gray-600 text-white placeholder-gray-400">
                                        <SelectValue placeholder="Select vehicle type *" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="sedan">🚗 Sedan</SelectItem>
                                        <SelectItem value="suv">🚙 SUV</SelectItem>
                                        <SelectItem value="truck">🚛 Truck</SelectItem>
                                        <SelectItem value="van">🚐 Van</SelectItem>
                                        <SelectItem value="boat">⛵ Boat</SelectItem>
                                        <SelectItem value="rv">🏠 RV</SelectItem>
                                        <SelectItem value="jetski">🏄 Jet Ski</SelectItem>
                                        <SelectItem value="bike">🏍️ Bike</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <Input
                                    placeholder="Make *"
                                    value={vehicle.make}
                                    onChange={(e) => updateVehicle(index, 'make', e.target.value)}
                                    className="h-10 md:h-12"
                                    required
                                  />
                                  <Input
                                    placeholder="Model *"
                                    value={vehicle.model}
                                    onChange={(e) => updateVehicle(index, 'model', e.target.value)}
                                    className="h-10 md:h-12"
                                    required
                                  />
                                  <Input
                                    placeholder="Year *"
                                    value={vehicle.year}
                                    onChange={(e) => updateVehicle(index, 'year', e.target.value)}
                                    className="h-10 md:h-12"
                                    required
                                  />
                                  <Input
                                    placeholder="Color *"
                                    value={vehicle.color}
                                    onChange={(e) => updateVehicle(index, 'color', e.target.value)}
                                    className="h-10 md:h-12"
                                    required
                                  />
                                  {(vehicle.vehicleType === "boat" || vehicle.vehicleType === "rv") && (
                                    <Input
                                      placeholder="Size (ft) *"
                                      value={vehicle.size}
                                      onChange={(e) => updateVehicle(index, 'size', e.target.value)}
                                      className="h-10 md:h-12"
                                      required
                                    />
                                  )}
                                </div>

                              </motion.div>
                            ))}
                          </motion.div>
                        </>
                      )}

                      {/* Navigation for Step 1 */}
                      {firstVehicleComplete && <Button onClick={addVehicle} className="bg-[#E53935] text-white hover:bg-[#FF6F61]">Add Vehicle</Button>}
                      <div className="flex justify-end mt-6">
                        <Button onClick={nextStep} disabled={!isStep1Valid()} className="bg-[#E53935] text-white hover:bg-[#FF6F61]">
                          Next
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2 - Package & Services */}
                  {step === 2 && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeIn}
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-semibold text-white">Select Service Type</h2>

                      {/* Service Type Selector */}
                      <div className="flex space-x-4 mb-4">
                        {(formData.vehicleType === "bike" ? ["detailing"] : ["detailing", "ceramiccoating", "window_tinting"]).map((type) => {
                          const isSelected = formData.serviceTypes.includes(type);
                          const label = type === "detailing" ? "Detailing" : type === "ceramiccoating" ? "Ceramic Coating" : "Window Tinting";
                          return (
                            <div
                              key={type}
                              className={`p-2 border rounded-lg cursor-pointer hover:shadow-lg transition ${isSelected ? "bg-gray-100 border-black text-black" : "text-white"
                                }`}
                              onClick={() => toggleServiceType(type)}
                            >
                              <div className="font-medium text-sm">{label}</div>
                              {isSelected && (
                                <p className="text-xs text-green-600 flex items-center mt-1">
                                  <Check size={12} className="mr-1" /> Selected
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>



                      {/* Service Packages per Vehicle */}
                      {formData.vehicleType && formData.serviceTypes.length > 0 && (
                        <div className="space-y-6">
                          {formData.vehicles.map((vehicle, vehicleIndex) => (
                            <div key={vehicleIndex} className="border border-gray-600 rounded-lg p-4 bg-gray-800/50">
                              <h4 className="text-white font-medium mb-4">
                                {vehicle.make} {vehicle.model} {vehicle.year} ({vehicleTypes.find(v => v.id === vehicle.vehicleType)?.name || vehicle.vehicleType})
                              </h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                {formData.serviceTypes.includes("detailing") && (
                                  <>
                                    {Object.entries(service[vehicle.vehicleType] || {}).map(
                                      ([serviceCategory, packagesOrService]) => {
                                        // All vehicle types have nested detailing packages
                                        return Object.entries(packagesOrService as any).map(
                                          ([packageKey, pkg]) => {
                                            const packageId = `${serviceCategory}-${packageKey}`;
                                            const isSelected = vehicle.selectedPackages.includes(packageId);
                                            const price = calculatePrice(
                                              vehicle.vehicleType,
                                              packageId,
                                              serviceCategory,
                                              Number(vehicle.size)
                                            );

                                            return (
                                              <div
                                                key={packageId}
                                                className={`p-2 border rounded-lg cursor-pointer hover:shadow-lg transition ${isSelected ? "bg-gray-100 border-black text-black" : "text-white"
                                                  }`}
                                                onClick={() => toggleVehiclePackage(vehicleIndex, packageId)}
                                              >
                                                <div className="flex justify-between font-medium text-sm">
                                                  <span>{(pkg as { name: string }).name}</span>
                                                  <span>${price}</span>
                                                </div>

                                                <ul className="text-xs mt-1 list-disc pl-3 space-y-1">
                                                  {Array.isArray((pkg as { includes?: string[] | string }).includes)
                                                    ? (pkg as { includes?: string[] }).includes?.map(
                                                      (i: string, idx: number) => <li key={idx}>{i}</li>
                                                    )
                                                    : typeof (pkg as { includes?: string }).includes === "string"
                                                      ? (pkg as { includes?: string }).includes
                                                        ?.split(",")
                                                        .map((i: string, idx: number) => <li key={idx}>{i.trim()}</li>)
                                                      : null}
                                                </ul>

                                                {isSelected && (
                                                  <p className="text-xs text-green-600 flex items-center mt-1">
                                                    <Check size={12} className="mr-1" /> Selected
                                                  </p>
                                                )}
                                              </div>
                                            );
                                          }
                                        );
                                      }
                                    )}
                                  </>
                                )}

                                {formData.serviceTypes.includes("ceramiccoating") && (
                                  <>
                                    {Object.entries(extraServices.ceramiccoating).map(([packageKey, pkg]) => {
                                      const packageId = packageKey;
                                      const isSelected = vehicle.selectedPackages.includes(packageId);
                                      const price = pkg.price;

                                      return (
                                        <div
                                          key={packageId}
                                          className={`p-2 border rounded-lg cursor-pointer hover:shadow-lg transition ${isSelected ? "bg-gray-100 border-black text-black" : "text-white"}`}
                                          onClick={() => toggleVehiclePackage(vehicleIndex, packageId)}
                                        >
                                          <div className="flex justify-between font-medium text-sm">
                                            <span>{pkg.name}</span>
                                            <span>${price}</span>
                                          </div>

                                          <ul className="text-xs mt-1 list-disc pl-3 space-y-1">
                                            {pkg.includes.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
                                          </ul>

                                          {isSelected && (
                                            <p className="text-xs text-green-600 flex items-center mt-1">
                                              <Check size={12} className="mr-1" /> Selected
                                            </p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </>
                                )}

                                {formData.serviceTypes.includes("window_tinting") && (
                                  <>
                                    {Object.entries(extraServices.windowtinting).map(([packageKey, pkg]) => {
                                      const packageId = packageKey;
                                      const isSelected = vehicle.selectedPackages.includes(packageId);
                                      const price = pkg.price;

                                      return (
                                        <div
                                          key={packageId}
                                          className={`p-2 border rounded-lg cursor-pointer hover:shadow-lg transition ${isSelected ? "bg-gray-100 border-black text-black" : "text-white"}`}
                                          onClick={() => toggleVehiclePackage(vehicleIndex, packageId)}
                                        >
                                          <div className="flex justify-between font-medium text-sm">
                                            <span>{pkg.name}</span>
                                            <span>${price}</span>
                                          </div>

                                          <ul className="text-xs mt-1 list-disc pl-3 space-y-1">
                                            {pkg.includes.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
                                          </ul>

                                          {isSelected && (
                                            <p className="text-xs text-green-600 flex items-center mt-1">
                                              <Check size={12} className="mr-1" /> Selected
                                            </p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add-ons */}
                      {formData.vehicles.some(v => v.selectedPackages.length > 0) && (
                        <div>
                          <h3 className="font-medium mt-4 text-white">Add-ons</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {additionalServices.map((svc) => (
                              <div key={svc.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={svc.id}
                                  checked={formData.additionalServices.includes(svc.id)}
                                  onCheckedChange={() => handleCheckboxChange(svc.id)}
                                />
                                <Label htmlFor={svc.id} className="text-white">
                                  {svc.name} – ${svc.price}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between mt-6 0">
                        <Button onClick={prevStep} className="bg-[#E53935] text-[#FFFFFF] hover:bg-[#FF6F61]">Back</Button>
                        <Button
                          onClick={nextStep}
                          disabled={!formData.vehicles.some(v => v.selectedPackages.length > 0)}
                          className="bg-[#E53935] text-[#FFFFFF] hover:bg-[#FF6F61]"
                        >
                          Next
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3 - Customer Info */}
                  {step === 3 && (
                    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
                      <h2 className="text-xl font-semibold">Customer Info</h2>

                      {/* Name */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleInputChange} required />
                        <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} />
                      </div>

                      {/* Email + Phone */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleInputChange} required />
                        <Input
                          name="phone"
                          placeholder="Phone *"
                          value={formData.phone}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            setFormData((prev) => ({ ...prev, phone: formatted }));
                          }}
                          required
                        />
                      </div>

                      {/* Address */}
                      <Input name="address" placeholder="Address *" value={formData.address} onChange={handleInputChange} required />

                      {/* City + State + Zip */}
                      <div className="grid md:grid-cols-3 gap-4">
                        {/* City */}
                        <Input
                          required
                          name="city"
                          value={formData.city}
                          onChange={(e) => {
                            const city = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              city,
                              state: cityStateMap[city] || "" // auto-fill if exists
                            }));
                          }}
                          placeholder="City *"
                          className="bg-white text-black"
                        />

                        {/* State */}
                        <Input
                          required
                          name="state"
                          value={formData.state}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, state: e.target.value }))
                          }
                          placeholder="State *"
                          className="bg-white text-black"
                          readOnly={!!formData.city && !!cityStateMap[formData.city]} // lock if city matches
                        />

                        {/* Zip */}
                        <Input
                          required
                          name="zip"
                          value={formData.zip}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, zip: e.target.value }))
                          }
                          placeholder="Zip *"
                          className="bg-white text-black"
                          maxLength={5}
                        />
                      </div>

                      {/* Date & Time */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Calendar */}
                        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn("w-full justify-start bg-white text-black", !date && "text-muted-foreground")}
                              onClick={() => setOpenCalendar(true)}
                            >
                              <CalendarIcon className="mr-2 h-4 w-6" />
                              {date ? format(date, "PPP") : "Pick a date *"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(day) => {
                                handleDateChange(day);
                                setOpenCalendar(false);
                              }}
                              disabled={(day) => day < new Date()}
                            />
                          </PopoverContent>
                        </Popover>

                        {/* Time Slots */}
                        <Select
                          value={formData.timeSlot}
                          onValueChange={(val) => setFormData((prev) => ({ ...prev, timeSlot: val }))}
                        >
                          <SelectTrigger className="w-full bg-white text-black">
                            <SelectValue placeholder="Select time slot *" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Notes */}
                      <Textarea
                        name="notes"
                        placeholder="Any special instructions?"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="bg-white text-black"
                      />

                      {/* Promo Code */}
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="Enter Promo Code (Optional)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="bg-white text-black"
                        />
                        {promoCode.trim() !== "" && (
                          <Button
                            type="button"
                            onClick={() => {
                              if (promoCode.toLowerCase() === "discount15") {
                                setIsPromoValid(true);
                                toast({ title: "Promo Applied ✅", description: "15% discount applied." });
                              } else {
                                setIsPromoValid(false);
                                toast({ title: "Invalid Promo ❌", description: "Please try another code.", variant: "destructive" });
                              }
                            }}
                            className="bg-[#E53935] text-[#FFFFFF] hover:bg-[#FF6F61]"
                          >
                            Apply
                          </Button>
                        )}
                      </div>


                      {/* Order Summary */}
                      <OrderSummaryAccordion
                        formData={formData}
                        totalPrice={totalPrice}
                        discountedPrice={discountedPrice}
                        isPromoValid={isPromoValid}
                      />

                      {/* Navigation */}
                      <div className="flex justify-between">
                        <Button type="button" onClick={prevStep} className="bg-[#E53935] text-[#FFFFFF] hover:bg-[#FF6F61]">
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || !formData.email}
                          className="bg-[#E53935] text-[#FFFFFF] hover:bg-[#FF6F61]"
                        >
                          {isSubmitting ? "Submitting..." : "Confirm Booking"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          router.push("/"); // redirect after close
        }}
        formData={formData}
        total={discountedPrice}
        subtotal={totalPrice}
        isPromoValid={isPromoValid}
      />
    </div>
  );
};

export default Booking;