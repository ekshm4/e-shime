import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, Star } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

interface TherapistBookingProps {
  darkMode: boolean;
}

interface Therapist {
  id: number;
  name: string;
  specialization: string;
  languages: string[];
  rating: number;
  experience: string;
  avatar: string;
}

const therapists: Therapist[] = [
  {
    id: 1,
    name: "Dr. Amani Uwase",
    specialization: "Trauma & PTSD",
    languages: ["Kinyarwanda", "English", "French"],
    rating: 4.9,
    experience: "12 years",
    avatar: "👩🏾‍⚕️"
  },
  {
    id: 2,
    name: "Dr. Jean Mugabo",
    specialization: "Anxiety & Depression",
    languages: ["Kinyarwanda", "English"],
    rating: 4.8,
    experience: "8 years",
    avatar: "👨🏾‍⚕️"
  },
  {
    id: 3,
    name: "Dr. Grace Mutesi",
    specialization: "Youth & Family Counseling",
    languages: ["Kinyarwanda", "English", "Swahili"],
    rating: 4.9,
    experience: "10 years",
    avatar: "👩🏾‍⚕️"
  },
  {
    id: 4,
    name: "Dr. David Nkusi",
    specialization: "Stress & Burnout",
    languages: ["Kinyarwanda", "English"],
    rating: 4.7,
    experience: "6 years",
    avatar: "👨🏾‍⚕️"
  },
];

const availableSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"
];

export function TherapistBooking({ darkMode }: TherapistBookingProps) {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleBooking = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      setIsConfirmed(false);
      setSelectedTherapist(null);
      setSelectedTime(null);
    }, 3000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#F5F5DC]'} transition-colors duration-300 pb-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>
            Book a Therapist
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Connect with licensed therapists who understand your culture and language
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Therapist Selection */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                Choose Your Therapist
              </h2>
              <div className="grid gap-4">
                {therapists.map((therapist, index) => (
                  <motion.div
                    key={therapist.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Card
                      onClick={() => setSelectedTherapist(therapist)}
                      className={`${
                        selectedTherapist?.id === therapist.id
                          ? darkMode
                            ? 'bg-gray-700 border-beige'
                            : 'bg-white border-black'
                          : darkMode
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                          : 'bg-white hover:border-gray-300'
                      } p-6 cursor-pointer transition-all border-2`}
                    >
                      <div className="flex gap-4">
                        <div className="text-5xl">{therapist.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-1`}>
                                {therapist.name}
                              </h3>
                              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {therapist.specialization}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className={darkMode ? 'text-white' : 'text-black'}>
                                {therapist.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {therapist.languages.map((lang, i) => (
                              <span
                                key={i}
                                className={`text-xs px-2 py-1 rounded ${
                                  darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {therapist.experience} experience
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Panel */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-6`}>
                <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                  Select Date & Time
                </h3>

                {selectedTherapist ? (
                  <>
                    {/* Selected Therapist Info */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{selectedTherapist.avatar}</span>
                        <div>
                          <p className={`${darkMode ? 'text-white' : 'text-black'}`}>
                            {selectedTherapist.name}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {selectedTherapist.specialization}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Calendar */}
                    <div className="mb-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className={`rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                        disabled={(date: Date) => date < new Date()}
                      />
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div className="mb-4">
                        <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Available Time Slots
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`p-2 rounded-lg transition-all ${
                                selectedTime === slot
                                  ? darkMode
                                    ? 'bg-beige text-black'
                                    : 'bg-black text-white'
                                  : darkMode
                                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-black'
                              }`}
                            >
                              <Clock className="h-4 w-4 mx-auto mb-1" />
                              <span className="text-xs">{slot}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Book Button */}
                    <Button
                      onClick={handleBooking}
                      disabled={!selectedDate || !selectedTime}
                      className={`w-full ${darkMode ? 'bg-beige text-black hover:bg-beige/90' : 'bg-black text-white hover:bg-black/90'}`}
                    >
                      Confirm Booking
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <User className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Select a therapist to continue
                    </p>
                  </div>
                )}
              </Card>

              {/* Info Card */}
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-6 mt-4`}>
                <h4 className={`${darkMode ? 'text-white' : 'text-black'} mb-3`}>
                  Session Information
                </h4>
                <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Sessions are 50 minutes long</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>All sessions are confidential</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>You can reschedule up to 24 hours before</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Virtual sessions available</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmed} onOpenChange={setIsConfirmed}>
        <DialogContent className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={darkMode ? 'text-white' : 'text-black'}>
              Booking Confirmed!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className={`h-20 w-20 mx-auto mb-4 ${darkMode ? 'text-beige' : 'text-green-500'}`} />
            </motion.div>
            <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>
              Your session is booked!
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
              Session with {selectedTherapist?.name}
            </p>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {selectedDate?.toLocaleDateString()} at {selectedTime}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
              You'll receive a confirmation email shortly
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
